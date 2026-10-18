import LoginForm from "@/components/login-form";
import { getCurrentUser } from "@/lib/getAuthUser";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/tickets");
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#24232d] p-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-[#484454] bg-[#302e3b] p-8 shadow-2xl shadow-black/20">
        <h1 className="mb-5 text-center text-3xl font-extrabold tracking-tight">
          <span className="text-[#c4b5fd] transition-colors duration-200 hover:text-[#8b5cf6]">
            Support
          </span>
          <span className="text-[#f5f3ff]">Desk</span>
        </h1>

        <h2 className="mb-2 text-3xl font-bold">Welcome back</h2>

        <p className="mb-6 text-[#c4c1d0]">
          Sign in to read and publish blogs.
        </p>

        <LoginForm />

        <p className="mt-5 text-center text-sm text-[#c4c1d0]">
          New here?{" "}
          <Link
            href="/register"
            className="font-medium text-[#c4b5fd] transition-colors duration-200 hover:text-[#8b5cf6] hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
