"use server";

import { signIn, signOut } from "@/auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { z } from "zod";

const prisma = new PrismaClient();

// Login action
export async function authenticate(formData: FormData) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.message) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

// OAuth actions
export async function signInWithGoogle() {
  await signIn("google");
}

export async function signInWithGitHub() {
  await signIn("github");
}

export async function signInWithResend() {
  await signIn("resend");
}

// Signup action
export async function signup(formData: FormData) {
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const data = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!data.success) {
    return { error: "Invalid input" };
  }

  const { name, email, password } = data.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: new Date(),
      },
    });

    return { success: "Account created successfully!" };
  } catch (error) {
    return { error: "Failed to create account" };
  }
}

// Forgot password action
export async function forgotPassword(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return { success: "If an account exists, a reset link has been sent" };
    }

    // Here you would send the reset email
    // For now, just return success
    return { success: "Password reset link sent! Check your email." };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

// Sign out action
export async function signOutAction() {
  await signOut();
}
