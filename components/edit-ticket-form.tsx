"use client";

import { updateTicket, type TicketFormState } from "@/app/actions/ticket";
import {
  formatLabel,
  ticketCategories,
  type TicketCategoryValue,
} from "@/lib/ticket-constants";
import { useActionState, useState } from "react";

const initialState: TicketFormState = {};

type EditTicketFormProps = {
  ticketId: string;
  title: string;
  description: string;
  summary: string;
  category: TicketCategoryValue;
};

export default function EditTicketForm(props: EditTicketFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateTicket,
    initialState,
  );

  // Controlled fields, so a failed save never wipes the user's edits.
  const [title, setTitle] = useState(props.title);
  const [description, setDescription] = useState(props.description);
  const [summary, setSummary] = useState(props.summary);
  const [category, setCategory] = useState<TicketCategoryValue>(props.category);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="ticketId" value={props.ticketId} />

      <div>
        <label htmlFor="title" className="mb-1 block font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          minLength={3}
          maxLength={160}
          className="w-full rounded-lg border p-3"
        />
        {state.fieldErrors?.title?.map((error) => (
          <p key={error} role="alert" className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      <div>
        <label htmlFor="summary" className="mb-1 block font-medium">
          Summary (optional)
        </label>
        <textarea
          id="summary"
          name="summary"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          rows={3}
          maxLength={1000}
          className="w-full rounded-lg border p-3"
        />
        {state.fieldErrors?.summary?.map((error) => (
          <p key={error} role="alert" className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
          minLength={10}
          maxLength={5000}
          rows={8}
          className="w-full rounded-lg border p-3"
        />
        {state.fieldErrors?.description?.map((error) => (
          <p key={error} role="alert" className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block font-medium">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as TicketCategoryValue)
          }
          className="w-full rounded-lg border bg-white p-3"
        >
          {ticketCategories.map((value) => (
            <option key={value} value={value}>
              {formatLabel(value)}
            </option>
          ))}
        </select>
        {state.fieldErrors?.category?.map((error) => (
          <p key={error} role="alert" className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}
        <p className="mt-1 text-xs text-gray-500">
          Priority and status are managed by admins.
        </p>
      </div>

      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">
          {state.error}
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
