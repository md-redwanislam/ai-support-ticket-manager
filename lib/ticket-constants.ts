export const ticketCategories = [
  "TECHNICAL",
  "BILLING",
  "ACCOUNT",
  "GENERAL",
  "OTHER",
] as const;

export const ticketPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export const ticketStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED"] as const;

export type TicketCategoryValue = (typeof ticketCategories)[number];
export type TicketPriorityValue = (typeof ticketPriorities)[number];
export type TicketStatusValue = (typeof ticketStatuses)[number];

// "IN_PROGRESS" -> "In progress"
export function formatLabel(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase().replaceAll("_", " ");
}
