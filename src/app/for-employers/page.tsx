// src/app/for-employers/page.tsx
import Link from "next/link";
export default function ForEmployersPage() {
  return (
    <div className="text-center p-20">
      <h1 className="text-4xl font-bold">Employer Landing Page</h1>
      <p className="mt-4">Find, connect, and hire your team.</p>
      <div className="mt-8 space-x-4">
          <Link href="/for-employers/register" className="p-3 bg-primary text-primary-foreground rounded-md">Sign Up Now</Link>
          <Link href="/for-employers/login" className="p-3 bg-secondary text-secondary-foreground rounded-md">Employer Login</Link>
      </div>
    </div>
  );
}