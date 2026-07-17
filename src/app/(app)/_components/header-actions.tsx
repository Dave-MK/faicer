"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AppIcon, type IconName } from "@/components/AppIcons";

type NavItem = { key: string; label: string; href: string; icon: IconName };

type NotificationItem = {
  id: string;
  title: string;
  detail: string;
  createdAt: string;
};

const buttonClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-xl border text-[rgba(175,189,209,0.72)] transition hover:text-white";
const buttonStyle = {
  borderColor: "rgba(52,72,98,0.78)",
  background: "rgba(10,20,34,0.86)",
} as const;

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function HeaderActions({ navigation }: { navigation: readonly NavItem[] }) {
  const router = useRouter();

  // ── Search command palette ──
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = navigation.filter((item) =>
    item.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const go = useCallback(
    (href: string) => {
      closeSearch();
      router.push(href);
    },
    [closeSearch, router],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setActiveIndex(0);
        setSearchOpen((open) => !open);
      } else if (e.key === "Escape") {
        setSearchOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
  }, [searchOpen]);

  // ── Notifications ──
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/notifications")
      .then((res) => (res.ok ? res.json() : { notifications: [] }))
      .then((data: { notifications?: NotificationItem[] }) => {
        if (!cancelled) {
          setNotifications(data.notifications ?? []);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const count = notifications.length;

  return (
    <>
      {/* Search trigger */}
      <button
        type="button"
        aria-label="Search"
        onClick={() => {
          setActiveIndex(0);
          setSearchOpen(true);
        }}
        className={buttonClass}
        style={buttonStyle}
      >
        <AppIcon name="search" className="h-[15px] w-[15px]" />
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          type="button"
          aria-label="Notifications"
          aria-expanded={notifOpen}
          onClick={() => setNotifOpen((open) => !open)}
          className={`relative ${buttonClass}`}
          style={buttonStyle}
        >
          <AppIcon name="bell" className="h-[15px] w-[15px]" />
          {loaded && count > 0 && (
            <span
              className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
              style={{
                background: "#6366F1",
                boxShadow: "0 0 8px rgba(99,102,241,0.6)",
              }}
            >
              {count > 9 ? "9+" : count}
            </span>
          )}
        </button>

        {notifOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              aria-hidden="true"
              onClick={() => setNotifOpen(false)}
            />
            <div
              role="menu"
              className="absolute right-0 z-50 mt-2 w-[320px] overflow-hidden rounded-[14px] border shadow-2xl"
              style={{
                borderColor: "rgba(40,49,67,0.8)",
                background: "linear-gradient(180deg, #12182A 0%, #0E1320 100%)",
              }}
            >
              <div
                className="border-b px-4 py-3 text-[13px] font-semibold text-white"
                style={{ borderColor: "rgba(40,49,67,0.6)" }}
              >
                Notifications
              </div>
              <div className="max-h-[360px] overflow-y-auto">
                {!loaded ? (
                  <p className="px-4 py-6 text-center text-[12px] text-[rgba(168,176,204,0.5)]">
                    Loading…
                  </p>
                ) : count === 0 ? (
                  <p className="px-4 py-6 text-center text-[12px] text-[rgba(168,176,204,0.5)]">
                    You&apos;re all caught up.
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 border-b px-4 py-3 last:border-b-0"
                      style={{ borderColor: "rgba(40,49,67,0.4)" }}
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: "#6366F1" }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[12.5px] font-medium text-white">{n.title}</p>
                        <p className="truncate text-[11.5px] text-[rgba(168,176,204,0.6)]">
                          {n.detail}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10.5px] text-[rgba(168,176,204,0.4)]">
                        {relativeTime(n.createdAt)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Search command palette */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
          onClick={closeSearch}
        >
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-label="Search navigation"
            className="relative w-full max-w-[520px] overflow-hidden rounded-[16px] border shadow-2xl"
            style={{
              borderColor: "rgba(40,49,67,0.8)",
              background: "linear-gradient(180deg, #12182A 0%, #0E1320 100%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center gap-3 border-b px-4 py-3.5"
              style={{ borderColor: "rgba(40,49,67,0.6)" }}
            >
              <AppIcon
                name="search"
                className="h-[16px] w-[16px] text-[rgba(168,176,204,0.5)]"
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActiveIndex((i) => Math.min(i + 1, results.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveIndex((i) => Math.max(i - 1, 0));
                  } else if (e.key === "Enter" && results[activeIndex]) {
                    e.preventDefault();
                    go(results[activeIndex].href);
                  }
                }}
                placeholder="Search pages…"
                className="flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-[rgba(168,176,204,0.4)]"
              />
              <kbd className="rounded-[6px] border border-[rgba(40,49,67,0.8)] px-1.5 py-0.5 text-[10px] text-[rgba(168,176,204,0.5)]">
                Esc
              </kbd>
            </div>
            <div className="max-h-[320px] overflow-y-auto py-2">
              {results.length === 0 ? (
                <p className="px-4 py-6 text-center text-[12px] text-[rgba(168,176,204,0.5)]">
                  No matches.
                </p>
              ) : (
                results.map((item, i) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => go(item.href)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-[13.5px] transition"
                    style={{
                      background:
                        i === activeIndex ? "rgba(99,102,241,0.14)" : "transparent",
                      color: i === activeIndex ? "#fff" : "rgba(168,176,204,0.8)",
                    }}
                  >
                    <span
                      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px]"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      <AppIcon name={item.icon} className="h-[15px] w-[15px]" />
                    </span>
                    {item.label}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
