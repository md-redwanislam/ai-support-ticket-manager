"use client";

import { deleteTicket } from "@/app/actions/admin-ticket";

export default function DeleteTicketButton({ ticketId }: { ticketId: string }) {
  return (
    <form action={deleteTicket}>
      <input type="hidden" name="ticketId" value={ticketId} />

      <button
        type="submit"
        onClick={(event) => {
          // Cancelling the click stops the form from submitting.
          if (!window.confirm("Delete this ticket? This cannot be undone.")) {
            event.preventDefault();
          }
        }}
        className="rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
      >
        Delete ticket
      </button>
    </form>
  );
}
