import {
  CategoryBadge,
  PriorityBadge,
  StatusBadge,
} from "@/components/ticket-badges";
import { requireUser } from "@/lib/getAuthUser";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutUser } from "../actions/auth";

type TicketsPageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

const PAGE_SIZE = 10;

function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;

  if (!raw || !/^[1-9]\d*$/.test(raw)) {
    return 1;
  }

  const page = Number(raw);

  return Number.isSafeInteger(page) ? page : 1;
}

export default async function TicketsPage({ searchParams }: TicketsPageProps) {
  const user = await requireUser();

  // Admins use /admin/tickets only.
  if (user.role === "ADMIN") {
    redirect("/admin/tickets");
  }

  const page = parsePage((await searchParams).page);
  const where = { userId: user.id };

  const total = await prisma.ticket.count({ where });
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  // Send out-of-range page numbers to the last valid page.
  if (page > totalPages) {
    redirect(totalPages === 1 ? "/tickets" : `/tickets?page=${totalPages}`);
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
    },
  });

  return (
    <main className="mx-auto min-h-screen max-w-5xl p-6">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Tickets</h1>
          <p className="mt-2 text-gray-600">
            Track the support requests you have submitted.
          </p>
        </div>

        <Link
          href="/tickets/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
        >
          + Create ticket
        </Link>

        <form action={logoutUser} className="mt-4">
          <button
            type="submit"
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </form>
      </header>

      {tickets.length === 0 ? (
        <p className="rounded-lg bg-gray-50 p-6 text-gray-600">
          You haven&apos;t created any tickets yet.
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
                  href={`/tickets/${ticket.id}`}
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
                  Created{" "}
                  {ticket.createdAt.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <Link
                href={`/tickets/${ticket.id}`}
                className="text-indigo-600 hover:underline"
              >
                View
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
              href={page === 2 ? "/tickets" : `/tickets?page=${page - 1}`}
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
              href={`/tickets?page=${page + 1}`}
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
