"use client";

import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

type AuthTab = "login" | "signup" | "forgot";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>("login");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-50 to-yellow-200 p-4">
      <div className="w-full max-w-lg bg-white/90 rounded-3xl shadow-2xl p-10 border border-yellow-100 relative animate-fadeIn">
        <div className="relative">
          {activeTab === "login" && (
            <>
              <LoginForm onForgotPassword={() => setActiveTab("forgot")} />
              <p className="text-sm text-yellow-700 mt-8 text-center">
                Don't have an account?{" "}
                <button
                  className="text-yellow-700 hover:underline font-bold cursor-pointer"
                  onClick={() => setActiveTab("signup")}
                  tabIndex={0}
                  style={{ cursor: "pointer" }}
                >
                  Sign up
                </button>
              </p>
            </>
          )}
          {activeTab === "signup" && (
            <>
              <SignupForm onGoToLogin={() => setActiveTab("login")} />
            </>
          )}
          {activeTab === "forgot" && (
            <>
              <ForgotPasswordForm onGoToLogin={() => setActiveTab("login")} />
            </>
          )}
        </div>
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: none;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .loader {
          border: 3px solid #f9e79f;
          border-top: 3px solid #f1c40f;
          border-radius: 50%;
          width: 1em;
          height: 1em;
          animation: spin 0.75s linear infinite;
          display: inline-block;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
