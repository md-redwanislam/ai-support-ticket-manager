import EditUserForm from "@/components/edit-user-form";
import { requireAdmin } from "@/lib/getAuthUser";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

type EditUserPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditUserPage({ params }: EditUserPageProps) {
  const admin = await requireAdmin();
  const { id } = await params;

  // The id column is a UUID, so a malformed id would make Prisma throw.
  if (!z.uuid().safeParse(id).success) {
    notFound();
  }

  // passwordHash is not selected, so it never leaves the database layer.
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-[#24232d] px-4 py-6 text-[#f5f3ff] sm:px-6 sm:py-8">
      <Link
        href="/admin/users"
        className="inline-flex items-center text-sm font-medium text-[#c4b5fd] transition-colors duration-200 hover:text-[#8b5cf6] hover:underline"
      >
        ← Back to users
      </Link>

      <header className="mb-6 mt-5">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          <span className="text-[#c4b5fd]">Edit</span> user
        </h1>
        <p className="mt-2 text-sm text-[#c4c1d0]">
          Update user details and account permissions.
        </p>
      </header>

      <div className="rounded-2xl border border-[#484454] bg-[#302e3b] p-4 shadow-xl shadow-black/10 sm:p-6">
        <EditUserForm
          userId={user.id}
          name={user.name}
          email={user.email}
          role={user.role}
          isSelf={user.id === admin.id}
        />
      </div>
    </main>
  );
}
