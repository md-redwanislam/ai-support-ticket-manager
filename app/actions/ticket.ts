"use server";

import { requireUser } from "@/lib/getAuthUser";
import { prisma } from "@/lib/prisma";
import {
  createTicketSchema,
  ownerUpdateTicketSchema,
} from "@/lib/validations/ticket";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type TicketFormState = {
  error?: string;
  success?: string;
  fieldErrors?: {
    title?: string[];
    description?: string[];
    summary?: string[];
    category?: string[];
    priority?: string[];
  };
};

export async function createTicket(
  _prevState: TicketFormState,
  formData: FormData,
): Promise<TicketFormState> {
  const user = await requireUser();

  // Admins manage tickets from /admin/tickets and do not create them.
  if (user.role === "ADMIN") {
    return { error: "Admins manage tickets from the admin dashboard." };
  }

  const result = createTicketSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    // An empty summary field is treated as "no summary".
    summary: formData.get("summary") || undefined,
    category: formData.get("category"),
    priority: formData.get("priority"),
  });

  if (!result.success) {
    return {
      error: "Please correct the errors below.",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }

  let ticketId: string;

  try {
    const ticket = await prisma.ticket.create({
      data: {
        title: result.data.title,
        description: result.data.description,
        summary: result.data.summary || null,
        category: result.data.category,
        priority: result.data.priority,
        // Owner always comes from the session, never from the client.
        userId: user.id,
      },
      select: { id: true },
    });

    ticketId = ticket.id;
  } catch (error: unknown) {
    console.error("Ticket creation error:", error);

    return { error: "Unable to create your ticket. Please try again." };
  }

  revalidatePath("/tickets");
  revalidatePath("/admin/tickets");

  // redirect() throws internally, so it must stay outside try/catch.
  redirect(`/tickets/${ticketId}`);
}

export async function updateTicket(
  _prevState: TicketFormState,
  formData: FormData,
): Promise<TicketFormState> {
  const user = await requireUser();

  // Admins manage tickets from /admin/tickets.
  if (user.role === "ADMIN") {
    return { error: "Admins manage tickets from the admin dashboard." };
  }

  const ticketId = formData.get("ticketId");
  const parsedId = z.uuid().safeParse(ticketId);

  if (!parsedId.success) {
    return { error: "Invalid ticket." };
  }

  const id = parsedId.data;

  const result = ownerUpdateTicketSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    summary: formData.get("summary") || undefined,
    category: formData.get("category"),
  });

  if (!result.success) {
    return {
      error: "Please correct the errors below.",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }

  try {
    // Ownership and OPEN status are checked in the same query,
    // so nothing can change between the check and the update.
    const updated = await prisma.ticket.updateMany({
      where: { id, userId: user.id, status: "OPEN" },
      data: {
        title: result.data.title,
        description: result.data.description,
        summary: result.data.summary || null,
        category: result.data.category,
      },
    });

    if (updated.count === 0) {
      const existing = await prisma.ticket.findFirst({
        where: { id, userId: user.id },
        select: { id: true },
      });

      return {
        error: existing
          ? "Only open tickets can be edited."
          : "Ticket not found.",
      };
    }
  } catch (error: unknown) {
    console.error("Ticket update error:", error);

    return { error: "Unable to update your ticket. Please try again." };
  }

  revalidatePath("/tickets");
  revalidatePath(`/tickets/${id}`);
  revalidatePath("/admin/tickets");

  // redirect() throws internally, so it must stay outside try/catch.
  redirect(`/tickets/${id}`);
}
