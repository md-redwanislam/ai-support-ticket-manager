import { registerUser } from "@/app/actions/auth";
import Link from "next/link";

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const { error } = await searchParams;

  const errorMessage =
    error === "email"
      ? "This email is already registered."
      : error === "invalid"
        ? "Please enter valid details. Passwords must be at least 8 characters."
        : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#24232d] p-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-[#484454] bg-[#302e3b] p-6 shadow-2xl shadow-black/20 sm:p-8">
        <h1 className="mb-5 text-center text-3xl font-extrabold tracking-tight">
          <span className="text-[#c4b5fd] transition-colors duration-200 hover:text-[#8b5cf6]">
            Support
          </span>
          <span className="text-[#f5f3ff]">Desk</span>
        </h1>

        <h2 className="mb-2 text-2xl font-bold sm:text-3xl">
          Create an account
        </h2>

        <p className="mb-6 text-sm text-[#c4c1d0] sm:text-base">
          Register to create tickets.
        </p>

        {errorMessage && (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300"
          >
            {errorMessage}
          </p>
        )}

        <form action={registerUser} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-[#f5f3ff]"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              maxLength={80}
              className="w-full rounded-lg border border-[#484454] bg-[#24232d] p-3 text-white outline-none transition placeholder:text-[#9691a7] focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/20"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#f5f3ff]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              className="w-full rounded-lg border border-[#484454] bg-[#24232d] p-3 text-white outline-none transition placeholder:text-[#9691a7] focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#f5f3ff]"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={72}
              className="w-full rounded-lg border border-[#484454] bg-[#24232d] p-3 text-white outline-none transition placeholder:text-[#9691a7] focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/20"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#c4b5fd] p-3 font-semibold text-[#211b35] transition-colors duration-200 hover:bg-[#8b5cf6] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#c4b5fd] focus:ring-offset-2 focus:ring-offset-[#302e3b] active:bg-[#7c3aed]"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#c4c1d0]">
          Already have an account?{" "}
          <Link
            href="/"
            className="font-medium text-[#c4b5fd] transition-colors duration-200 hover:text-[#8b5cf6] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
