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
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="ticketId" value={props.ticketId} />

      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-[#f5f3ff]"
        >
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
          className="w-full rounded-lg border border-[#484454] bg-[#24232d] p-3 text-white outline-none transition placeholder:text-[#9691a7] focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/20"
        />
        {state.fieldErrors?.title?.map((error) => (
          <p key={error} role="alert" className="mt-1 text-sm text-red-300">
            {error}
          </p>
        ))}
      </div>

      <div>
        <label
          htmlFor="summary"
          className="mb-2 block text-sm font-medium text-[#f5f3ff]"
        >
          Summary (optional)
        </label>
        <textarea
          id="summary"
          name="summary"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          rows={3}
          maxLength={1000}
          className="w-full rounded-lg border border-[#484454] bg-[#24232d] p-3 text-white outline-none transition placeholder:text-[#9691a7] focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/20"
        />
        {state.fieldErrors?.summary?.map((error) => (
          <p key={error} role="alert" className="mt-1 text-sm text-red-300">
            {error}
          </p>
        ))}
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-[#f5f3ff]"
        >
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
          className="w-full rounded-lg border border-[#484454] bg-[#24232d] p-3 text-white outline-none transition placeholder:text-[#9691a7] focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/20"
        />
        {state.fieldErrors?.description?.map((error) => (
          <p key={error} role="alert" className="mt-1 text-sm text-red-300">
            {error}
          </p>
        ))}
      </div>

      <div>
        <label
          htmlFor="category"
          className="mb-2 block text-sm font-medium text-[#f5f3ff]"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as TicketCategoryValue)
          }
          className="w-full rounded-lg border border-[#484454] bg-[#24232d] p-3 text-white outline-none transition focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/20"
        >
          {ticketCategories.map((value) => (
            <option
              key={value}
              value={value}
              className="bg-[#302e3b] text-white"
            >
              {formatLabel(value)}
            </option>
          ))}
        </select>
        {state.fieldErrors?.category?.map((error) => (
          <p key={error} role="alert" className="mt-1 text-sm text-red-300">
            {error}
          </p>
        ))}
        <p className="mt-2 text-xs leading-5 text-[#a9a5b8]">
          Priority and status are managed by admins.
        </p>
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
        disabled={isPending}
        className="w-full rounded-lg bg-[#c4b5fd] px-5 py-3 font-semibold text-[#211b35] transition-colors duration-200 hover:bg-[#8b5cf6] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {isPending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
