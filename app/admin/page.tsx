import { requireAdmin } from "@/lib/getAuthUser";
import Link from "next/link";
import { logoutUser } from "../actions/auth";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();

  return (
    <main className="mx-auto min-h-screen max-w-3xl p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {admin.name}.</p>
        <form action={logoutUser} className="mt-4">
          <button
            type="submit"
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </form>
      </header>

      <section className="mb-8 rounded-xl border p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Your details</h2>

        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-gray-500">Name</dt>
            <dd className="mt-1 font-medium">{admin.name}</dd>
          </div>

          <div className="min-w-0">
            <dt className="text-sm text-gray-500">Email</dt>
            <dd className="mt-1 break-words font-medium">{admin.email}</dd>
          </div>

          <div>
            <dt className="text-sm text-gray-500">Role</dt>
            <dd className="mt-1">
              <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                Admin
              </span>
            </dd>
          </div>
        </dl>
      </section>

      <nav aria-label="Admin sections" className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/tickets"
          className="rounded-xl border p-6 hover:border-indigo-500 hover:bg-indigo-50/50"
        >
          <h2 className="text-xl font-semibold text-indigo-700">
            Manage tickets
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Review every ticket, update its status and priority, or delete it.
          </p>
        </Link>

        <Link
          href="/admin/users"
          className="rounded-xl border p-6 hover:border-indigo-500 hover:bg-indigo-50/50"
        >
          <h2 className="text-xl font-semibold text-indigo-700">
            Manage users
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Edit user names, emails, and roles.
          </p>
        </Link>
      </nav>
    </main>
  );
}
