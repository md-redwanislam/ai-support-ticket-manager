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
    <main className="mx-auto min-h-screen max-w-5xl bg-[#24232d] px-4 py-6 text-[#f5f3ff] sm:px-6 sm:py-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            <span className="text-[#c4b5fd]">Manage</span> Users
          </h1>
          <p className="mt-2 text-sm text-[#c4c1d0] sm:text-base">
            {total} {total === 1 ? "user" : "users"} in total.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/admin"
            className="text-sm font-medium text-[#c4b5fd] transition-colors hover:text-[#8b5cf6] hover:underline"
          >
            ← Admin Dashboard
          </Link>

          <Link
            href="/admin/tickets"
            className="text-sm font-medium text-[#c4b5fd] transition-colors hover:text-[#8b5cf6] hover:underline"
          >
            Manage tickets
          </Link>
        </div>
      </header>

      <div className="space-y-4">
        {users.map((user) => (
          <article
            key={user.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#484454] bg-[#302e3b] p-4 shadow-sm shadow-black/10 transition-colors hover:border-[#625b75] sm:p-5"
          >
            <div className="min-w-0 flex-1">
              <h2 className="break-words text-lg font-semibold text-[#f5f3ff] sm:text-xl">
                {user.name}
                {user.id === admin.id && (
                  <span className="ml-2 text-sm font-normal text-[#a9a5b8]">
                    (you)
                  </span>
                )}
              </h2>

              <p className="mt-1 break-words text-sm text-[#c4c1d0]">
                {user.email}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#a9a5b8]">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                    user.role === "ADMIN"
                      ? "border-[#c4b5fd]/20 bg-[#c4b5fd]/10 text-[#d7ccff]"
                      : "border-[#484454] bg-[#24232d] text-[#c4c1d0]"
                  }`}
                >
                  {user.role === "ADMIN" ? "Admin" : "User"}
                </span>

                <span className="rounded-full border border-[#484454] bg-[#24232d] px-2.5 py-1 text-xs">
                  {user._count.tickets}{" "}
                  {user._count.tickets === 1 ? "ticket" : "tickets"}
                </span>

                <span className="text-xs sm:text-sm">
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
              className="inline-flex shrink-0 items-center justify-center rounded-lg border border-[#c4b5fd]/20 bg-[#c4b5fd]/10 px-4 py-2 text-sm font-semibold text-[#c4b5fd] transition-colors hover:border-[#8b5cf6]/40 hover:bg-[#8b5cf6]/15 hover:text-[#d7ccff]"
            >
              Edit
            </Link>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#484454] pt-5"
        >
          {page > 1 ? (
            <Link
              href={
                page === 2 ? "/admin/users" : `/admin/users?page=${page - 1}`
              }
              className="text-sm font-medium text-[#c4b5fd] transition-colors hover:text-[#8b5cf6] hover:underline"
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}

          <span className="text-sm text-[#a9a5b8]">
            Page <span className="font-semibold text-[#f5f3ff]">{page}</span> of{" "}
            <span className="font-semibold text-[#f5f3ff]">{totalPages}</span>
          </span>

          {page < totalPages ? (
            <Link
              href={`/admin/users?page=${page + 1}`}
              className="text-sm font-medium text-[#c4b5fd] transition-colors hover:text-[#8b5cf6] hover:underline"
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
