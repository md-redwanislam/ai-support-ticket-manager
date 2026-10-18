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
    <main className="mx-auto min-h-screen max-w-3xl bg-[#24232d] px-4 py-6 text-white sm:px-6 sm:py-8">
      <Link
        href={`/tickets/${ticket.id}`}
        className="text-sm font-medium text-[#c4b5fd] transition-colors duration-200 hover:text-[#8b5cf6] hover:underline"
      >
        ← Back to ticket
      </Link>

      <h1 className="my-6 text-2xl font-bold text-[#f5f3ff] sm:text-3xl">
        Edit ticket
      </h1>

      <div className="rounded-2xl border border-[#484454] bg-[#302e3b] p-4 shadow-xl shadow-black/10 sm:p-6">
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
