"use client";

import { loginUser } from "@/app/actions/auth";
import { useActionState } from "react";

const initialState = {
  error: "",
};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginUser, initialState);

  return (
    <form action={formAction} className="space-y-5">
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
          autoComplete="current-password"
          required
          maxLength={72}
          className="w-full rounded-lg border border-[#484454] bg-[#24232d] p-3 text-white outline-none transition focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/20"
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[#c4b5fd] p-3 font-semibold text-[#211b35] transition-colors duration-200 hover:bg-[#8b5cf6] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
