"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Train, Info, Check, X } from "lucide-react";
import { useAuth } from "@/app/store/useAuth";

interface PasswordRequirementProps {
  text: string;
  isMet: boolean;
}

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface ValidationState {
  minLength: boolean;
  hasNumber: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
}

const PasswordRequirement: React.FC<PasswordRequirementProps> = ({
  text,
  isMet,
}) => (
  <div className="flex items-center space-x-2">
    {isMet ? (
      <Check className="w-4 h-4 text-green-500" />
    ) : (
      <X className="w-4 h-4 text-red-500" />
    )}
    <span className={isMet ? "text-green-600" : "text-red-600"}>{text}</span>
  </div>
);

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  // Client-side only states
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const [validations, setValidations] = useState<ValidationState>({
    minLength: false,
    hasNumber: false,
    hasUpperCase: false,
    hasLowerCase: false,
  });

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const validatePassword = (password: string): void => {
    setValidations({
      minLength: password.length >= 6,
      hasNumber: /\d/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
    });
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    validatePassword(newPassword);
  };

  const isPasswordValid = Object.values(validations).every(Boolean);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isNameValid = formData.name.length >= 2;

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!isPasswordValid || !isEmailValid || !isNameValid) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      toast.success("Registration successful!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything until mounted (client-side)
  if (!mounted) {
    return null;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(to top left, #bdc2e8, #bdc2e8, #e6dee9)",
      }}
    >
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg border border-gray-100">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center">
            <Train className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Input
                  placeholder="Username"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`w-full bg-white ${
                    !isNameValid && formData.name ? "border-red-500" : ""
                  }`}
                  required
                />
                {!isNameValid && formData.name && (
                  <p className="text-red-500 text-sm mt-1">
                    Name must be at least 2 characters
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full bg-white ${
                    !isEmailValid && formData.email ? "border-red-500" : ""
                  }`}
                  required
                />
                {!isEmailValid && formData.email && (
                  <p className="text-red-500 text-sm mt-1">
                    Please enter a valid email address
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  onFocus={() => setShowPasswordRequirements(true)}
                  className={`w-full bg-white pr-10 ${
                    !isPasswordValid && formData.password
                      ? "border-red-500"
                      : ""
                  }`}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() =>
                    setShowPasswordRequirements(!showPasswordRequirements)
                  }
                >
                  <Info
                    className={`w-5 h-5 ${
                      showPasswordRequirements
                        ? "text-primary"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              </div>

              {showPasswordRequirements && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200 space-y-2">
                  <PasswordRequirement
                    text="At least 6 characters"
                    isMet={validations.minLength}
                  />
                  <PasswordRequirement
                    text="Contains a number"
                    isMet={validations.hasNumber}
                  />
                  <PasswordRequirement
                    text="Contains an uppercase letter"
                    isMet={validations.hasUpperCase}
                  />
                  <PasswordRequirement
                    text="Contains a lowercase letter"
                    isMet={validations.hasLowerCase}
                  />
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading || !isPasswordValid || !isEmailValid || !isNameValid
              }
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground mt-2 w-full">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

// // src/app/(auth)/register/page.tsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { toast } from "react-hot-toast";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Train } from "lucide-react";
// import { useAuth } from "@/app/store/useAuth";

// export default function RegisterPage() {
//   const router = useRouter();
//   const { register } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       await register(formData.name, formData.email, formData.password);

//       toast.success("Registration successful! ");
//       router.push("/login");
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Registration failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center p-4"
//       style={{
//         background: "linear-gradient(to top left, #bdc2e8, #bdc2e8, #e6dee9)",
//       }}
//     >
//       <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg border border-gray-100">
//         <CardHeader className="space-y-1">
//           <div className="flex items-center justify-center">
//             <Train className="w-12 h-12 text-primary" />
//           </div>
//           <CardTitle className="text-2xl font-bold text-center">
//             Create Account
//           </CardTitle>
//           <CardDescription className="text-center">
//             Enter your details to create your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <Input
//                 placeholder="Username"
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//                 className="w-full bg-white"
//                 required
//               />
//             </div>
//             <div>
//               <Input
//                 type="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//                 className="w-full bg-white"
//                 required
//               />
//             </div>
//             <div>
//               <Input
//                 type="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={(e) =>
//                   setFormData({ ...formData, password: e.target.value })
//                 }
//                 className="w-full bg-white"
//                 required
//                 minLength={6}
//               />
//             </div>
//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? (
//                 <div className="flex items-center justify-center">
//                   <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
//                   Creating Account...
//                 </div>
//               ) : (
//                 "Create Account"
//               )}
//             </Button>
//           </form>
//         </CardContent>
//         <CardFooter>
//           <p className="text-center text-sm text-muted-foreground mt-2 w-full">
//             Already have an account?{" "}
//             <Link
//               href="/login"
//               className="text-primary hover:underline font-medium"
//             >
//               Sign in
//             </Link>
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }
