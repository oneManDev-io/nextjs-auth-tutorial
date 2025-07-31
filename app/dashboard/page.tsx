import { auth, signOut } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { Activity, BarChart3, Bell, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get user details from database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      emailVerified: true,
      createdAt: true,
      accounts: {
        select: {
          provider: true,
          type: true,
        },
      },
    },
  });

  // Get some stats (you can customize this)
  const userCount = await prisma.user.count();

  const authMethod =
    user?.accounts.length > 0
      ? user.accounts[0].provider
      : session.user.image
      ? "oauth"
      : "credentials";

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="btn btn-outline">Sign Out</button>
          </form>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Welcome, {session.user.name}!</h2>
            <p>Email: {session.user.email}</p>
            <div className="mt-4">
              <pre className="bg-base-200 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">
                  <User className="w-5 h-5" />
                  Profile Information
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {session.user.image ? (
                      <Image
                        src={session.user.image || "/placeholder.svg"}
                        alt="Profile"
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                        <User className="w-10 h-10 text-primary-content" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold">
                        {session.user.name}
                      </h3>
                      <p className="text-base-content/60">
                        {session.user.email}
                      </p>
                      <div className="badge badge-primary mt-2">
                        {authMethod === "google" && "Google Account"}
                        {authMethod === "github" && "GitHub Account"}
                        {authMethod === "credentials" && "Email Account"}
                        {authMethod === "oauth" && "OAuth Account"}
                      </div>
                    </div>
                  </div>

                  <div className="divider"></div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-base-content/60">User ID</p>
                      <p className="font-mono text-sm">{session.user.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/60">
                        Authentication Method
                      </p>
                      <p className="capitalize">{authMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/60">
                        Email Verified
                      </p>
                      <p
                        className={
                          user?.emailVerified ? "text-success" : "text-warning"
                        }
                      >
                        {user?.emailVerified ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/60">
                        Account Created
                      </p>
                      <p>
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "Today"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card-actions justify-end mt-6">
                  <Link href="/profile" className="btn btn-primary">
                    <Settings className="w-4 h-4" />
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">
                  <Activity className="w-5 h-5" />
                  Quick Actions
                </h2>

                <div className="space-y-3">
                  <Link
                    href="/profile"
                    className="btn btn-outline w-full justify-start"
                  >
                    <User className="w-4 h-4" />
                    Update Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="btn btn-outline w-full justify-start"
                  >
                    <Settings className="w-4 h-4" />
                    Account Settings
                  </Link>
                  <button className="btn btn-outline w-full justify-start">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </button>
                  <button className="btn btn-outline w-full justify-start">
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </button>
                </div>
              </div>
            </div>

            {/* Session Info */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Session Data</h2>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
