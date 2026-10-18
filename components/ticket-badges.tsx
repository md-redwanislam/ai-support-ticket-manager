import {
  formatLabel,
  type TicketPriorityValue,
  type TicketStatusValue,
} from "@/lib/ticket-constants";

const statusStyles: Record<TicketStatusValue, string> = {
  OPEN: "border border-sky-400/20 bg-sky-400/10 text-sky-300",
  IN_PROGRESS: "border border-amber-400/20 bg-amber-400/10 text-amber-300",
  RESOLVED: "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
};

const priorityStyles: Record<TicketPriorityValue, string> = {
  LOW: "border border-slate-400/20 bg-slate-400/10 text-slate-300",
  MEDIUM: "border border-violet-400/20 bg-violet-400/10 text-violet-300",
  HIGH: "border border-orange-400/20 bg-orange-400/10 text-orange-300",
  URGENT: "border border-red-400/20 bg-red-400/10 text-red-300",
};

const badgeBase =
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium";

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
    <span
      className={`${badgeBase} border border-[#c4b5fd]/15 bg-[#c4b5fd]/10 text-[#d7ccff]`}
    >
      {formatLabel(category)}
    </span>
  );
}
