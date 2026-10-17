"use client";

import { loginUser } from "@/app/actions/auth";
import { useActionState } from "react";

const initialState = {
  error: "",
};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginUser, initialState);

  return (
    <form action={formAction} className="space-y-4">
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
          autoComplete="current-password"
          required
          maxLength={72}
          className="w-full rounded border p-3"
        />
      </div>

      {state.error && (
        <p role="alert" className="rounded bg-red-50 p-3 text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-indigo-600 p-3 text-white disabled:opacity-50"
      >
        {pending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
