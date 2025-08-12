"use client";

import { useApp } from "@/context/AppContext";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(cents / 100);
}

export default function OrderDetailPage() {
  const { state, dispatch } = useApp();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const order = useMemo(() => state.orders.find((o) => o.id === params.id), [state.orders, params.id]);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");

  if (!order) return <div>Order not found.</div>;

  function openTicket() {
    if (!ticketSubject || !ticketMessage) {
      alert("Please enter subject and message");
      return;
    }
    if (!order) return;
    dispatch({
      type: "ADD_TICKET",
      payload: {
        id: crypto.randomUUID(),
        orderId: order.id,
        userId: state.user?.id,
        subject: ticketSubject,
        message: ticketMessage,
        status: "open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
    router.push("/tickets");
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Order #{order.id.slice(0, 8)}</h1>
      <div className="rounded-md border p-4">
        <div className="font-medium">Items</div>
        <div className="mt-2 grid gap-2">
          {order.items.map((it, idx) => {
            const product = state.products.find((p) => p.id === it.productId)!;
            return (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div>{product.title} × {it.quantity}</div>
                <div>{formatPrice(it.priceAtPurchase * it.quantity, product.currency)}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 grid gap-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotalCents, "USD")}</span></div>
          <div className="flex justify-between"><span>Discount</span><span>-{formatPrice(order.discountCents, "USD")}</span></div>
          <div className="flex justify-between font-medium"><span>Total</span><span>{formatPrice(order.totalCents, "USD")}</span></div>
        </div>
      </div>
      <div className="rounded-md border p-4">
        <div className="font-medium">Need help?</div>
        <div className="mt-2 grid gap-2">
          <input value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} placeholder="Subject" className="rounded-md border px-3 py-2 text-sm" />
          <textarea value={ticketMessage} onChange={(e) => setTicketMessage(e.target.value)} placeholder="Describe the issue" className="h-28 rounded-md border px-3 py-2 text-sm" />
          <button onClick={openTicket} className="rounded-md border px-3 py-2 text-sm">Open Ticket</button>
        </div>
      </div>
    </div>
  );
}