"use client";

import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const errorMessages = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  InvalidToken: "The verification link is invalid.",
  ExpiredToken: "The verification link has expired.",
  VerificationFailed: "Email verification failed. Please try again.",
  Default: "An error occurred during authentication.",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") as keyof typeof errorMessages;

  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>

          <div className="alert alert-error mb-6">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>

          <div className="space-y-3">
            <Link href="/login" className="btn btn-primary w-full">
              Try Again
            </Link>
            <Link href="/" className="btn btn-ghost w-full">
              <ArrowLeft className="w-4 h-4" />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
