import {
  CategoryBadge,
  PriorityBadge,
  StatusBadge,
} from "@/components/ticket-badges";
import { requireAdmin } from "@/lib/getAuthUser";
import { prisma } from "@/lib/prisma";
import {
  formatLabel,
  ticketCategories,
  ticketPriorities,
  ticketStatuses,
} from "@/lib/ticket-constants";
import Link from "next/link";
import { redirect } from "next/navigation";
import { z } from "zod";

type SearchParamValue = string | string[] | undefined;

type AdminTicketsPageProps = {
  searchParams: Promise<{
    page?: SearchParamValue;
    status?: SearchParamValue;
    priority?: SearchParamValue;
    category?: SearchParamValue;
  }>;
};

const PAGE_SIZE = 10;

function first(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePage(value: SearchParamValue): number {
  const raw = first(value);

  if (!raw || !/^[1-9]\d*$/.test(raw)) {
    return 1;
  }

  const page = Number(raw);

  return Number.isSafeInteger(page) ? page : 1;
}

type Filters = {
  status?: (typeof ticketStatuses)[number];
  priority?: (typeof ticketPriorities)[number];
  category?: (typeof ticketCategories)[number];
};

function buildHref(filters: Filters, page: number) {
  const params = new URLSearchParams();

  if (filters.status) params.set("status", filters.status);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.category) params.set("category", filters.category);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();

  return query ? `/admin/tickets?${query}` : "/admin/tickets";
}

