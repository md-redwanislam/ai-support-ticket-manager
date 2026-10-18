"use server";

import { generateToken } from "@/lib/generateToken";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(72),
});

export async function registerUser(formData: FormData) {
  const result = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    redirect("/register?error=invalid");
  }

  const { name, password } = result.data;
  const email = result.data.email.toLowerCase();

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      redirect("/register?error=email");
    }

    throw error;
  }

  redirect("/");
}

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(72),
});

export type AuthFormState = {
  error?: string;
  success?: string;
};

export async function loginUser(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return { error: "Please enter a valid email and password." };
  }

  const email = result.data.email.toLowerCase();
  const password = result.data.password;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "Invalid email or password." };
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return { error: "Invalid email or password." };
  }

  const token = generateToken(user.id, user.role);

  const cookieStore = await cookies();

  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/tickets");
}

export async function logoutUser() {
  const cookieStore = await cookies();

  cookieStore.delete("auth_token");

  redirect("/");
}
