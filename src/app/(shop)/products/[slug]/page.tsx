"use client";

import { useApp } from "@/context/AppContext";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Review } from "@/lib/types";

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(cents / 100);
}

export default function ProductDetailPage() {
  const { state, dispatch } = useApp();
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const product = useMemo(() => state.products.find((p) => p.slug === params.slug), [state.products, params.slug]);

  const [selected, setSelected] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  if (!product) return <div>Product not found.</div>;

  const isWishlisted = product ? state.wishlist.includes(product.id) : false;

  function addToCart() {
    if (!product) return;
    const id = `${product.id}:${Object.entries(selected).map(([k, v]) => `${k}=${v}`).join(";") || "default"}`;
    dispatch({ type: "ADD_TO_CART", payload: { id, productId: product.id, quantity, selectedVariations: selected } });
    router.push("/cart");
  }

  function toggleWishlist() {
    if (!product) return;
    dispatch({ type: "TOGGLE_WISHLIST", payload: product.id });
  }

  function submitReview() {
    if (!product) return;
    const newReview: Review = {
      id: crypto.randomUUID(),
      productId: product.id,
      userId: state.user?.id,
      authorName: state.user ? `${state.user.firstName ?? "User"}` : "Guest",
      rating: reviewRating,
      comment: reviewComment || undefined,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_REVIEW", payload: newReview });
    setReviewComment("");
    setReviewRating(5);
  }

  const productReviews = state.reviews.filter((r) => r.productId === product.id);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <div className="aspect-[4/3] w-full rounded-md bg-black/5 dark:bg-white/10" />
      </div>
      <div className="grid gap-4">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <div className="text-black/70 dark:text-white/70">{product.description}</div>
        <div className="text-lg font-medium">{formatPrice(product.price, product.currency)}</div>
        {product.variationOptions?.map((opt) => (
          <div key={opt.name} className="grid gap-1">
            <label className="text-sm font-medium">{opt.name}</label>
            <div className="flex flex-wrap gap-2">
              {opt.values.map((val) => {
                const active = selected[opt.name] === val;
                return (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setSelected((s) => ({ ...s, [opt.name]: val }))}
                    className={`rounded-md border px-3 py-1 text-sm ${active ? "bg-black text-white dark:bg-white dark:text-black" : ""}`}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <label className="text-sm">Qty</label>
          <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value || "1")))} className="w-20 rounded-md border px-3 py-2 text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={addToCart} className="rounded-md border px-4 py-2 text-sm">Add to Cart</button>
          <button onClick={toggleWishlist} className="rounded-md border px-4 py-2 text-sm">{isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}</button>
        </div>

        <section className="mt-6 grid gap-3">
          <h2 className="font-semibold">Reviews</h2>
          <div className="grid gap-2">
            {productReviews.length === 0 && <div className="text-sm text-black/60 dark:text-white/60">No reviews yet.</div>}
            {productReviews.map((r) => (
              <div key={r.id} className="rounded-md border p-3">
                <div className="text-sm font-medium">{r.authorName} · {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                {r.comment && <div className="text-sm text-black/70 dark:text-white/70">{r.comment}</div>}
              </div>
            ))}
          </div>
          <div className="rounded-md border p-3">
            <div className="text-sm font-medium">Add a review</div>
            <div className="mt-2 flex items-center gap-2">
              <select value={reviewRating} onChange={(e) => setReviewRating(parseInt(e.target.value))} className="rounded-md border px-3 py-2 text-sm">
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} Star{n > 1 ? "s" : ""}</option>
                ))}
              </select>
              <input value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Write a comment (optional)" className="flex-1 rounded-md border px-3 py-2 text-sm" />
              <button onClick={submitReview} className="rounded-md border px-3 py-2 text-sm">Submit</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}