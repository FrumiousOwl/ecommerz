"use client";

import { useApp } from "@/context/AppContext";
import { Address } from "@/lib/type";   
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const [firstName, setFirstName] = useState(state.user?.firstName || "");
  const [addresses, setAddresses] = useState<Address[]>(state.user?.addresses || []);

  useEffect(() => {
    if (!state.user) router.replace("/login");
  }, [state.user]);

  if (!state.user) return null;

  function addAddress() {
    setAddresses((prev) => [...prev, { id: crypto.randomUUID(), fullName: state.user!.firstName || "", line1: "", city: "", postalCode: "", country: "" }]);
  }

  function save() {
    dispatch({ type: "UPDATE_USER", payload: { firstName, addresses } });
    alert("Profile updated");
  }

  function logout() {
    dispatch({ type: "LOGOUT" });
    router.push("/");
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Profile</h1>
      <div className="rounded-md border p-4">
        <div className="font-medium">Account</div>
        <div className="mt-2 grid gap-2">
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className="rounded-md border px-3 py-2 text-sm" />
          <div className="text-sm text-black/60 dark:text-white/60">Email: {state.user.email}</div>
        </div>
      </div>
      <div className="rounded-md border p-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">Addresses</div>
          <button onClick={addAddress} className="rounded-md border px-3 py-1 text-xs">Add</button>
        </div>
        <div className="mt-2 grid gap-3">
          {addresses.length === 0 && <div className="text-sm text-black/60 dark:text-white/60">No addresses</div>}
          {addresses.map((a, idx) => (
            <div key={a.id} className="grid gap-2 rounded-md border p-3 sm:grid-cols-2">
              <input value={a.fullName} onChange={(e) => setAddresses((arr) => arr.map((x, i) => i === idx ? { ...x, fullName: e.target.value } : x))} placeholder="Full name" className="rounded-md border px-3 py-2 text-sm" />
              <input value={a.line1} onChange={(e) => setAddresses((arr) => arr.map((x, i) => i === idx ? { ...x, line1: e.target.value } : x))} placeholder="Address line 1" className="rounded-md border px-3 py-2 text-sm sm:col-span-2" />
              <input value={a.city} onChange={(e) => setAddresses((arr) => arr.map((x, i) => i === idx ? { ...x, city: e.target.value } : x))} placeholder="City" className="rounded-md border px-3 py-2 text-sm" />
              <input value={a.state || ""} onChange={(e) => setAddresses((arr) => arr.map((x, i) => i === idx ? { ...x, state: e.target.value } : x))} placeholder="State" className="rounded-md border px-3 py-2 text-sm" />
              <input value={a.postalCode} onChange={(e) => setAddresses((arr) => arr.map((x, i) => i === idx ? { ...x, postalCode: e.target.value } : x))} placeholder="Postal code" className="rounded-md border px-3 py-2 text-sm" />
              <input value={a.country} onChange={(e) => setAddresses((arr) => arr.map((x, i) => i === idx ? { ...x, country: e.target.value } : x))} placeholder="Country" className="rounded-md border px-3 py-2 text-sm" />
              <button onClick={() => setAddresses((arr) => arr.filter((_, i) => i !== idx))} className="rounded-md border px-3 py-1 text-xs sm:col-span-2">Remove</button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={save} className="rounded-md border px-3 py-2 text-sm">Save</button>
        <button onClick={logout} className="rounded-md border px-3 py-2 text-sm">Logout</button>
      </div>
    </div>
  );
}