"use client";

import { useCallback } from "react";

export interface WatchProgress {
  slug: string;
  serverIdx: number;
  epIdx: number;
  epName: string;
  serverName: string;
  savedAt: number; // timestamp
}

const STORAGE_KEY = "watch_progress";
const MAX_ENTRIES = 50;
// Expire history after 30 days
const EXPIRE_MS = 30 * 24 * 60 * 60 * 1000;

function readAll(): Record<string, WatchProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, WatchProgress>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full — ignore
  }
}

export function useWatchHistory() {
  const getProgress = useCallback((slug: string): WatchProgress | null => {
    const all = readAll();
    const entry = all[slug];
    if (!entry) return null;
    // Expire old entries
    if (Date.now() - entry.savedAt > EXPIRE_MS) {
      delete all[slug];
      writeAll(all);
      return null;
    }
    return entry;
  }, []);

  const saveProgress = useCallback(
    (progress: Omit<WatchProgress, "savedAt">) => {
      const all = readAll();

      // Prune oldest if over limit
      const entries = Object.values(all);
      if (entries.length >= MAX_ENTRIES) {
        const oldest = entries.sort((a, b) => a.savedAt - b.savedAt)[0];
        delete all[oldest.slug];
      }

      all[progress.slug] = { ...progress, savedAt: Date.now() };
      writeAll(all);
    },
    []
  );

  const clearProgress = useCallback((slug: string) => {
    const all = readAll();
    delete all[slug];
    writeAll(all);
  }, []);

  return { getProgress, saveProgress, clearProgress };
}
