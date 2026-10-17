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
    <main className="mx-auto min-h-screen max-w-3xl p-6">
      <div className="mb-6">
        <Link href="/tickets" className="text-indigo-600 hover:underline">
          ← Back to tickets
        </Link>

        <h1 className="mt-4 text-3xl font-bold">Create a ticket</h1>

        <p className="mt-2 text-gray-600">
          Describe your problem, {user.name}. AI can suggest the details, and
          you can edit them before submitting.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <CreateTicketForm />
      </div>
    </main>
  );
}
