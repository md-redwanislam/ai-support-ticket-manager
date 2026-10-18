import AdminTicketForm from "@/components/admin-ticket-form";
import DeleteTicketButton from "@/components/delete-ticket-button";
import {
  CategoryBadge,
  PriorityBadge,
  StatusBadge,
} from "@/components/ticket-badges";
import { requireAdmin } from "@/lib/getAuthUser";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

type AdminTicketPageProps = {
  params: Promise<{ id: string }>;
};

const dateFormat: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
};

export default async function AdminTicketPage({
  params,
}: AdminTicketPageProps) {
  await requireAdmin();

  const { id } = await params;

  // The id column is a UUID, so a malformed id would make Prisma throw.
  if (!z.uuid().safeParse(id).success) {
    notFound();
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id },
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
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!ticket) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-[#24232d] px-4 py-6 text-[#f5f3ff] sm:px-6 sm:py-8">
      <Link
        href="/admin/tickets"
        className="inline-flex items-center text-sm font-medium text-[#c4b5fd] transition-colors duration-200 hover:text-[#8b5cf6] hover:underline"
      >
        ← Back to tickets
      </Link>

      <header className="my-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          <span className="text-[#c4b5fd]">Manage</span> ticket
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
          <CategoryBadge category={ticket.category} />
        </div>

        <p className="mt-3 break-words text-sm leading-6 text-[#a9a5b8]">
          Submitted by {ticket.user.name} ({ticket.user.email}){" · "}
          Created {ticket.createdAt.toLocaleDateString("en-GB", dateFormat)}
          {" · "}
          Updated {ticket.updatedAt.toLocaleDateString("en-GB", dateFormat)}
        </p>
      </header>

      <div className="rounded-2xl border border-[#484454] bg-[#302e3b] p-4 shadow-xl shadow-black/10 sm:p-6">
        <AdminTicketForm
          ticketId={ticket.id}
          title={ticket.title}
          description={ticket.description}
          summary={ticket.summary ?? ""}
          category={ticket.category}
          priority={ticket.priority}
          status={ticket.status}
        />
      </div>

      <section className="mt-8 rounded-2xl border border-red-400/20 bg-[#302e3b] p-4 shadow-sm shadow-black/10 sm:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-red-300">Delete ticket</h2>
          <p className="mt-2 text-sm leading-6 text-[#c4c1d0]">
            This permanently removes the ticket and cannot be undone.
          </p>
        </div>

        <DeleteTicketButton ticketId={ticket.id} />
      </section>
    </main>
  );
}
