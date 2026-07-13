"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Button, ExternalButton } from "@/components/button";

const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "SACC", href: "/sacc" },
  { label: "ABOUT US", href: "/about" },
  { label: "SPONSORS", href: "/sponsors" },
  { label: "JOIN US", href: "/join" },
] as const;

const DISCORD_URL = "https://discord.gg/s767nmxmg4";

function navLinkClass(active: boolean) {
  return active
    ? "relative inline-flex items-center justify-center pb-2 font-bold uppercase tracking-[0.2em] text-[12px] text-cyan-400 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-cyan-400"
    : "inline-flex items-center justify-center uppercase tracking-[0.2em] text-[12px] text-slate-500 transition-colors duration-300 hover:text-cyan-200";
}

export default function Navbar({ activePath }: { activePath: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const panelId = useId();
  const prevPathname = useRef<string | null>(null);

  // Close the mobile drawer when navigation finishes (pathname updates), not on link click — avoids an empty chrome gap under slow networks/throttling.
  useEffect(() => {
    if (prevPathname.current === null) {
      prevPathname.current = pathname;
      return;
    }
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;
    const id = requestAnimationFrame(() => setOpen(false));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  // Open: defer setState into rAF (satisfies eslint); mount hidden then two more rAFs before showing so the enter transition reliably runs on first open.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    let idB = 0;
    let idC = 0;
    const idA = requestAnimationFrame(() => {
      if (cancelled) return;
      setDrawerMounted(true);
      setDrawerVisible(false);
      idB = requestAnimationFrame(() => {
        idC = requestAnimationFrame(() => {
          if (!cancelled) setDrawerVisible(true);
        });
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(idA);
      cancelAnimationFrame(idB);
      cancelAnimationFrame(idC);
    };
  }, [open]);

  useEffect(() => {
    if (open) return;
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      if (!cancelled) setDrawerVisible(false);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [open]);

  useEffect(() => {
    if (!open && drawerMounted) {
      const t = window.setTimeout(() => setDrawerMounted(false), 320);
      return () => window.clearTimeout(t);
    }
  }, [open, drawerMounted]);

  useEffect(() => {
    if (!drawerMounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerMounted]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* ── Header bar ── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b-[0.5px] border-cyan-900/50 bg-[#0A0B0E]/80 pt-[env(safe-area-inset-top)] shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md backdrop-saturate-150">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:px-8">
          <div className="min-w-0 justify-self-start font-headline text-xl font-black tracking-tighter sm:text-2xl">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3"
              onClick={() => pathname === "/" && setOpen(false)}
            >
              <Image
                src="/SACO Logo.svg"
                alt="SACO Logo"
                width={32}
                height={32}
                className="h-7 w-7 shrink-0 object-contain sm:h-8 sm:w-8"
                priority
              />
              <span>SACO</span>
            </Link>
          </div>

          <nav
            className="hidden items-center justify-self-center gap-8 md:flex"
            aria-label="Main"
          >
            {NAV_LINKS.map(({ label, href }) => {
              const active = href === activePath;
              return (
                <Link
                  key={label}
                  href={href}
                  className={navLinkClass(active)}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center justify-end md:justify-self-end">
            <ExternalButton
              href={DISCORD_URL}
              target="_blank"
              rel="noreferrer"
              size="nav"
              variant="outlinePrimary"
            >
              Join Discord
            </ExternalButton>
            <Button
              type="button"
              size="icon"
              variant="navIcon"
              aria-expanded={open}
              aria-controls={panelId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => {
                setOpen((v) => !v);
              }}
            >
              <span
                aria-hidden
                className={`relative inline-block h-5 w-5 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  open ? "rotate-90 scale-[0.96]" : "rotate-0 scale-100"
                }`}
              >
                <span
                  className={`absolute left-0 h-[1.5px] w-5 rounded-full bg-current transition-[top,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    open
                      ? "top-1/2 -translate-y-1/2 rotate-45"
                      : "top-[3px] translate-y-0 rotate-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 h-[1.5px] w-5 -translate-y-1/2 rounded-full bg-current transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none ${
                    open ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] w-5 rounded-full bg-current transition-[top,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    open
                      ? "top-1/2 -translate-y-1/2 -rotate-45"
                      : "top-[15px] translate-y-0 rotate-0"
                  }`}
                />
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer (sibling, not child/portal) ── */}
      {drawerMounted && (
        <div className="fixed inset-0 z-40 md:hidden" aria-hidden={!drawerVisible}>
          {/* Start below the header so the scrim is not behind backdrop-blur (fixes glitched blur). */}
          <div
            className={`absolute inset-x-0 bottom-0 top-[max(4rem,calc(3.5rem+env(safe-area-inset-top,0px)))] bg-black/60 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
              drawerVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setOpen(false)}
            role="presentation"
          />
          <div
            id={panelId}
            className={`absolute inset-y-0 right-0 flex w-[min(100vw,20rem)] flex-col border-l border-cyan-900/50 bg-[#0A0B0E] pb-[env(safe-area-inset-bottom)] pt-[calc(3.5rem+env(safe-area-inset-top))] shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none ${
              drawerVisible ? "translate-x-0" : "translate-x-full"
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <nav
              className="flex flex-col gap-1 px-6 pt-4"
              aria-label="Mobile main"
            >
              {NAV_LINKS.map(({ label, href }) => {
                const active = href === activePath;
                return (
                  <Link
                    key={label}
                    href={href}
                    className={`touch-manipulation flex min-h-12 items-center justify-start border-b border-cyan-900/30 py-3 font-headline text-sm uppercase tracking-widest ${
                      active
                        ? "font-bold text-cyan-400"
                        : "text-slate-400 hover:text-cyan-200"
                    }`}
                    onClick={() => pathname === href && setOpen(false)}
                  >
                    {label}
                  </Link>
                );
              })}
              <ExternalButton
                href={DISCORD_URL}
                target="_blank"
                rel="noreferrer"
                size="drawer"
                variant="outlinePrimary"
              >
                Join Discord
              </ExternalButton>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
