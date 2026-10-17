"use client";

import { createTicket, type TicketFormState } from "@/app/actions/ticket";
import { generateTicketSuggestionAction } from "@/app/actions/ticket-ai";
import {
  ticketCategories,
  ticketPriorities,
  type TicketCategoryValue,
  type TicketPriorityValue,
} from "@/lib/ticket-constants";
import { useActionState, useState, useTransition } from "react";

const initialState: TicketFormState = {};

function formatLabel(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase().replace("_", " ");
}

export default function CreateTicketForm() {
  const [state, formAction, isPending] = useActionState(
    createTicket,
    initialState,
  );
  const [isSuggesting, startSuggesting] = useTransition();

  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState<TicketCategoryValue>("GENERAL");
  const [priority, setPriority] = useState<TicketPriorityValue>("MEDIUM");

  const [aiError, setAiError] = useState<string | null>(null);
  const [hasSuggestion, setHasSuggestion] = useState(false);

  function handleSuggest() {
    setAiError(null);

    startSuggesting(async () => {
      const response = await generateTicketSuggestionAction(description);

      if (response.error || !response.result) {
        setAiError(response.error ?? "Could not generate suggestions.");
        return;
      }

      setTitle(response.result.title);
      setSummary(response.result.summary);
      setCategory(response.result.category);
      setPriority(response.result.priority);
      setHasSuggestion(true);
    });
  }

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="ticket-description"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Problem description
        </label>

        <textarea
          id="ticket-description"
          name="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={7}
          maxLength={5000}
          required
          className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-indigo-500"
          placeholder="Describe what happened and what you expected..."
        />

        {state.fieldErrors?.description?.map((error) => (
          <p key={error} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-5">
        <div className="mb-3 flex items-center gap-2">
          <span aria-hidden="true">✨</span>
          <h2 className="text-lg font-semibold text-gray-900">
            AI ticket assistant
          </h2>
        </div>

        <p className="mb-4 text-sm text-gray-600">
          Suggest a title, summary, category, and priority from your
          description. Review and edit them below before submitting.
        </p>

        <button
          type="button"
          onClick={handleSuggest}
          disabled={isSuggesting || description.trim().length < 10}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSuggesting
            ? "Generating suggestions..."
            : hasSuggestion
              ? "Regenerate suggestions"
              : "Suggest ticket details"}
        </button>

        {hasSuggestion && !aiError && (
          <p role="status" className="mt-3 text-sm text-indigo-800">
            Suggestions applied below. Regenerating replaces any edits you made
            to them.
          </p>
        )}

        {aiError && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {aiError}
          </p>
        )}
      </section>

      <div>
        <label
          htmlFor="ticket-title"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Title
        </label>

        <input
          id="ticket-title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          minLength={3}
          maxLength={160}
          required
          className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-indigo-500"
          placeholder="Short title for your ticket"
        />

        {state.fieldErrors?.title?.map((error) => (
          <p key={error} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      <div>
        <label
          htmlFor="ticket-summary"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Summary (optional)
        </label>

        <textarea
          id="ticket-summary"
          name="summary"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          rows={3}
          maxLength={1000}
          className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-indigo-500"
          placeholder="A brief summary of the problem"
        />

        {state.fieldErrors?.summary?.map((error) => (
          <p key={error} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="ticket-category"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Category
          </label>

          <select
            id="ticket-category"
            name="category"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as TicketCategoryValue)
            }
            className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-indigo-500"
          >
            {ticketCategories.map((value) => (
              <option key={value} value={value}>
                {formatLabel(value)}
              </option>
            ))}
          </select>

          {state.fieldErrors?.category?.map((error) => (
            <p key={error} className="mt-1 text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>

        <div>
          <label
            htmlFor="ticket-priority"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Priority
          </label>

          <select
            id="ticket-priority"
            name="priority"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as TicketPriorityValue)
            }
            className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-indigo-500"
          >
            {ticketPriorities.map((value) => (
              <option key={value} value={value}>
                {formatLabel(value)}
              </option>
            ))}
          </select>

          <p className="mt-1 text-xs text-gray-500">
            Only admins can change the priority after you submit.
          </p>

          {state.fieldErrors?.priority?.map((error) => (
            <p key={error} className="mt-1 text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || isSuggesting}
        className="rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {isPending ? "Creating ticket..." : "Create ticket"}
      </button>
    </form>
  );
}
