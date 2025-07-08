// src/app/for-employers/register/page.tsx
import AuthForm from "@/components/auth/AuthForm";
import AuthPageLayout from "@/components/auth/AuthPageLayout";

export default function EmployerRegisterPage() {
  return (
    <AuthPageLayout>
      <AuthForm mode="register" role="EMPLOYER" />
    </AuthPageLayout>
  );
}