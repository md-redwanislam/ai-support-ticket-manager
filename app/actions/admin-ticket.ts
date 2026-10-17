"use server";

import { requireAdmin } from "@/lib/getAuthUser";
import { prisma } from "@/lib/prisma";
import { adminUpdateTicketSchema } from "@/lib/validations/ticket";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type AdminTicketFormState = {
  error?: string;
  success?: string;
  fieldErrors?: {
    title?: string[];
    description?: string[];
    summary?: string[];
    category?: string[];
    priority?: string[];
    status?: string[];
  };
};

function revalidateTicketPaths(id: string) {
  revalidatePath("/admin/tickets");
  revalidatePath(`/admin/tickets/${id}`);
  revalidatePath("/tickets");
  revalidatePath(`/tickets/${id}`);
}

export async function adminUpdateTicket(
  _prevState: AdminTicketFormState,
  formData: FormData,
): Promise<AdminTicketFormState> {
  // Redirects non-admins before anything else runs.
  await requireAdmin();

  const parsedId = z.uuid().safeParse(formData.get("ticketId"));

  if (!parsedId.success) {
    return { error: "Invalid ticket." };
  }

  const id = parsedId.data;

  const result = adminUpdateTicketSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    summary: formData.get("summary") || undefined,
    category: formData.get("category"),
    priority: formData.get("priority"),
    status: formData.get("status"),
  });

  if (!result.success) {
    return {
      error: "Please correct the errors below.",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }

  try {
    const updated = await prisma.ticket.updateMany({
      where: { id },
      data: {
        title: result.data.title,
        description: result.data.description,
        summary: result.data.summary || null,
        category: result.data.category,
        priority: result.data.priority,
        status: result.data.status,
      },
    });

    if (updated.count === 0) {
      return { error: "Ticket not found." };
    }
  } catch (error: unknown) {
    console.error("Admin ticket update error:", error);

    return { error: "Unable to update the ticket. Please try again." };
  }

  revalidateTicketPaths(id);

  return { success: "Ticket updated successfully." };
}

export async function deleteTicket(formData: FormData) {
  // Only admins can delete tickets.
  await requireAdmin();

  const parsedId = z.uuid().safeParse(formData.get("ticketId"));

  if (!parsedId.success) {
    return;
  }

  await prisma.ticket.deleteMany({ where: { id: parsedId.data } });

  revalidateTicketPaths(parsedId.data);

  redirect("/admin/tickets");
}
