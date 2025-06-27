import Link from "next/link";
import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div>
      <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Sign in to your account
      </h2>
      <div className="mt-10">
        <LoginForm />
        <div className="mt-4 text-center">
          <Link
            href="/forgot-password"
            className="text-indigo-600 hover:underline text-sm font-medium"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}
