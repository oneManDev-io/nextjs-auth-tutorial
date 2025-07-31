import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("📝 Signup request:", body);

    const validatedFields = signupSchema.safeParse(body);

    if (!validatedFields.success) {
      console.log("❌ Validation failed:", validatedFields.error.issues);
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.issues },
        { status: 400 }
      );
    }

    const { name, email, password } = validatedFields.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("❌ User already exists:", email);
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    console.log("👤 Creating user...");
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: new Date(), // Auto-verify for simplicity
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    console.log("✅ User created successfully:", user.email);

    return NextResponse.json(
      {
        message: "User created successfully!",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("💥 Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
