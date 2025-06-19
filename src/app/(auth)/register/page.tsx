// src/app/(auth)/register/page.tsx

import Link from "next/link";
import RegisterForm from "@/components/forms/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an Account",
  description: "Sign up for a new account at ShoeStore.",
};

export default function RegisterPage() {
  return (
    <div>
      <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Create a new account
      </h2>

      <div className="mt-10">
        <RegisterForm />
      </div>

      <p className="mt-10 text-center text-sm text-gray-500">
        Already a member?{" "}
        <Link
          href="/login"
          className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          Sign in here
        </Link>
      </p>
    </div>
  );
}
