import {
  formatLabel,
  type TicketPriorityValue,
  type TicketStatusValue,
} from "@/lib/ticket-constants";

const statusStyles: Record<TicketStatusValue, string> = {
  OPEN: "bg-blue-50 text-blue-700",
  IN_PROGRESS: "bg-amber-50 text-amber-700",
  RESOLVED: "bg-green-50 text-green-700",
};

const priorityStyles: Record<TicketPriorityValue, string> = {
  LOW: "bg-gray-100 text-gray-700",
  MEDIUM: "bg-indigo-50 text-indigo-700",
  HIGH: "bg-orange-50 text-orange-700",
  URGENT: "bg-red-50 text-red-700",
};

const badgeBase = "rounded-full px-2.5 py-0.5 text-xs font-medium";

export function StatusBadge({ status }: { status: TicketStatusValue }) {
  return (
    <span className={`${badgeBase} ${statusStyles[status]}`}>
      {formatLabel(status)}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TicketPriorityValue }) {
  return (
    <span className={`${badgeBase} ${priorityStyles[priority]}`}>
      {formatLabel(priority)} priority
    </span>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className={`${badgeBase} bg-gray-100 text-gray-700`}>
      {formatLabel(category)}
    </span>
  );
}
