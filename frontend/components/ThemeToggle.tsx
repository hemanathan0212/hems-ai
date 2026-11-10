"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    const currentTheme =
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
        ? "dark"
        : "light";

    setTheme(currentTheme);

    document.documentElement.classList.toggle("dark", currentTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    setTheme(newTheme);

    document.documentElement.classList.toggle("dark", newTheme === "dark");

    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
    >
      {theme === "dark" ? (
        <>
          <span>☀️</span>
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <span>🌙</span>
          <span>Dark Mode</span>
        </>
      )}
    </button>
  );
}
