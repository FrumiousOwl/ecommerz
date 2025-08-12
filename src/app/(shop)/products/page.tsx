"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(cents / 100);
}

export default function ProductsPage() {
  const { state } = useApp();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";

  const [q, setQ] = useState(initialQ);
  const [category, setCategory] = useState<string | "">("");
  const [brand, setBrand] = useState<string | "">("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const categories = useMemo(() => Array.from(new Set(state.products.map((p) => p.category).filter(Boolean))) as string[], [state.products]);
  const brands = useMemo(() => Array.from(new Set(state.products.map((p) => p.brand).filter(Boolean))) as string[], [state.products]);

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    const min = minPrice ? parseInt(minPrice) * 100 : -Infinity;
    const max = maxPrice ? parseInt(maxPrice) * 100 : Infinity;
    return state.products.filter((p) => {
      const matchesQ = !qLower || [p.title, p.description, p.brand, p.category].filter(Boolean).some((s) => s!.toLowerCase().includes(qLower));
      const matchesCat = !category || p.category === category;
      const matchesBrand = !brand || p.brand === brand;
      const matchesPrice = p.price >= min && p.price <= max;
      return matchesQ && matchesCat && matchesBrand && matchesPrice;
    });
  }, [state.products, q, category, brand, minPrice, maxPrice]);

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Products</h1>
      <div className="grid gap-3 rounded-md border p-3 sm:grid-cols-2 lg:grid-cols-4">
        <input className="rounded-md border px-3 py-2 text-sm" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="rounded-md border px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select className="rounded-md border px-3 py-2 text-sm" value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">All brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <input className="w-1/2 rounded-md border px-3 py-2 text-sm" placeholder="Min $" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <input className="w-1/2 rounded-md border px-3 py-2 text-sm" placeholder="Max $" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Link key={p.id} href={`/products/${p.slug}`} className="group rounded-lg border p-4 hover:shadow">
            <div className="aspect-[4/3] w-full rounded-md bg-black/5 dark:bg-white/10" />
            <div className="mt-3 flex items-center justify-between gap-2">
              <h3 className="font-medium group-hover:underline">{p.title}</h3>
              <span className="text-sm">{formatPrice(p.price, p.currency)}</span>
            </div>
            {p.brand && <div className="text-xs text-black/60 dark:text-white/60">{p.brand}</div>}
          </Link>
        ))}
        {filtered.length === 0 && <div className="col-span-full py-12 text-center text-sm text-black/60 dark:text-white/60">No products found.</div>}
      </div>
    </div>
  );
}