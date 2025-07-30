import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";

const prisma = new PrismaClient();

export default {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub,
    Resend({
      from: "noreply@frostcore.tech",
    }),
  ],
  session: {
    // Use JSON Web Tokens (JWT) to manage sessions instead of database sessions.
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    newUser: "/",
  },
} satisfies NextAuthConfig;
