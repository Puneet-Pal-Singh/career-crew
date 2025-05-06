// src/app/register/page.tsx
import AuthForm from '@/components/auth/AuthForm'; // Adjust path if needed

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <AuthForm
          mode="register"
          apiEndpoint="/api/auth/register"
          // Redirect to login after successful registration, or show a message
          successRedirectPath="/login?registered=true"
          // Or, for a message instead of redirect:
          // onSuccessMessage="Registration successful! Please log in."
        />
      </div>
    </div>
  );
}