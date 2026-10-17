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
        <FieldErrors errors={state.fieldErrors?.title} />
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
        <FieldErrors errors={state.fieldErrors?.summary} />
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
        <FieldErrors errors={state.fieldErrors?.description} />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="status" className="mb-1 block font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as TicketStatusValue)
            }
            className="w-full rounded-lg border bg-white p-3"
          >
            {ticketStatuses.map((value) => (
              <option key={value} value={value}>
                {formatLabel(value)}
              </option>
            ))}
          </select>
          <FieldErrors errors={state.fieldErrors?.status} />
        </div>

        <div>
          <label htmlFor="priority" className="mb-1 block font-medium">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as TicketPriorityValue)
            }
            className="w-full rounded-lg border bg-white p-3"
          >
            {ticketPriorities.map((value) => (
              <option key={value} value={value}>
                {formatLabel(value)}
              </option>
            ))}
          </select>
          <FieldErrors errors={state.fieldErrors?.priority} />
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
          <FieldErrors errors={state.fieldErrors?.category} />
        </div>
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
