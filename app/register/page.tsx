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
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="mb-2 text-3xl font-bold">Create an account</h1>

        <p className="mb-6 text-gray-600">
          Register to start publishing blogs.
        </p>

        {errorMessage && (
          <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-red-700">
            {errorMessage}
          </p>
        )}

        <form action={registerUser} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block">
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
              className="w-full rounded border p-3"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              className="w-full rounded border p-3"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block">
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
              className="w-full rounded border p-3"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-indigo-600 p-3 text-white hover:bg-indigo-700"
          >
            Register
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/" className="text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
