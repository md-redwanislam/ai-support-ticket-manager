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
        <label htmlFor="name" className="mb-1 block font-medium">
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
          className="w-full rounded-lg border p-3"
        />
        {state.fieldErrors?.name?.map((error) => (
          <p key={error} role="alert" className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block font-medium">
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
          className="w-full rounded-lg border p-3"
        />
        {state.fieldErrors?.email?.map((error) => (
          <p key={error} role="alert" className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      <div>
        <label htmlFor="role" className="mb-1 block font-medium">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(event) => setRole(event.target.value as "USER" | "ADMIN")}
          disabled={props.isSelf}
          className="w-full rounded-lg border bg-white p-3 disabled:bg-gray-50 disabled:text-gray-500"
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        {props.isSelf && (
          <p className="mt-1 text-xs text-gray-500">
            You can&apos;t change your own role.
          </p>
        )}
        {state.fieldErrors?.role?.map((error) => (
          <p key={error} role="alert" className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">
          {state.error}
        </p>
      )}

      {state.success && (
        <p role="status" className="rounded-lg bg-green-50 p-3 text-green-700">
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-indigo-600 px-5 py-3 text-white disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
