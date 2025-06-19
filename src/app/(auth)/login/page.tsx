// src/app/(auth)/login/page.tsx

import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div>
      <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Sign in to your account
      </h2>
      <div className="mt-10">
        <LoginForm />
      </div>
    </div>
  );
}
