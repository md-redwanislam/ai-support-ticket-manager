"use client";

import {
  adminUpdateTicket,
  type AdminTicketFormState,
} from "@/app/actions/admin-ticket";
import {
  formatLabel,
  ticketCategories,
  ticketPriorities,
  ticketStatuses,
  type TicketCategoryValue,
  type TicketPriorityValue,
  type TicketStatusValue,
} from "@/lib/ticket-constants";
import { useActionState, useState } from "react";

const initialState: AdminTicketFormState = {};

type AdminTicketFormProps = {
  ticketId: string;
  title: string;
  description: string;
  summary: string;
  category: TicketCategoryValue;
  priority: TicketPriorityValue;
  status: TicketStatusValue;
};

function FieldErrors({ errors }: { errors?: string[] }) {
  return errors?.map((error) => (
    <p key={error} role="alert" className="mt-1 text-sm text-red-600">
      {error}
    </p>
  ));
}

export default function AdminTicketForm(props: AdminTicketFormProps) {
  const [state, formAction, isPending] = useActionState(
    adminUpdateTicket,
    initialState,
  );

  const [title, setTitle] = useState(props.title);
  const [summary, setSummary] = useState(props.summary);
  const [description, setDescription] = useState(props.description);
  const [category, setCategory] = useState(props.category);
  const [priority, setPriority] = useState(props.priority);
  const [status, setStatus] = useState(props.status);

  return (
    <form action={formAction} className="space-y-5">
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
          className="w-full rounded-lg border border-[#484454] bg-[#24232d] px-3 py-3 text-sm text-white outline-none transition placeholder:text-[#a9a5b8] focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/20"
        />
        <FieldErrors errors={state.fieldErrors?.title} />
      </div>

      <div>
        <label
          htmlFor="summary"
          className="mb-2 block text-sm font-medium text-[#f5f3ff]"
        >
          Summary <span className="font-normal text-[#a9a5b8]">(optional)</span>
        </label>
        <textarea
          id="summary"
          name="summary"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          rows={3}
          maxLength={1000}
          className="w-full resize-y rounded-lg border border-[#484454] bg-[#24232d] px-3 py-3 text-sm text-white outline-none transition placeholder:text-[#a9a5b8] focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/20"
        />
        <FieldErrors errors={state.fieldErrors?.summary} />
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
          className="w-full resize-y rounded-lg border border-[#484454] bg-[#24232d] px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-[#a9a5b8] focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/20"
        />
        <FieldErrors errors={state.fieldErrors?.description} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-[#f5f3ff]"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as TicketStatusValue)
            }
            className="w-full rounded-lg border border-[#484454] bg-[#24232d] px-3 py-3 text-sm text-white outline-none transition focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/20"
          >
            {ticketStatuses.map((value) => (
              <option
                key={value}
                value={value}
                className="bg-[#302e3b] text-white"
              >
                {formatLabel(value)}
              </option>
            ))}
          </select>
          <FieldErrors errors={state.fieldErrors?.status} />
        </div>

        <div>
          <label
            htmlFor="priority"
            className="mb-2 block text-sm font-medium text-[#f5f3ff]"
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as TicketPriorityValue)
            }
            className="w-full rounded-lg border border-[#484454] bg-[#24232d] px-3 py-3 text-sm text-white outline-none transition focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/20"
          >
            {ticketPriorities.map((value) => (
              <option
                key={value}
                value={value}
                className="bg-[#302e3b] text-white"
              >
                {formatLabel(value)}
              </option>
            ))}
          </select>
          <FieldErrors errors={state.fieldErrors?.priority} />
        </div>

        <div className="sm:col-span-2">
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
            className="w-full rounded-lg border border-[#484454] bg-[#24232d] px-3 py-3 text-sm text-white outline-none transition focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/20"
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
          <FieldErrors errors={state.fieldErrors?.category} />
        </div>
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
