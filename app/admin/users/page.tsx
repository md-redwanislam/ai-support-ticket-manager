import { requireAdmin } from "@/lib/getAuthUser";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

type AdminUsersPageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

const PAGE_SIZE = 20;

function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;

  if (!raw || !/^[1-9]\d*$/.test(raw)) {
    return 1;
  }

  const page = Number(raw);

  return Number.isSafeInteger(page) ? page : 1;
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const admin = await requireAdmin();

  const page = parsePage((await searchParams).page);

  const total = await prisma.user.count();
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  if (page > totalPages) {
    redirect(
      totalPages === 1 ? "/admin/users" : `/admin/users?page=${totalPages}`,
    );
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { tickets: true } },
    },
  });

  return (
    <main className="mx-auto min-h-screen max-w-5xl p-6">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <p className="mt-2 text-gray-600">
            {total} {total === 1 ? "user" : "users"} in total.
          </p>
        </div>

        <Link href="/admin/tickets" className="text-indigo-600 hover:underline">
          Manage tickets
        </Link>
      </header>

      <div className="space-y-4">
        {users.map((user) => (
          <article
            key={user.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-5"
          >
            <div className="min-w-0">
              <h2 className="text-xl font-semibold">
                {user.name}
                {user.id === admin.id && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    (you)
                  </span>
                )}
              </h2>

              <p className="mt-1 text-sm text-gray-600">{user.email}</p>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user.role === "ADMIN"
                      ? "bg-purple-50 text-purple-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.role === "ADMIN" ? "Admin" : "User"}
                </span>
                <span>
                  {user._count.tickets}{" "}
                  {user._count.tickets === 1 ? "ticket" : "tickets"}
                </span>
                <span>
                  Joined{" "}
                  {user.createdAt.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <Link
              href={`/admin/users/${user.id}/edit`}
              className="text-indigo-600 hover:underline"
            >
              Edit
            </Link>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-8 flex items-center justify-between"
        >
          {page > 1 ? (
            <Link
              href={
                page === 2 ? "/admin/users" : `/admin/users?page=${page - 1}`
              }
              className="text-indigo-600 hover:underline"
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          {page < totalPages ? (
            <Link
              href={`/admin/users?page=${page + 1}`}
              className="text-indigo-600 hover:underline"
            >
              Next →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </main>
  );
}
