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

  if (user.role === "ADMIN") {
    redirect("/admin");
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
    <main className="mx-auto min-h-screen max-w-5xl bg-[#24232d] px-4 py-6 text-white sm:px-6">
      <header className="mb-8">
        <div className="relative flex min-h-12 items-center justify-between gap-3">
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              <span className="text-[#c4b5fd] transition-colors duration-200 hover:text-[#8b5cf6]">
                Support
              </span>
              <span className="text-[#f5f3ff]">Desk</span>
            </h1>
          </div>

          <form action={logoutUser} className="shrink-0">
            <button
              type="submit"
              className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 transition-colors duration-200 hover:bg-red-500/20 sm:px-4"
            >
              Logout
            </button>
          </form>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">My Tickets</h2>
            <p className="mt-2 text-sm text-[#c4c1d0] sm:text-base">
              Track the support requests you have submitted.
            </p>
          </div>

          <Link
            href="/tickets/new"
            className="inline-flex items-center justify-center rounded-lg bg-[#c4b5fd] px-4 py-2.5 font-semibold text-[#211b35] transition-colors duration-200 hover:bg-[#8b5cf6] hover:text-white"
          >
            + Create ticket
          </Link>
        </div>
      </header>

      {tickets.length === 0 ? (
        <p className="rounded-xl border border-[#484454] bg-[#302e3b] p-6 text-[#c4c1d0]">
          You haven&apos;t created any tickets yet.
        </p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <article
              key={ticket.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#484454] bg-[#302e3b] p-4 transition-colors duration-200 hover:border-[#71658f] sm:p-5"
            >
              <div className="min-w-0 flex-1">
                <Link
                  href={`/tickets/${ticket.id}`}
                  className="break-words text-lg font-semibold text-[#f5f3ff] transition-colors duration-200 hover:text-[#c4b5fd] sm:text-xl"
                >
                  {ticket.title}
                </Link>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                  <CategoryBadge category={ticket.category} />
                </div>

                <p className="mt-3 text-sm text-[#a9a5b8]">
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
                className="shrink-0 font-medium text-[#c4b5fd] transition-colors duration-200 hover:text-[#8b5cf6] hover:underline"
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
          className="mt-8 flex items-center justify-between gap-3 border-t border-[#484454] pt-5"
        >
          {page > 1 ? (
            <Link
              href={page === 2 ? "/tickets" : `/tickets?page=${page - 1}`}
              className="text-sm font-medium text-[#c4b5fd] transition-colors hover:text-[#8b5cf6] hover:underline sm:text-base"
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}

          <span className="text-sm text-[#c4c1d0]">
            Page {page} of {totalPages}
          </span>

          {page < totalPages ? (
            <Link
              href={`/tickets?page=${page + 1}`}
              className="text-sm font-medium text-[#c4b5fd] transition-colors hover:text-[#8b5cf6] hover:underline sm:text-base"
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
