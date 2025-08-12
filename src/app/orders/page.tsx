"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(cents / 100);
}

export default function OrdersPage() {
  const { state } = useApp();
  const orders = state.orders;

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Orders</h1>
      {orders.length === 0 && <div className="rounded-md border p-6 text-sm">No orders yet.</div>}
      <div className="grid gap-3">
        {orders.map((o) => (
          <Link key={o.id} href={`/orders/${o.id}`} className="rounded-md border p-3 hover:shadow">
            <div className="flex items-center justify-between">
              <div className="text-sm">Order #{o.id.slice(0, 8)} · {o.items.length} items · {o.status}</div>
              <div className="text-sm font-medium">{formatPrice(o.totalCents, "USD")}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}