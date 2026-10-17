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
    <main className="mx-auto min-h-screen max-w-3xl p-6">
      <Link href="/tickets" className="text-indigo-600 hover:underline">
        ← Back to My Tickets
      </Link>

      <header className="my-6">
        <h1 className="text-3xl font-bold">{ticket.title}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
          <CategoryBadge category={ticket.category} />
        </div>

        <p className="mt-3 text-sm text-gray-500">
          Created {ticket.createdAt.toLocaleDateString("en-GB", dateFormat)}
          {" · "}
          Updated {ticket.updatedAt.toLocaleDateString("en-GB", dateFormat)}
        </p>

        {ticket.status === "OPEN" ? (
          <Link
            href={`/tickets/${ticket.id}/edit`}
            className="mt-4 inline-block text-indigo-600 hover:underline"
          >
            Edit ticket
          </Link>
        ) : (
          <p className="mt-4 text-sm text-gray-500">
            Tickets can only be edited while they are open.
          </p>
        )}
      </header>

      <div className="space-y-6 rounded-xl border p-6 shadow-sm">
        {ticket.summary && (
          <section>
            <h2 className="mb-1 text-sm font-medium text-gray-700">Summary</h2>
            <p className="text-gray-800">{ticket.summary}</p>
          </section>
        )}

        <section>
          <h2 className="mb-1 text-sm font-medium text-gray-700">
            Description
          </h2>
          <p className="whitespace-pre-wrap text-gray-800">
            {ticket.description}
          </p>
        </section>
      </div>
    </main>
  );
}
