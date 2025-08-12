export type Address = {
  id: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
};

export type User = {
  id: string;
  email: string;
  passwordHash?: string; // mock only
  firstName?: string;
  lastName?: string;
  addresses: Address[];
  createdAt: string;
};

export type VariationOption = {
  name: string; // e.g., Size, Color
  values: string[];
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number; // cents
  currency: string;
  images: string[];
  brand?: string;
  category?: string;
  stock: number;
  variationOptions?: VariationOption[];
  ratingAverage?: number;
  ratingCount?: number;
};

export type Review = {
  id: string;
  productId: string;
  userId?: string; // guest reviews may not have a user id
  authorName: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
};

export type CartItem = {
  id: string; // unique id per cart item
  productId: string;
  quantity: number;
  selectedVariations?: Record<string, string>; // { Size: "M", Color: "Red" }
};

export type Voucher = {
  code: string;
  description?: string;
  discountType: "percent" | "fixed"; // percent or fixed in currency units
  amount: number; // if percent, 0-100; if fixed, currency units
  minSubtotalCents?: number;
  validFrom?: string;
  validTo?: string;
};

export type OrderItem = {
  productId: string;
  quantity: number;
  priceAtPurchase: number; // cents
  selectedVariations?: Record<string, string>;
};

export type Order = {
  id: string;
  userId?: string; // empty for guest
  email: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  voucherCodeApplied?: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  createdAt: string;
};

export type Ticket = {
  id: string;
  orderId: string;
  userId?: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  id: string;
  threadId: string;
  fromUserId?: string;
  fromName: string;
  body: string;
  createdAt: string;
};

export type MessageThread = {
  id: string;
  productId?: string; // inquiry about product
  userId?: string;
  subject: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
};

export type AppState = {
  user: User | null;
  products: Product[];
  reviews: Review[];
  cart: CartItem[];
  wishlist: string[]; // product ids
  orders: Order[];
  tickets: Ticket[];
  messageThreads: MessageThread[];
  vouchers: Voucher[];
  theme: "light" | "dark";
};