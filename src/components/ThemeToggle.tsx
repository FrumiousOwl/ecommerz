"use client";

import { useApp } from "@/context/AppContext";

export default function ThemeToggle() {
  const { state, dispatch } = useApp();
  const isDark = state.theme === "dark";
  return (
    <button
      aria-label="Toggle theme"
      className="rounded-md border px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
      onClick={() => dispatch({ type: "SET_THEME", payload: isDark ? "light" : "dark" })}
    >
      {isDark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}