import { requireAdmin } from "@/lib/getAuthUser";
import Link from "next/link";
import { logoutUser } from "../actions/auth";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();

  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-[#24232d] px-4 py-6 text-[#f5f3ff] sm:px-6 sm:py-8">
      <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            <span className="text-[#c4b5fd]">Admin Dashboard</span>
            <span className="text-[#f5f3ff]"> of SupportDesk</span>
          </h1>
          <p className="mt-2 text-sm text-[#c4c1d0] sm:text-base">
            Welcome back, {admin.name}.
          </p>
        </div>

        <form action={logoutUser}>
          <button
            type="submit"
            className="w-full rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition-colors duration-200 hover:bg-red-500/20 sm:w-auto"
          >
            Logout
          </button>
        </form>
      </header>

      <section className="mb-8 rounded-2xl border border-[#484454] bg-[#302e3b] p-4 shadow-xl shadow-black/10 sm:p-6">
        <h2 className="mb-5 text-lg font-semibold text-[#f5f3ff]">
          Your details
        </h2>

        <dl className="grid gap-5 sm:grid-cols-3">
          <div className="min-w-0">
            <dt className="text-sm text-[#a9a5b8]">Name</dt>
            <dd className="mt-1 break-words font-medium text-[#f5f3ff]">
              {admin.name}
            </dd>
          </div>

          <div className="min-w-0">
            <dt className="text-sm text-[#a9a5b8]">Email</dt>
            <dd className="mt-1 break-words font-medium text-[#f5f3ff]">
              {admin.email}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-[#a9a5b8]">Role</dt>
            <dd className="mt-2">
              <span className="inline-flex items-center rounded-full border border-[#c4b5fd]/20 bg-[#c4b5fd]/10 px-3 py-1 text-xs font-semibold text-[#d7ccff]">
                Admin
              </span>
            </dd>
          </div>
        </dl>
      </section>

      <nav aria-label="Admin sections" className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/tickets"
          className="group rounded-2xl border border-[#484454] bg-[#302e3b] p-5 transition-all duration-200 hover:border-[#8b5cf6]/60 hover:bg-[#363343] sm:p-6"
        >
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#c4b5fd]/15 bg-[#c4b5fd]/10 text-[#c4b5fd] transition-colors group-hover:bg-[#c4b5fd]/15">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
              />
            </svg>
          </div>

          <h2 className="text-lg font-semibold text-[#c4b5fd] transition-colors group-hover:text-[#a78bfa] sm:text-xl">
            Manage tickets
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#c4c1d0]">
            Review every ticket, update its status and priority, or delete it.
          </p>
          <div className="mt-4 text-sm font-medium text-[#a78bfa] transition-transform group-hover:translate-x-1">
            Manage tickets <span aria-hidden="true">→</span>
          </div>
        </Link>

        <Link
          href="/admin/users"
          className="group rounded-2xl border border-[#484454] bg-[#302e3b] p-5 transition-all duration-200 hover:border-[#8b5cf6]/60 hover:bg-[#363343] sm:p-6"
        >
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#c4b5fd]/15 bg-[#c4b5fd]/10 text-[#c4b5fd] transition-colors group-hover:bg-[#c4b5fd]/15">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm10 10v-2a4 4 0 0 0-3-3.87m-1-11.13a4 4 0 0 1 0 7.75"
              />
            </svg>
          </div>

          <h2 className="text-lg font-semibold text-[#c4b5fd] transition-colors group-hover:text-[#a78bfa] sm:text-xl">
            Manage users
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#c4c1d0]">
            Edit user names, emails, and roles.
          </p>
          <div className="mt-4 text-sm font-medium text-[#a78bfa] transition-transform group-hover:translate-x-1">
            Manage users <span aria-hidden="true">→</span>
          </div>
        </Link>
      </nav>
    </main>
  );
}
