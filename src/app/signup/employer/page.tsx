// src/app/signup/employer/page.tsx
import AuthForm from "@/components/auth/AuthForm";
import AuthPageLayout from "@/components/auth/AuthPageLayout";

export default function EmployerSignUpPage() {
  return (
    <AuthPageLayout>
      <AuthForm mode="register" role="EMPLOYER" />
    </AuthPageLayout>
  );
}