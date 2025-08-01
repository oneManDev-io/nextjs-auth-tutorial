import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
export default async function Home() {
  const session = await auth();
  console.log("Access Token:", session);

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100 p-6">
        {session ? (
          <>
            <p className="text-lg font-bold">
              You are logged in as {session.user?.name}
            </p>
            <Link href="/logout" className="btn btn-primary mt-4">
              Sign out
            </Link>
          </>
        ) : (
          <>
            <p className="text-lg font-bold">You are not logged in</p>
            <Link href="/login" className="btn btn-primary mt-4">
              Sign in
            </Link>
          </>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 w-full max-w-4xl">
        {users.map((user) => (
          <div
            key={user.id}
            className="card card-side bg-base-100 shadow-xl p-4 flex items-center"
          >
            <figure>
              <Image
                src={
                  user.image
                    ? user.image
                    : "https://img.icons8.com/?size=100&id=13042&format=png&color=000000"
                }
                alt="User"
                width={100}
                height={100}
                className="rounded-full"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{user.name}</h2>
              <p>Email: {user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
