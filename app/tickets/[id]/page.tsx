import {
  CategoryBadge,
  PriorityBadge,
  StatusBadge,
} from "@/components/ticket-badges";
import { requireUser } from "@/lib/getAuthUser";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

type TicketDetailPageProps = {
  params: Promise<{ id: string }>;
};

const dateFormat: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
};

export default async function TicketDetailPage({
  params,
}: TicketDetailPageProps) {
  const user = await requireUser();

  // Admins use /admin/tickets only.
  if (user.role === "ADMIN") {
    redirect("/admin/tickets");
  }

  const { id } = await params;

  // The id column is a UUID, so a malformed id would make Prisma throw.
  if (!z.uuid().safeParse(id).success) {
    notFound();
  }

  // Someone else's ticket is "not found", so its existence isn't leaked.
  const ticket = await prisma.ticket.findFirst({
    where: { id, userId: user.id },
    select: {
      id: true,
      title: true,
      description: true,
      summary: true,
      category: true,
      priority: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!ticket) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-[#24232d] px-4 py-6 text-white sm:px-6 sm:py-8">
      <Link
        href="/tickets"
        className="text-sm font-medium text-[#c4b5fd] transition-colors duration-200 hover:text-[#8b5cf6] hover:underline"
      >
        ← Back to My Tickets
      </Link>

      <header className="my-6">
        <h1 className="break-words text-2xl font-bold text-[#f5f3ff] sm:text-3xl">
          {ticket.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
          <CategoryBadge category={ticket.category} />
        </div>

        <p className="mt-3 text-xs leading-5 text-[#a9a5b8] sm:text-sm">
          Created {ticket.createdAt.toLocaleDateString("en-GB", dateFormat)}
          {" · "}
          Updated {ticket.updatedAt.toLocaleDateString("en-GB", dateFormat)}
        </p>

        {ticket.status === "OPEN" ? (
          <Link
            href={`/tickets/${ticket.id}/edit`}
            className="mt-4 inline-flex items-center rounded-lg bg-[#c4b5fd] px-4 py-2.5 text-sm font-semibold text-[#211b35] transition-colors duration-200 hover:bg-[#8b5cf6] hover:text-white"
          >
            Edit ticket
          </Link>
        ) : (
          <p className="mt-4 text-sm text-[#a9a5b8]">
            Tickets can only be edited while they are open.
          </p>
        )}
      </header>

      <div className="space-y-6 rounded-2xl border border-[#484454] bg-[#302e3b] p-4 shadow-xl shadow-black/10 sm:p-6">
        {ticket.summary && (
          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#c4b5fd]">
              Summary
            </h2>
            <p className="whitespace-pre-wrap break-words text-sm leading-7 text-[#e4e1ee] sm:text-base">
              {ticket.summary}
            </p>
          </section>
        )}

        {ticket.summary && <div className="border-t border-[#484454]" />}

        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#c4b5fd]">
            Description
          </h2>
          <p className="whitespace-pre-wrap break-words text-sm leading-7 text-[#e4e1ee] sm:text-base">
            {ticket.description}
          </p>
        </section>
      </div>
    </main>
  );
}
