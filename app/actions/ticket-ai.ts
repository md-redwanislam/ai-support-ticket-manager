"use server";

import { requireUser } from "@/lib/getAuthUser";
import { generateTicketSuggestion } from "@/lib/ticket-ai";
import type {
  TicketCategoryValue,
  TicketPriorityValue,
} from "@/lib/ticket-constants";
import { z } from "zod";

export type TicketAiState = {
  error?: string;
  result?: {
    title: string;
    summary: string;
    category: TicketCategoryValue;
    priority: TicketPriorityValue;
  };
};

const descriptionSchema = z
  .string()
  .trim()
  .min(10, "Description must be at least 10 characters.")
  .max(5000, "Description cannot exceed 5,000 characters.");

// The AI only suggests values. It never creates a ticket, assigns an
// owner, sets a status, or decides permissions.
export async function generateTicketSuggestionAction(
  description: string,
): Promise<TicketAiState> {
  // Only authenticated users can request AI suggestions.
  await requireUser();

  const parsed = descriptionSchema.safeParse(description);

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ??
        "Please provide a valid problem description.",
    };
  }

  try {
    const result = await generateTicketSuggestion(parsed.data);
    return { result };
  } catch (error: unknown) {
    console.error("AI ticket suggestion error:", error);

    return {
      error:
        "Could not generate suggestions. You can enter the ticket details manually.",
    };
  }
}
