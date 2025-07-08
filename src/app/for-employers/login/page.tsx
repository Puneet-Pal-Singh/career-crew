// src/app/for-employers/login/page.tsx
import AuthForm from "@/components/auth/AuthForm";
import AuthPageLayout from "@/components/auth/AuthPageLayout";

export default function EmployerLoginPage() {
  return (
    <AuthPageLayout>
      <AuthForm mode="login" role="EMPLOYER" />
    </AuthPageLayout>
  );
}