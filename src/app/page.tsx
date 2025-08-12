import Link from "next/link";

export default function Home() {
  return (
    <div className="grid gap-8">
      <section className="rounded-xl border p-6">
        <h1 className="text-2xl font-semibold">Welcome to ecomerz</h1>
        <p className="mt-2 text-sm text-black/70 dark:text-white/70">A demo store with authentication, cart, wishlist, orders, tickets, messages, reviews, vouchers and more.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/products" className="rounded-md border px-4 py-2 text-sm">Browse Products</Link>
          <Link href="/cart" className="rounded-md border px-4 py-2 text-sm">View Cart</Link>
          <Link href="/login" className="rounded-md border px-4 py-2 text-sm">Sign in</Link>
        </div>
      </section>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Guest Checkout</h3>
          <p className="text-sm text-black/70 dark:text-white/70">Checkout without creating an account.</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Wishlist</h3>
          <p className="text-sm text-black/70 dark:text-white/70">Save products for later.</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Tickets & Messages</h3>
          <p className="text-sm text-black/70 dark:text-white/70">Contact support or ask sellers.</p>
        </div>
      </section>
    </div>
  );
}
