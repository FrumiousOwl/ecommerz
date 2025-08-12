import { Product, Voucher, Review } from "./types";

export const sampleProducts: Product[] = [
  {
    id: "p1",
    slug: "classic-t-shirt",
    title: "Classic T-Shirt",
    description: "Soft cotton t-shirt with timeless fit.",
    price: 1999,
    currency: "USD",
    images: ["/products/tshirt1.jpg"],
    brand: "Acme",
    category: "Apparel",
    stock: 120,
    variationOptions: [
      { name: "Size", values: ["S", "M", "L", "XL"] },
      { name: "Color", values: ["Black", "White", "Navy"] },
    ],
    ratingAverage: 4.4,
    ratingCount: 38,
  },
  {
    id: "p2",
    slug: "running-shoes",
    title: "Running Shoes",
    description: "Lightweight shoes for everyday runs.",
    price: 7499,
    currency: "USD",
    images: ["/products/shoes1.jpg"],
    brand: "Fleet",
    category: "Footwear",
    stock: 60,
    variationOptions: [
      { name: "Size", values: ["7", "8", "9", "10", "11"] },
      { name: "Color", values: ["Gray", "Blue"] },
    ],
    ratingAverage: 4.6,
    ratingCount: 57,
  },
  {
    id: "p3",
    slug: "wireless-headphones",
    title: "Wireless Headphones",
    description: "Noise-cancelling over-ear headphones.",
    price: 12999,
    currency: "USD",
    images: ["/products/headphones1.jpg"],
    brand: "Sonic",
    category: "Electronics",
    stock: 35,
    variationOptions: [
      { name: "Color", values: ["Black", "Silver"] },
    ],
    ratingAverage: 4.7,
    ratingCount: 103,
  },
];

export const sampleVouchers: Voucher[] = [
  { code: "WELCOME10", description: "10% off for new customers", discountType: "percent", amount: 10 },
  { code: "SAVE15", description: "$15 off orders over $100", discountType: "fixed", amount: 15, minSubtotalCents: 10000 },
];

export const sampleReviews: Review[] = [
  {
    id: "r1",
    productId: "p1",
    authorName: "Jane D.",
    rating: 5,
    comment: "Great fit and feel!",
    createdAt: new Date().toISOString(),
  },
  {
    id: "r2",
    productId: "p2",
    authorName: "Chris P.",
    rating: 4,
    comment: "Comfortable for long runs.",
    createdAt: new Date().toISOString(),
  },
];