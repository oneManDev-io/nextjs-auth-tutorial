import { auth } from "@/auth";
import Link from "next/link";
export default async function Home() {
  const session = await auth();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {session ? (
        <>
          <p>You are logged in as {session.user?.name}</p>
          <Link href="/api/auth/signout">Sign out</Link>
        </>
      ) : (
        <>
          <p>You are not logged in</p>
          <Link href="/api/auth/signin">Sign in</Link>
        </>
      )}
    </div>
  );
}
