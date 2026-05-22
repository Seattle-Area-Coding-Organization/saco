"use client";

import { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import Terminal from "./terminal";
import { Button, ExternalButton } from "@/components/button";
import Navbar from "@/components/navbar";

const DISCORD_URL = "https://discord.gg/s767nmxmg4";

const SACC_STATS = [
  { label: "Prize Pool", value: "$500" },
  { label: "Duration", value: "3 HR" },
  { label: "Team Size", value: "3" },
  { label: "Problems", value: "8" },
] as const;

const SACC_SCHEDULE = [
  { time: "11:30am - 12:00pm", event: "Arrival and check-in" },
  { time: "12:00pm - 12:30pm", event: "Opening ceremony" },
  { time: "12:30pm - 1:00pm", event: "Lunch (provided)" },
  { time: "1:00pm - 1:30pm", event: "Practice contest"},
  { time: "1:30pm - 4:30pm", event: "Contest time" },
  { time: "4:30pm - 5:00pm", event: "Awards ceremony" },
] as const;

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="group flex flex-col items-center justify-center border border-[#1E293B] bg-[#14161C] p-6 text-center transition-colors hover:border-[#00F0FF]/50 sm:p-8">
      <div className="mb-2 font-sacc-mono text-xs uppercase tracking-widest text-[#64748B] sm:text-sm">
        {label}
      </div>
      <div className="font-sacc-mono text-3xl font-bold text-[#00F0FF] transition-colors [text-shadow:0_0_10px_rgba(0,240,255,0.5)] group-hover:text-[#00FFA3] sm:text-4xl md:text-[48px]">
        {value}
      </div>
    </div>
  );
}

