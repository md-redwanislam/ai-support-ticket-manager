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
    <main className="mx-auto min-h-screen max-w-5xl p-6">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Tickets</h1>
          <p className="mt-2 text-gray-600">
            {total} {total === 1 ? "ticket" : "tickets"}
            {hasFilters ? " match your filters" : " in total"}.
          </p>
        </div>

        <Link href="/admin/users" className="text-indigo-600 hover:underline">
          Manage users
        </Link>
      </header>

      <form
        method="get"
        action="/admin/tickets"
        className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border p-4"
      >
        <div>
          <label htmlFor="filter-status" className="mb-1 block text-sm">
            Status
          </label>
          <select
            id="filter-status"
            name="status"
            defaultValue={filters.status ?? ""}
            className="rounded-lg border bg-white p-2"
          >
            <option value="">All</option>
            {ticketStatuses.map((value) => (
              <option key={value} value={value}>
                {formatLabel(value)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-priority" className="mb-1 block text-sm">
            Priority
          </label>
          <select
            id="filter-priority"
            name="priority"
            defaultValue={filters.priority ?? ""}
            className="rounded-lg border bg-white p-2"
          >
            <option value="">All</option>
            {ticketPriorities.map((value) => (
              <option key={value} value={value}>
                {formatLabel(value)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-category" className="mb-1 block text-sm">
            Category
          </label>
          <select
            id="filter-category"
            name="category"
            defaultValue={filters.category ?? ""}
            className="rounded-lg border bg-white p-2"
          >
            <option value="">All</option>
            {ticketCategories.map((value) => (
              <option key={value} value={value}>
                {formatLabel(value)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
        >
          Apply filters
        </button>

        {hasFilters && (
          <Link
            href="/admin/tickets"
            className="py-2 text-indigo-600 hover:underline"
          >
            Clear
          </Link>
        )}
      </form>

      {tickets.length === 0 ? (
        <p className="rounded-lg bg-gray-50 p-6 text-gray-600">
          {hasFilters
            ? "No tickets match these filters."
            : "No tickets have been created yet."}
        </p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <article
              key={ticket.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-5"
            >
              <div className="min-w-0">
                <Link
                  href={`/admin/tickets/${ticket.id}`}
                  className="text-xl font-semibold hover:text-indigo-600"
                >
                  {ticket.title}
                </Link>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                  <CategoryBadge category={ticket.category} />
                </div>

                <p className="mt-2 text-sm text-gray-500">
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
                className="text-indigo-600 hover:underline"
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
          className="mt-8 flex items-center justify-between"
        >
          {page > 1 ? (
            <Link
              href={buildHref(filters, page - 1)}
              className="text-indigo-600 hover:underline"
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          {page < totalPages ? (
            <Link
              href={buildHref(filters, page + 1)}
              className="text-indigo-600 hover:underline"
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
