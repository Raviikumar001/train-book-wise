// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
