"use client";

import { authenticate } from "@/lib/actions";
import { Eye, EyeOff, Github, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useActionState, useState } from "react";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={onSubmit} action={formAction} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            className="input input-bordered w-full"
            required
            disabled={isLoading || isPending}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="input input-bordered w-full pr-12"
              required
              disabled={isLoading || isPending}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-sm"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading || isPending}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isLoading || isPending}
        >
          {isLoading || isPending ? "Signing In..." : "Sign In"}
        </button>

        {errorMessage && (
          <div className="alert alert-error">
            <span>{errorMessage}</span>
          </div>
        )}
      </form>

      <div className="divider">Or continue with</div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => signIn("github", { callbackUrl })}
          disabled={isLoading || isPending}
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => signIn("resend", { callbackUrl })}
          disabled={isLoading || isPending}
        >
          <Mail className="mr-2 h-4 w-4" />
          Email
        </button>
      </div>

      <div className="text-center text-sm">
        {"Don't have an account? "}
        <Link href="/signup" className="link link-primary">
          Sign up
        </Link>
      </div>
    </div>
  );
}
