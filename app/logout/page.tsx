"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ redirect: false });
    router.push("/");
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold">Sign Out</h2>
          <p className="text-center text-gray-500 mt-2">
            Are you sure you want to sign out?
          </p>
          <div className="mt-6 flex gap-4">
            <button
              className="btn flex-1 bg-red-500 text-white hover:bg-red-600"
              onClick={handleSignOut}
              disabled={isLoading}
            >
              {isLoading ? "Signing out..." : "Sign out"}
            </button>
            <button
              className="btn flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
