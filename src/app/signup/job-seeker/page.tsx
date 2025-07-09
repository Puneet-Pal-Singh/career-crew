// src/app/signup/job-seeker/page.tsx
import AuthForm from "@/components/auth/AuthForm";
import AuthPageLayout from "@/components/auth/AuthPageLayout";

export default function JobSeekerSignUpPage() {
  return (
    <AuthPageLayout>
      <AuthForm mode="register" role="JOB_SEEKER" />
    </AuthPageLayout>
  );
}