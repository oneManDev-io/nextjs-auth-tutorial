import { LoginForm } from "@/components/login-form";
import {
  signInWithGitHub,
  signInWithGoogle,
  signInWithResend,
} from "@/lib/actions";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold mb-6">Welcome Back</h2>

          <LoginForm />

          <div className="divider">OR</div>

          <div className="space-y-3">
            <form action={signInWithGoogle}>
              <button type="submit" className="btn btn-outline w-full">
                🔍 Google
              </button>
            </form>

            <form action={signInWithGitHub}>
              <button type="submit" className="btn btn-outline w-full">
                🐙 GitHub
              </button>
            </form>

            <form action={signInWithResend}>
              <button type="submit" className="btn btn-outline w-full">
                📧 Email Link
              </button>
            </form>
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
