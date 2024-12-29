// User types
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface RegisterUserInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// We can also add response types for better type safety
export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}