export default async function AdminTicketsPage({
  searchParams,
}: AdminTicketsPageProps) {
  await requireAdmin();

  const params = await searchParams;
  const page = parsePage(params.page);

  // Invalid filter values are ignored.
  const filters: Filters = {
    status: z.enum(ticketStatuses).safeParse(first(params.status)).data,
    priority: z.enum(ticketPriorities).safeParse(first(params.priority)).data,
    category: z.enum(ticketCategories).safeParse(first(params.category)).data,
  };

  const where = {
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.priority ? { priority: filters.priority } : {}),
    ...(filters.category ? { category: filters.category } : {}),
  };

  const total = await prisma.ticket.count({ where });
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  if (page > totalPages) {
    redirect(buildHref(filters, totalPages));
  }

  const tickets = await prisma.ticket.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      title: true,
      category: true,
      priority: true,
      status: true,
      createdAt: true,
      user: { select: { name: true, email: true } },
    },
  });

  const hasFilters = !!(filters.status || filters.priority || filters.category);

  return (
    <main className="mx-auto min-h-screen max-w-5xl bg-[#24232d] px-4 py-6 text-[#f5f3ff] sm:px-6 sm:py-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            <span className="text-[#c4b5fd]">Manage</span> Tickets
          </h1>
          <p className="mt-2 text-sm text-[#c4c1d0] sm:text-base">
            {total} {total === 1 ? "ticket" : "tickets"}
            {hasFilters ? " match your filters" : " in total"}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/admin"
            className="text-sm font-medium text-[#c4b5fd] transition-colors hover:text-[#8b5cf6] hover:underline"
          >
            ← Admin Dashboard
          </Link>
          <Link
            href="/admin/users"
            className="text-sm font-medium text-[#c4b5fd] transition-colors hover:text-[#8b5cf6] hover:underline"
          >
            Manage users
          </Link>
        </div>
      </header>

      <form
        method="get"
        action="/admin/tickets"
        className="mb-6 flex flex-wrap items-end gap-4 rounded-2xl border border-[#484454] bg-[#302e3b] p-4 shadow-sm shadow-black/10 sm:p-5"
      >
        <div className="min-w-[140px] flex-1">
          <label
            htmlFor="filter-status"
            className="mb-2 block text-sm font-medium text-[#f5f3ff]"
          >
            Status
          </label>
          <select
            id="filter-status"
            name="status"
            defaultValue={filters.status ?? ""}
            className="w-full rounded-lg border border-[#484454] bg-[#24232d] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/20"
          >
            <option value="" className="bg-[#302e3b] text-white">
              All
            </option>
            {ticketStatuses.map((value) => (
              <option
                key={value}
                value={value}
                className="bg-[#302e3b] text-white"
              >
                {formatLabel(value)}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-[140px] flex-1">
          <label
            htmlFor="filter-priority"
            className="mb-2 block text-sm font-medium text-[#f5f3ff]"
          >
            Priority
          </label>
          <select
            id="filter-priority"
            name="priority"
            defaultValue={filters.priority ?? ""}
            className="w-full rounded-lg border border-[#484454] bg-[#24232d] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/20"
          >
            <option value="" className="bg-[#302e3b] text-white">
              All
            </option>
            {ticketPriorities.map((value) => (
              <option
                key={value}
                value={value}
                className="bg-[#302e3b] text-white"
              >
                {formatLabel(value)}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-[140px] flex-1">
          <label
            htmlFor="filter-category"
            className="mb-2 block text-sm font-medium text-[#f5f3ff]"
          >
            Category
          </label>
          <select
            id="filter-category"
            name="category"
            defaultValue={filters.category ?? ""}
            className="w-full rounded-lg border border-[#484454] bg-[#24232d] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/20"
          >
            <option value="" className="bg-[#302e3b] text-white">
              All
            </option>
            {ticketCategories.map((value) => (
              <option
                key={value}
                value={value}
                className="bg-[#302e3b] text-white"
              >
                {formatLabel(value)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-[#c4b5fd] px-5 py-2.5 text-sm font-semibold text-[#24232d] transition-colors duration-200 hover:bg-[#a78bfa]"
        >
          Apply filters
        </button>

        {hasFilters && (
          <Link
            href="/admin/tickets"
            className="inline-flex items-center justify-center rounded-lg border border-[#484454] px-4 py-2.5 text-sm font-medium text-[#c4c1d0] transition-colors hover:border-[#8b5cf6]/50 hover:text-[#f5f3ff]"
          >
            Clear filters
          </Link>
        )}
      </form>

      {tickets.length === 0 ? (
        <p className="rounded-2xl border border-[#484454] bg-[#302e3b] p-6 text-sm leading-6 text-[#c4c1d0]">
          {hasFilters
            ? "No tickets match these filters."
            : "No tickets have been created yet."}
        </p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <article
              key={ticket.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#484454] bg-[#302e3b] p-4 shadow-sm shadow-black/10 transition-colors hover:border-[#625b75] sm:p-5"
            >
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/tickets/${ticket.id}`}
                  className="break-words text-lg font-semibold text-[#f5f3ff] transition-colors hover:text-[#c4b5fd] sm:text-xl"
                >
                  {ticket.title}
                </Link>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                  <CategoryBadge category={ticket.category} />
                </div>

                <p className="mt-3 break-words text-sm leading-5 text-[#a9a5b8]">
                  {ticket.user.name} ({ticket.user.email}){" · "}
                  {ticket.createdAt.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <Link
                href={`/admin/tickets/${ticket.id}`}
                className="inline-flex shrink-0 items-center justify-center rounded-lg border border-[#c4b5fd]/20 bg-[#c4b5fd]/10 px-4 py-2 text-sm font-semibold text-[#c4b5fd] transition-colors hover:border-[#8b5cf6]/40 hover:bg-[#8b5cf6]/15 hover:text-[#d7ccff]"
              >
                Manage
              </Link>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#484454] pt-5"
        >
          {page > 1 ? (
            <Link
              href={buildHref(filters, page - 1)}
              className="text-sm font-medium text-[#c4b5fd] transition-colors hover:text-[#8b5cf6] hover:underline"
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}

          <span className="text-sm text-[#a9a5b8]">
            Page <span className="font-semibold text-[#f5f3ff]">{page}</span> of{" "}
            <span className="font-semibold text-[#f5f3ff]">{totalPages}</span>
          </span>

          {page < totalPages ? (
            <Link
              href={buildHref(filters, page + 1)}
              className="text-sm font-medium text-[#c4b5fd] transition-colors hover:text-[#8b5cf6] hover:underline"
            >
              Next →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </main>
  );
}
