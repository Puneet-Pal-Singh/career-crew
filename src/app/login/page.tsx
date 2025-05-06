// src/app/login/page.tsx
import AuthForm from '@/components/auth/AuthForm'; // Adjust path if needed

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <AuthForm
          mode="login"
          apiEndpoint="/api/auth/login"
          successRedirectPath="/dashboard" // Example: redirect to a general dashboard page
        />
      </div>
    </div>
  );
}