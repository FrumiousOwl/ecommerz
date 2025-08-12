"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function WishlistPage() {
  const { state, dispatch } = useApp();
  const items = state.products.filter((p) => state.wishlist.includes(p.id));

  function addToCart(productId: string) {
    const id = `${productId}:default`;
    dispatch({ type: "ADD_TO_CART", payload: { id, productId, quantity: 1 } });
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Wishlist</h1>
      {items.length === 0 && <div className="rounded-md border p-6 text-sm">No items in wishlist.</div>}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <div key={p.id} className="rounded-md border p-3">
            <div className="aspect-[4/3] w-full rounded-md bg-black/5 dark:bg-white/10" />
            <div className="mt-2 font-medium">{p.title}</div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => addToCart(p.id)} className="rounded-md border px-3 py-2 text-sm">Add to Cart</button>
              <Link href={`/products/${p.slug}`} className="rounded-md border px-3 py-2 text-sm">View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}