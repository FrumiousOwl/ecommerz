"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import ThemeDropdown from "./ThemeDropdown";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { state } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") ?? "";
  const [q, setQ] = useState(qParam);
  const cartCount = state.cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => setQ(qParam), [qParam]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    const target = query ? `/products?q=${encodeURIComponent(query)}` : "/products";
    router.push(target);
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="font-semibold">ecomerz</Link>
        <nav className="ml-4 hidden gap-4 md:flex">
          <Link href="/products" className="hover:underline">Products</Link>
          <Link href="/orders" className="hover:underline">Orders</Link>
          <Link href="/wishlist" className="hover:underline">Wishlist</Link>
          <Link href="/tickets" className="hover:underline">Tickets</Link>
          <Link href="/messages" className="hover:underline">Messages</Link>
        </nav>
        <form onSubmit={onSubmit} className="ml-auto flex min-w-0 flex-1 items-center gap-2 md:max-w-md">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-md border px-3 py-2 text-sm bg-transparent"
          />
          <button className="rounded-md border px-3 py-2 text-sm">Search</button>
        </form>
        <div className="ml-2 flex items-center gap-2">
          <ThemeDropdown />
          <Link href="/cart" className="relative rounded-md border px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10">
            Cart
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-black text-white dark:bg-white dark:text-black px-1 text-[10px]">
                {cartCount}
              </span>
            )}
          </Link>
          {state.user ? (
            <Link href="/profile" className="rounded-md border px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10">{state.user.firstName ?? "Account"}</Link>
          ) : (
            <Link href="/login" className="rounded-md border px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
}