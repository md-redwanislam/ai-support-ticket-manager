import EditTicketForm from "@/components/edit-ticket-form";
import { requireUser } from "@/lib/getAuthUser";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

type EditTicketPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTicketPage({ params }: EditTicketPageProps) {
  const user = await requireUser();

  // Admins use /admin/tickets only.
  if (user.role === "ADMIN") {
    redirect("/admin/tickets");
  }

  const { id } = await params;

  if (!z.uuid().safeParse(id).success) {
    notFound();
  }

  const ticket = await prisma.ticket.findFirst({
    where: { id, userId: user.id },
    select: {
      id: true,
      title: true,
      description: true,
      summary: true,
      category: true,
      status: true,
    },
  });

  if (!ticket) {
    notFound();
  }

  // Owners can edit only while the ticket is open.
  if (ticket.status !== "OPEN") {
    redirect(`/tickets/${ticket.id}`);
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl p-6">
      <Link
        href={`/tickets/${ticket.id}`}
        className="text-indigo-600 hover:underline"
      >
        ← Back to ticket
      </Link>

      <h1 className="my-6 text-3xl font-bold">Edit ticket</h1>

      <div className="rounded-xl border p-6 shadow-sm">
        <EditTicketForm
          ticketId={ticket.id}
          title={ticket.title}
          description={ticket.description}
          summary={ticket.summary ?? ""}
          category={ticket.category}
        />
      </div>
    </main>
  );
}
