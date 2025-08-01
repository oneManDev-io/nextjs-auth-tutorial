import { SignUpForm } from "@/components/signup-form";
import { signInWithGitHub, signInWithGoogle } from "@/lib/actions";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold mb-6">
            Create Account
          </h2>

          <SignUpForm />

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
          </div>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link href="/login" className="link link-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
