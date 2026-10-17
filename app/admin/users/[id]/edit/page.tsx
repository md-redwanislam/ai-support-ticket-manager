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
    <main className="mx-auto min-h-screen max-w-3xl p-6">
      <Link href="/admin/users" className="text-indigo-600 hover:underline">
        ← Back to users
      </Link>

      <h1 className="my-6 text-3xl font-bold">Edit user</h1>

      <div className="rounded-xl border p-6 shadow-sm">
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
