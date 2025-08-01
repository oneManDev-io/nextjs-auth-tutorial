"use client";

import { signup } from "@/lib/actions";
import { Eye, EyeOff, Github, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signup, null);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setTimeout(() => router.push("/login"), 2000);
    }
  }, [state?.success, router]);

  return (
    <div className="space-y-6">
      {state?.error && (
        <div className="alert alert-error">
          <span>{state.error}</span>
        </div>
      )}

      {state?.success && (
        <div className="alert alert-success">
          <span>{state.success}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Full Name</span>
          </label>
          <input
            name="name"
            type="text"
            placeholder="John Doe"
            className="input input-bordered w-full"
            required
            disabled={isPending}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            name="email"
            type="email"
            placeholder="john@example.com"
            className="input input-bordered w-full"
            required
            disabled={isPending}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="input input-bordered w-full pr-12"
              required
              disabled={isPending}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-sm"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isPending}
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
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create Account"}
        </button>
      </form>

      <div className="divider">Or continue with</div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => signIn("github", { callbackUrl: "/" })}
          disabled={isPending}
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => signIn("resend", { callbackUrl: "/" })}
          disabled={isPending}
        >
          <Mail className="mr-2 h-4 w-4" />
          Email
        </button>
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="link link-primary">
          Sign in
        </Link>
      </div>
    </div>
  );
}
