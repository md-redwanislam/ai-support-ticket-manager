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
    <main className="mx-auto min-h-screen max-w-3xl p-6">
      <Link href="/admin/tickets" className="text-indigo-600 hover:underline">
        ← Back to tickets
      </Link>

      <header className="my-6">
        <h1 className="text-3xl font-bold">Manage ticket</h1>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
          <CategoryBadge category={ticket.category} />
        </div>

        <p className="mt-3 text-sm text-gray-500">
          Submitted by {ticket.user.name} ({ticket.user.email}){" · "}
          Created {ticket.createdAt.toLocaleDateString("en-GB", dateFormat)}
          {" · "}
          Updated {ticket.updatedAt.toLocaleDateString("en-GB", dateFormat)}
        </p>
      </header>

      <div className="rounded-xl border p-6 shadow-sm">
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

      <section className="mt-8 rounded-xl border border-red-200 p-6">
        <h2 className="text-lg font-semibold text-red-700">Delete ticket</h2>
        <p className="mb-4 mt-1 text-sm text-gray-600">
          This permanently removes the ticket and cannot be undone.
        </p>
        <DeleteTicketButton ticketId={ticket.id} />
      </section>
    </main>
  );
}
