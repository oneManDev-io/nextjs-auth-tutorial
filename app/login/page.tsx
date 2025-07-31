"use client";

import type React from "react";

import { Github } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa6";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold mb-6">Welcome Back</h2>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="divider">OR</div>

          <div className="space-y-3">
            <button
              onClick={() => signIn("google")}
              className="btn btn-outline w-full"
            >
              <FaGoogle /> Google
            </button>
            <button
              onClick={() => signIn("github")}
              className="btn btn-outline w-full"
            >
              <Github className="w-4 h-4" /> GitHub
            </button>
            <button
              onClick={() => signIn("resend")}
              className="btn btn-outline w-full"
            >
              📧 Email Link
            </button>
          </div>

          <p className="text-center mt-4">
            Don't have an account?{" "}
            <Link href="/signup" className="link link-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
