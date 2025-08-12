"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { AppState, CartItem, MessageThread, Order, Review, Ticket, User } from "@/lib/type";
import { readJson, writeJson, readString, writeString, isBrowser } from "@/lib/storage";
import { sampleProducts, sampleReviews, sampleVouchers } from "@/lib/data";

const STORAGE_KEY = "ecomerz_app_state_v1";
const THEME_KEY = "ecomerz_theme";

const initialState: AppState = {
  user: null,
  products: sampleProducts,
  reviews: sampleReviews,
  cart: [],
  wishlist: [],
  orders: [],
  tickets: [],
  messageThreads: [],
  vouchers: sampleVouchers,
  theme: "light",
};

// Actions

type Action =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_CART_QTY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_WISHLIST"; payload: string }
  | { type: "PLACE_ORDER"; payload: Order }
  | { type: "ADD_REVIEW"; payload: Review }
  | { type: "ADD_TICKET"; payload: Ticket }
  | { type: "UPDATE_TICKET_STATUS"; payload: { id: string; status: Ticket["status"] } }
  | { type: "ADD_MESSAGE_THREAD"; payload: MessageThread }
  | { type: "ADD_MESSAGE_TO_THREAD"; payload: { threadId: string; message: MessageThread["messages"][number] } }
  | { type: "SET_THEME"; payload: "light" | "dark" };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "UPDATE_USER": {
      if (!state.user) return state;
      return { ...state, user: { ...state.user, ...action.payload } as User };
    }
    case "ADD_TO_CART": {
      const exists = state.cart.find((c) => c.id === action.payload.id);
      const cart = exists
        ? state.cart.map((c) => (c.id === action.payload.id ? action.payload : c))
        : [...state.cart, action.payload];
      return { ...state, cart };
    }
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((c) => c.id !== action.payload) };
    case "UPDATE_CART_QTY":
      return {
        ...state,
        cart: state.cart.map((c) => (c.id === action.payload.id ? { ...c, quantity: action.payload.quantity } : c)),
      };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "TOGGLE_WISHLIST": {
      const exists = state.wishlist.includes(action.payload);
      const wishlist = exists
        ? state.wishlist.filter((id) => id !== action.payload)
        : [...state.wishlist, action.payload];
      return { ...state, wishlist };
    }
    case "PLACE_ORDER":
      return { ...state, orders: [action.payload, ...state.orders], cart: [] };
    case "ADD_REVIEW":
      return { ...state, reviews: [action.payload, ...state.reviews] };
    case "ADD_TICKET":
      return { ...state, tickets: [action.payload, ...state.tickets] };
    case "UPDATE_TICKET_STATUS":
      return {
        ...state,
        tickets: state.tickets.map((t) => (t.id === action.payload.id ? { ...t, status: action.payload.status } : t)),
      };
    case "ADD_MESSAGE_THREAD":
      return { ...state, messageThreads: [action.payload, ...state.messageThreads] };
    case "ADD_MESSAGE_TO_THREAD":
      return {
        ...state,
        messageThreads: state.messageThreads.map((t) =>
          t.id === action.payload.threadId ? { ...t, messages: [...t.messages, action.payload.message], updatedAt: action.payload.message.createdAt } : t
        ),
      };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const persisted = readJson<AppState | null>(STORAGE_KEY, null);
    
    const savedTheme = readString(THEME_KEY, "") as "light" | "dark";
    const theme = savedTheme || "light";
    
    if (isBrowser) {
      const root = document.documentElement;
      root.classList.toggle("dark", theme === "dark");
    }

    if (persisted) {
      return { 
        ...init, 
        ...persisted, 
        products: init.products, 
        vouchers: init.vouchers,
        theme 
      } as AppState;
    }

    return { ...init, theme };
  });

  // persist state
  useEffect(() => {
    writeJson(STORAGE_KEY, state);
  }, [state]);

  // Apply theme when it changes
  useEffect(() => {
    if (!isBrowser) return;
    
    const root = document.documentElement;
    root.setAttribute('data-theme', state.theme);
    writeString(THEME_KEY, state.theme);
  }, [state.theme]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}