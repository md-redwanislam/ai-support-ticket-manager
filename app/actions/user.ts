"use server";

import { requireAdmin } from "@/lib/getAuthUser";
import { prisma } from "@/lib/prisma";

import { revalidatePath } from "next/cache";
import { z } from "zod";

export type UserFormState = {
  error?: string;
  success?: string;
  fieldErrors?: {
    name?: string[];
    email?: string[];
    role?: string[];
  };
};

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(254)
      .pipe(z.email("Enter a valid email address.")),
    role: z.enum(["USER", "ADMIN"]),
  })
  .strict();

const EMAIL_TAKEN = "This email is already used by another account.";

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export async function updateUser(
  _prevState: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const admin = await requireAdmin();

  const parsedId = z.uuid().safeParse(formData.get("userId"));

  if (!parsedId.success) {
    return { error: "Invalid user." };
  }

  // Normalised so the self-check below can't be bypassed with an
  // upper-case UUID (Postgres compares UUIDs case-insensitively).
  const id = parsedId.data.toLowerCase();
  const isSelf = id === admin.id;

  const result = updateUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    // Admins can't change their own role, whatever the form sends.
    role: isSelf ? admin.role : formData.get("role"),
  });

  if (!result.success) {
    return {
      error: "Please correct the errors below.",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }

  try {
    const emailTaken = await prisma.user.findFirst({
      where: { email: result.data.email, NOT: { id } },
      select: { id: true },
    });

    if (emailTaken) {
      return {
        error: "Please correct the errors below.",
        fieldErrors: { email: [EMAIL_TAKEN] },
      };
    }

    // passwordHash is never read or written here.
    const updated = await prisma.user.updateMany({
      where: { id },
      data: {
        name: result.data.name,
        email: result.data.email,
        role: result.data.role,
      },
    });

    if (updated.count === 0) {
      return { error: "User not found." };
    }
  } catch (error: unknown) {
    // Covers two admins claiming the same email at the same moment.
    if (isUniqueConstraintError(error)) {
      return {
        error: "Please correct the errors below.",
        fieldErrors: { email: [EMAIL_TAKEN] },
      };
    }

    console.error("User update error:", error);

    return { error: "Unable to update the user. Please try again." };
  }

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}/edit`);
  // Admin ticket pages show each owner's name and email.
  revalidatePath("/admin/tickets");

  return { success: "User updated successfully." };
}
