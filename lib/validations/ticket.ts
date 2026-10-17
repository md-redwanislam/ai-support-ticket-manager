import {
  ticketCategories,
  ticketPriorities,
  ticketStatuses,
} from "@/lib/ticket-constants";
import { z } from "zod";

export const createTicketSchema = z
  .object({
    title: z.string().trim().min(3).max(160),
    description: z.string().trim().min(10).max(5000),
    summary: z.string().trim().max(1000).optional(),
    category: z.enum(ticketCategories),
    priority: z.enum(ticketPriorities),
  })
  .strict();

export const updateTicketSchema = z
  .object({
    title: z.string().trim().min(3).max(160).optional(),
    description: z.string().trim().min(10).max(5000).optional(),
    summary: z.string().trim().max(1000).optional(),
    category: z.enum(ticketCategories).optional(),
    priority: z.enum(ticketPriorities).optional(),
    status: z.enum(ticketStatuses).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update.",
  });

// Fields an owner may change on their own ticket.
// Priority and status are intentionally excluded: only admins change them.
export const ownerUpdateTicketSchema = z
  .object({
    title: z.string().trim().min(3).max(160),
    description: z.string().trim().min(10).max(5000),
    summary: z.string().trim().max(1000).optional(),
    category: z.enum(ticketCategories),
  })
  .strict();

// The admin form always submits every field.
export const adminUpdateTicketSchema = z
  .object({
    title: z.string().trim().min(3).max(160),
    description: z.string().trim().min(10).max(5000),
    summary: z.string().trim().max(1000).optional(),
    category: z.enum(ticketCategories),
    priority: z.enum(ticketPriorities),
    status: z.enum(ticketStatuses),
  })
  .strict();
