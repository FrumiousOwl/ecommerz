import Link from "next/link";
import { FaShoppingCart, FaStore, FaUserCircle } from "react-icons/fa";

export default function Home() {
  return (
    <div className="grid gap-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border bg-gray-50 p-10 shadow-lg dark:bg-gray-900 md:p-16">
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Discover Your Next Favorite Thing
          </h1>
          <p className="mt-4 max-w-lg text-lg text-gray-600 dark:text-gray-300">
            A demo store with modern features like a shopping cart, wishlists, and a seamless checkout experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-flex items-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <FaStore className="mr-2" />
              Browse Products
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <FaShoppingCart className="mr-2" />
              View Cart
            </Link>
          </div>
        </div>
        {/* An illustrative element for visual interest */}
        <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-blue-500/10 dark:bg-blue-400/10 blur-3xl"></div>
      </section>

      {/* Feature Cards Section */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 */}
        <div className="group rounded-xl border p-6 transition-all duration-300 hover:shadow-lg dark:hover:border-gray-600">
          <FaUserCircle className="h-8 w-8 text-blue-500" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Guest Checkout</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Checkout quickly and securely without creating an account.
          </p>
        </div>
        
        {/* Card 2 */}
        <div className="group rounded-xl border p-6 transition-all duration-300 hover:shadow-lg dark:hover:border-gray-600">
          <FaUserCircle className="h-8 w-8 text-blue-500" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Wishlist</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Save products you love for later.
          </p>
        </div>
        
        {/* Card 3 */}
        <div className="group rounded-xl border p-6 transition-all duration-300 hover:shadow-lg dark:hover:border-gray-600">
          <FaUserCircle className="h-8 w-8 text-blue-500" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Tickets & Messages</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Directly contact support or sellers for assistance.
          </p>
        </div>
      </section>
    </div>
  );
}