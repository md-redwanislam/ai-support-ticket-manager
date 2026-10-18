import CreateTicketForm from "@/components/create-ticket-form";
import { requireUser } from "@/lib/getAuthUser";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewTicketPage() {
  const user = await requireUser();

  // Admins use /admin/tickets only.
  if (user.role === "ADMIN") {
    redirect("/admin/tickets");
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-[#24232d] px-4 py-6 text-white sm:px-6 sm:py-8">
      <div className="mb-6">
        <Link
          href="/tickets"
          className="text-sm font-medium text-[#aa9de1] transition-colors duration-200 hover:text-[#8b5cf6] hover:underline"
        >
          ← Back to tickets
        </Link>

        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Create a ticket</h1>

        <p className="mt-2 text-sm leading-6 text-[#ebeaef] sm:text-base">
          Describe your problem, {user.name}. AI can suggest the details and you
          can edit them before submitting.
        </p>
      </div>

      <div className="rounded-2xl border border-[#484454] bg-[#302e3b] p-4 shadow-xl shadow-black/10 sm:p-6">
        <CreateTicketForm />
      </div>
    </main>
  );
}
