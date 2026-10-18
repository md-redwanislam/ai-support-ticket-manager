"use client";

import { updateUser, type UserFormState } from "@/app/actions/user";
import { useActionState, useState } from "react";

const initialState: UserFormState = {};

type EditUserFormProps = {
  userId: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  isSelf: boolean;
};

export default function EditUserForm(props: EditUserFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateUser,
    initialState,
  );

  const [name, setName] = useState(props.name);
  const [email, setEmail] = useState(props.email);
  const [role, setRole] = useState(props.role);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="userId" value={props.userId} />

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
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          minLength={2}
          maxLength={100}
          className="w-full rounded-lg border border-[#484454] bg-[#24232d] px-3 py-3 text-sm text-white outline-none transition placeholder:text-[#a9a5b8] focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/20"
        />
        {state.fieldErrors?.name?.map((error) => (
          <p key={error} role="alert" className="mt-2 text-sm text-red-300">
            {error}
          </p>
        ))}
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
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          maxLength={254}
          className="w-full rounded-lg border border-[#484454] bg-[#24232d] px-3 py-3 text-sm text-white outline-none transition placeholder:text-[#a9a5b8] focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/20"
        />
        {state.fieldErrors?.email?.map((error) => (
          <p key={error} role="alert" className="mt-2 text-sm text-red-300">
            {error}
          </p>
        ))}
      </div>

      <div>
        <label
          htmlFor="role"
          className="mb-2 block text-sm font-medium text-[#f5f3ff]"
        >
          Role
        </label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(event) => setRole(event.target.value as "USER" | "ADMIN")}
          disabled={props.isSelf}
          className="w-full rounded-lg border border-[#484454] bg-[#24232d] px-3 py-3 text-sm text-white outline-none transition focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="USER" className="bg-[#302e3b] text-white">
            User
          </option>
          <option value="ADMIN" className="bg-[#302e3b] text-white">
            Admin
          </option>
        </select>

        {props.isSelf && (
          <p className="mt-2 text-xs leading-5 text-[#a9a5b8]">
            You can&apos;t change your own role.
          </p>
        )}

        {state.fieldErrors?.role?.map((error) => (
          <p key={error} role="alert" className="mt-2 text-sm text-red-300">
            {error}
          </p>
        ))}
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300"
        >
          {state.error}
        </p>
      )}

      {state.success && (
        <p
          role="status"
          className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-300"
        >
          {state.success}
        </p>
      )}

      <div className="border-t border-[#484454] pt-5">
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-[#c4b5fd] px-5 py-3 text-sm font-semibold text-[#24232d] transition-colors duration-200 hover:bg-[#a78bfa] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
