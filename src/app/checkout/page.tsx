"use client";

import { useApp } from "@/context/AppContext";
import { Address, Order } from "@/lib/type";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(cents / 100);
}

const emptyAddress: Address = {
  id: "addr1",
  fullName: "",
  line1: "",
  city: "",
  postalCode: "",
  country: "",
};

export default function CheckoutPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState(state.user?.email || "");
  const [address, setAddress] = useState<Address>(state.user?.addresses[0] || emptyAddress);
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

  function placeOrder() {
    if (!email || !address.fullName || !address.line1 || !address.city || !address.postalCode || !address.country) {
      alert("Please fill in email and address");
      return;
    }
    const order: Order = {
      id: crypto.randomUUID(),
      userId: state.user?.id,
      email,
      shippingAddress: { ...address, id: address.id || crypto.randomUUID() },
      items: lines.map(({ item, product }) => ({
        productId: product.id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
        selectedVariations: item.selectedVariations,
      })),
      subtotalCents,
      discountCents,
      totalCents,
      voucherCodeApplied: voucher?.code,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "PLACE_ORDER", payload: order });
    alert("Order placed!");
    router.push(`/orders/${order.id}`);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="grid gap-4 lg:col-span-2">
        <div className="rounded-md border p-4">
          <div className="font-medium">Contact</div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="mt-2 w-full rounded-md border px-3 py-2 text-sm" />
        </div>
        <div className="rounded-md border p-4">
          <div className="font-medium">Shipping Address</div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <input value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} placeholder="Full name" className="rounded-md border px-3 py-2 text-sm" />
            <input value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} placeholder="Address line 1" className="rounded-md border px-3 py-2 text-sm sm:col-span-2" />
            <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="City" className="rounded-md border px-3 py-2 text-sm" />
            <input value={address.state || ""} onChange={(e) => setAddress({ ...address, state: e.target.value })} placeholder="State" className="rounded-md border px-3 py-2 text-sm" />
            <input value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} placeholder="Postal code" className="rounded-md border px-3 py-2 text-sm" />
            <input value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} placeholder="Country" className="rounded-md border px-3 py-2 text-sm" />
          </div>
        </div>
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
        <button onClick={placeOrder} className="mt-3 w-full rounded-md border px-3 py-2 text-sm">Place Order</button>
        {!state.user && <div className="mt-1 text-xs text-black/60 dark:text-white/60">Guest checkout enabled.</div>}
      </div>
    </div>
  );
}