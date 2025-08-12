"use client";

import { useApp } from "@/context/AppContext";
import { User } from "@/lib/type";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    if (mode === "signup") {
      const user: User = {
        id: crypto.randomUUID(),
        email,
        passwordHash: password ? `hash:${password}` : undefined,
        firstName: firstName || undefined,
        addresses: [],
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: "LOGIN", payload: user });
      router.push("/profile");
    } else {
      const user: User = {
        id: crypto.randomUUID(),
        email,
        passwordHash: password ? `hash:${password}` : undefined,
        addresses: [],
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: "LOGIN", payload: user });
      router.push("/");
    }
  }

  if (state.user) {
    router.replace("/profile");
    return null;
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-xl font-semibold">{mode === "login" ? "Sign in" : "Create account"}</h1>
      <form onSubmit={onSubmit} className="mt-4 grid gap-3 rounded-md border p-4">
        {mode === "signup" && (
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className="rounded-md border px-3 py-2 text-sm" />
        )}
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded-md border px-3 py-2 text-sm" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="rounded-md border px-3 py-2 text-sm" />
        <button className="rounded-md border px-3 py-2 text-sm">{mode === "login" ? "Sign in" : "Create account"}</button>
        <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-xs underline">
          {mode === "login" ? "New here? Create an account" : "Have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}