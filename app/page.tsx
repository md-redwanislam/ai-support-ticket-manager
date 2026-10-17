import LoginForm from "@/components/login-form";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="mb-2 text-3xl font-bold">Welcome back</h1>

        <p className="mb-6 text-gray-600">Sign in to read and publish blogs.</p>

        <LoginForm />

        <p className="mt-5 text-center text-sm text-gray-600">
          New here?{" "}
          <Link href="/register" className="text-indigo-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
