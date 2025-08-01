import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";
import { z } from "zod";

const prisma = new PrismaClient();

export default {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub,
    Resend({
      from: "noreply@frostcore.tech",
    }),
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .parse(credentials);

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user?.password) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    // Use JSON Web Tokens (JWT) to manage sessions instead of database sessions.
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    newUser: "/",
    verifyRequest: "/verify-request",
    error: "/auth/error",
  },
} satisfies NextAuthConfig;
