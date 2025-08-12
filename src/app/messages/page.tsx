"use client";

import { useApp } from "@/context/AppContext";
import { MessageThread } from "@/lib/type";
import { useState } from "react";

export default function MessagesPage() {
  const { state, dispatch } = useApp();
  const [subject, setSubject] = useState("");
  const [productId, setProductId] = useState<string>("");
  const [body, setBody] = useState("");

  function createThread() {
    if (!subject || !body) {
      alert("Enter subject and message");
      return;
    }
    const thread: MessageThread = {
      id: crypto.randomUUID(),
      productId: productId || undefined,
      userId: state.user?.id,
      subject,
      messages: [
        {
          id: crypto.randomUUID(),
          threadId: "temp",
          fromUserId: state.user?.id,
          fromName: state.user?.firstName || "Guest",
          body,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    thread.messages[0].threadId = thread.id;
    dispatch({ type: "ADD_MESSAGE_THREAD", payload: thread });
    setSubject("");
    setBody("");
    setProductId("");
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Messages</h1>
      <div className="rounded-md border p-4">
        <div className="font-medium">New inquiry</div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="rounded-md border px-3 py-2 text-sm" />
          <select value={productId} onChange={(e) => setProductId(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
            <option value="">General</option>
            {state.products.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Your message" className="h-24 rounded-md border px-3 py-2 text-sm sm:col-span-2" />
          <button onClick={createThread} className="rounded-md border px-3 py-2 text-sm sm:col-span-2">Send</button>
        </div>
      </div>

      <div className="grid gap-3">
        {state.messageThreads.length === 0 && <div className="rounded-md border p-6 text-sm">No messages.</div>}
        {state.messageThreads.map((t) => (
          <div key={t.id} className="rounded-md border p-3">
            <div className="text-sm font-medium">{t.subject} {t.productId && <span className="text-black/60 dark:text-white/60">· regarding {state.products.find((p) => p.id === t.productId)?.title}</span>}</div>
            <div className="mt-2 grid gap-2">
              {t.messages.map((m) => (
                <div key={m.id} className="rounded-md border p-2 text-sm">
                  <div className="text-xs text-black/60 dark:text-white/60">{m.fromName}</div>
                  <div>{m.body}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}