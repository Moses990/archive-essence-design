import { useEffect, useState } from "react";

export function useLocalState<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch { /* ignore quota */ }
  }, [key, state]);
  return [state, setState];
}

export type RecentItem = { key: string; label: string; kind: "project" | "drawing"; at: number };

export function pushRecent(item: Omit<RecentItem, "at">) {
  try {
    const raw = window.localStorage.getItem("vault:recent");
    const arr: RecentItem[] = raw ? JSON.parse(raw) : [];
    const filtered = arr.filter(x => x.key !== item.key);
    filtered.unshift({ ...item, at: Date.now() });
    window.localStorage.setItem("vault:recent", JSON.stringify(filtered.slice(0, 8)));
  } catch { /* ignore */ }
}

export function readRecent(): RecentItem[] {
  try {
    const raw = window.localStorage.getItem("vault:recent");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
