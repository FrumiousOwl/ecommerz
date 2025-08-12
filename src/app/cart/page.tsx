"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useMemo, useState } from "react";

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(cents / 100);
}

export default function CartPage() {
  const { state, dispatch } = useApp();
  const [voucherCode, setVoucherCode] = useState("");

  const lines = state.cart.map((item) => {
    const product = state.products.find((p) => p.id === item.productId)!;
    return { item, product };
  });

  const subtotalCents = useMemo(() => lines.reduce((sum, l) => sum + l.product.price * l.item.quantity, 0), [lines]);
  const voucher = state.vouchers.find((v) => v.code.toLowerCase() === voucherCode.trim().toLowerCase());
  const discountCents = useMemo(() => {
    if (!voucher) return 0;
    if (voucher.minSubtotalCents && subtotalCents < voucher.minSubtotalCents) return 0;
    if (voucher.discountType === "percent") {
      return Math.floor((subtotalCents * voucher.amount) / 100);
    } else {
      return Math.min(voucher.amount * 100, subtotalCents);
    }
  }, [voucher, subtotalCents]);
  const totalCents = subtotalCents - discountCents;

  function removeLine(id: string) {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  }

  function updateQty(id: string, q: number) {
    dispatch({ type: "UPDATE_CART_QTY", payload: { id, quantity: Math.max(1, q) } });
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Cart</h1>
      {lines.length === 0 && (
        <div className="rounded-md border p-6 text-sm">
          Your cart is empty. <Link className="underline" href="/products">Browse products</Link>
        </div>
      )}
      {lines.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="grid gap-3 lg:col-span-2">
            {lines.map(({ item, product }) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-md border p-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="h-16 w-20 rounded bg-black/5 dark:bg-white/10" />
                  <div className="min-w-0">
                    <div className="truncate font-medium">{product.title}</div>
                    <div className="text-xs text-black/60 dark:text-white/60">{item.selectedVariations && Object.entries(item.selectedVariations).map(([k, v]) => `${k}: ${v}`).join(", ")}</div>
                    <div className="text-sm">{formatPrice(product.price, product.currency)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" min={1} value={item.quantity} onChange={(e) => updateQty(item.id, parseInt(e.target.value || "1"))} className="w-20 rounded-md border px-3 py-2 text-sm" />
                  <button onClick={() => removeLine(item.id)} className="rounded-md border px-3 py-2 text-sm">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-md border p-4">
            <div className="font-medium">Summary</div>
            <div className="mt-2 grid gap-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotalCents, state.products[0]?.currency || "USD")}</span></div>
              <div className="flex justify-between items-center gap-2">
                <span>Voucher</span>
                <input value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} placeholder="Code" className="w-28 rounded-md border px-2 py-1 text-sm" />
              </div>
              <div className="flex justify-between"><span>Discount</span><span>-{formatPrice(discountCents, state.products[0]?.currency || "USD")}</span></div>
              <div className="flex justify-between font-medium"><span>Total</span><span>{formatPrice(totalCents, state.products[0]?.currency || "USD")}</span></div>
            </div>
            <div className="mt-3 grid gap-2">
              <Link href="/checkout" className="rounded-md border px-3 py-2 text-sm text-center">Checkout</Link>
              {!state.user && <div className="text-xs text-black/60 dark:text-white/60">You can checkout as a guest.</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}