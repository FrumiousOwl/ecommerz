"use client";

import { useApp } from "@/context/AppContext";

export default function TicketsPage() {
  const { state, dispatch } = useApp();

  function updateStatus(id: string, status: typeof state.tickets[number]["status"]) {
    dispatch({ type: "UPDATE_TICKET_STATUS", payload: { id, status } });
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Support Tickets</h1>
      {state.tickets.length === 0 && <div className="rounded-md border p-6 text-sm">No tickets.</div>}
      <div className="grid gap-3">
        {state.tickets.map((t) => (
          <div key={t.id} className="rounded-md border p-3">
            <div className="text-sm font-medium">{t.subject} · <span className="text-black/60 dark:text-white/60">{t.status}</span></div>
            <div className="mt-1 text-sm">{t.message}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["open", "in_progress", "resolved", "closed"] as const).map((s) => (
                <button key={s} onClick={() => updateStatus(t.id, s)} className={`rounded-md border px-3 py-1 text-xs ${t.status === s ? "bg-black text-white dark:bg-white dark:text-black" : ""}`}>{s}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}