const FAQ_ITEMS = [
  {
    q: "What are the prizes?",
    a: "First place gets $40, second place gets $20, and third place gets $10.",
  },
  {
    q: "Who can participate?",
    a: "Any pre-college student may participate. You don't need prior competitive programming experience — beginners are welcome.",
  },
  {
    q: "How are teams formed?",
    a: "Teams of three. You can register with a pre-formed team or sign up individually and we'll match you with others.",
  },
  {
    q: "What languages are allowed?",
    a: "C++, Java, and Python. Solutions are graded by an automated judge — partial credit is not awarded.",
  },
  {
    q: "Can I use AI tools during the contest?",
    a: "No. Use of AI coding assistants, large language models, and other external code-generation tools is not allowed during the competition.",
  },
  {
    q: "Is the contest in-person or online?",
    a: "SACC 2026 is fully in-person at Coding Mind Academy, 4006 148th Ave NE, Redmond, WA 98052.",
  },
  {
    q: "Will food be provided?",
    a: "Yes. We'll provide a free pizza lunch for all contestants during the competition.",
  },
  {
    q: "What should I bring?",
    a: "A laptop and a charger. Internet access is provided.",
  },
] as const;

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#1E293B]">
      <Button
        type="button"
        onClick={() => setOpen((v) => !v)}
        size="faq"
        variant="ghostSacc"
      >
        <span className="font-sacc-mono text-sm font-bold uppercase tracking-wider text-[#F1F5F9]">
          {q}
        </span>
        <ChevronDown
          className="shrink-0 text-[#00F0FF] transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : undefined }}
        />
      </Button>
      <div
        className="grid transition-[grid-template-rows] duration-200"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-relaxed text-[#64748B]">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SaccPage() {
  return (
    <>
      <Navbar activePath="/sacc" />

      <main className="flex flex-grow flex-col items-center pt-page">
        <section className="relative flex min-h-[min(100dvh,48rem)] w-full max-w-[1200px] flex-col items-center justify-center px-4 py-16 text-center sm:px-8 sm:py-24 md:min-h-[819px]">
          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden opacity-20">
            <div className="h-[800px] w-[800px] rounded-full bg-[#00F0FF]/20 blur-[120px]" />
          </div>

          <div className="z-10 flex w-full flex-col items-center gap-8">
            <div className="space-y-4">
              <h1 className="font-sacc-mono bg-gradient-to-r from-[#00F0FF] to-teal-400 bg-clip-text text-4xl font-bold leading-none text-transparent [text-shadow:0_0_10px_rgba(0,240,255,0.5)] sm:text-6xl md:text-7xl lg:text-[96px]">
                SACC_2026
              </h1>
              <p className="mx-auto max-w-2xl text-base text-[#64748B] sm:text-lg md:text-2xl">
                Compete in teams of three against top pre-college programmers
                in the Pacific Northwest. Solve real algorithmic challenges,
                win $500, and prove your skills.
              </p>
            </div>

            <Terminal />

            <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
              <ExternalButton
                href="https://docs.google.com/forms/d/e/1FAIpQLScdr-aDxrZaHumGMvKSUixdmFY9L9Hor2aEvaHHa-31qWTYFw/viewform?usp=publish-editor"
                target="_blank"
                rel="noreferrer"
                size="saccHero"
                variant="saccPrimary"
              >
                Register Now
              </ExternalButton>
              <ExternalButton
                href={DISCORD_URL}
                target="_blank"
                rel="noreferrer"
                size="saccHero"
                variant="saccOutline"
              >
                Join Discord
              </ExternalButton>
            </div>
          </div>
        </section>

        <section className="z-10 w-full max-w-[1200px] px-4 pb-16 sm:px-8 sm:pb-24">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SACC_STATS.map((stat) => (
              <StatCard key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>

          <div className="mt-6 flex h-32 items-center border border-[#00F0FF]/35 bg-[#0D0F14]/90 p-4 text-left shadow-[0_0_24px_rgba(0,240,255,0.08)] sm:h-36 sm:p-6">
            <div className="flex gap-4 sm:items-center">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center border border-[#00FFA3]/45 bg-[#00FFA3]/10 shadow-[inset_0_0_18px_rgba(0,255,163,0.08),0_0_22px_rgba(0,255,163,0.16)] sm:h-16 sm:w-16">
                <div className="absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-[#00F0FF]" />
                <div className="absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-[#00F0FF]" />
                <div className="absolute inset-2 border border-[#00F0FF]/15" />
                <MapPin
                  className="relative z-10 h-8 w-8 text-[#00FFA3] drop-shadow-[0_0_10px_rgba(0,255,163,0.75)] sm:h-9 sm:w-9"
                  strokeWidth={2.25}
                />
              </div>
              <div>
                <div className="mb-1 font-[family-name:var(--font-sacc-mono)] text-[10px] uppercase tracking-[0.35em] text-[#00FFA3]">
                  Location
                </div>
                <p className="font-[family-name:var(--font-sacc-mono)] text-sm font-bold uppercase tracking-wide text-[#F1F5F9] sm:text-base">
                  Coding Mind Academy
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[#94A3B8] sm:text-base">
                  4006 148th Ave NE, Redmond, WA 98052
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full max-w-[1200px] px-4 pb-20 sm:px-8 sm:pb-32">
          <div className="mb-10 flex flex-col items-start">
            <span className="mb-3 font-sacc-mono text-[10px] uppercase tracking-[0.4em] text-[#00FFA3]">
              Timeline
            </span>
            <h2 className="font-sacc-mono text-3xl font-bold uppercase tracking-tight text-[#F1F5F9]">
              Event Schedule
            </h2>
            <div className="mt-4 h-1 w-16 bg-[#00F0FF]" />
          </div>

          <div className="relative overflow-hidden border border-[#00F0FF]/40 bg-[#0D0F14] shadow-[0_0_30px_rgba(0,240,255,0.08)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_30%,rgba(0,255,163,0.12),transparent_30%),radial-gradient(circle_at_82%_55%,rgba(0,240,255,0.12),transparent_34%)]" />
            <div className="relative overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <caption className="sr-only">
                  SACC 2026 event schedule
                </caption>
                <thead>
                  <tr className="border-b border-[#00F0FF]/40 bg-[#00F0FF]/10">
                    <th
                      scope="col"
                      className="w-5/12 border-r border-[#00F0FF]/40 px-6 py-5 text-center font-sacc-mono text-sm font-bold uppercase tracking-[0.25em] text-[#F1F5F9] sm:px-8 sm:py-7"
                    >
                      Time
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-5 text-center font-sacc-mono text-sm font-bold uppercase tracking-[0.25em] text-[#F1F5F9] sm:px-8 sm:py-7"
                    >
                      Event
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SACC_SCHEDULE.map((item) => (
                    <tr
                      key={item.time}
                      className="border-b border-[#00F0FF]/30 last:border-b-0"
                    >
                      <th
                        scope="row"
                        className="border-r border-[#00F0FF]/30 px-6 py-6 text-center font-sacc-display text-lg font-medium text-[#F1F5F9] sm:px-8 sm:py-8 sm:text-2xl"
                      >
                        {item.time}
                      </th>
                      <td className="px-6 py-6 text-center font-sacc-display text-lg leading-relaxed text-[#F1F5F9] sm:px-8 sm:py-8 sm:text-2xl">
                        {item.event}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="w-full max-w-[1200px] px-4 pb-20 sm:px-8 sm:pb-32">
          <div className="mb-10 flex flex-col items-start">
            <span className="mb-3 font-sacc-mono text-[10px] uppercase tracking-[0.4em] text-[#00FFA3]">
              Intel
            </span>
            <h2 className="font-[family-name:var(--font-sacc-mono)] text-3xl font-bold uppercase tracking-tight text-[#F1F5F9]">
              Frequently Asked Questions
            </h2>
            <div className="mt-4 h-1 w-16 bg-[#00F0FF]" />
          </div>
          <div className="border-t border-[#1E293B]">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
