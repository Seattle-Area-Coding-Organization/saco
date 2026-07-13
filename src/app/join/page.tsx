import type { Metadata } from "next";
import Navbar from "@/components/navbar";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScCsQac2yaXawoFPRp8BFLs1nxJsvo1h_dX84hHB-YCC9LmFw/viewform";

export const metadata: Metadata = {
  title: "Join Us | SACO",
  description:
    "Apply to join the student team behind the Seattle Area Coding Organization.",
};

export default function JoinPage() {
  return (
    <>
      <Navbar activePath="/join" />

      <main className="pt-page">
        <section className="relative overflow-hidden border-b border-outline-variant/30 bg-surface-container-low">
          <div className="backdrop-grid pointer-events-none absolute inset-0 opacity-50" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-8 sm:py-20 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:gap-16 md:py-24">
            <div className="md:sticky md:top-28 md:self-start">
              <span className="font-label text-[12px] uppercase tracking-[0.4em] text-secondary">
                SACO Team
              </span>
              <h1 className="mt-4 max-w-lg font-headline text-4xl font-extrabold uppercase leading-[0.95] tracking-tighter text-on-surface text-glow sm:text-5xl md:text-6xl">
                Join the Team
              </h1>
              <div className="mt-6 h-1 w-24 bg-primary" />
              <p className="mt-7 max-w-md font-body text-base font-light leading-relaxed text-slate-300 sm:text-lg">
                Help organize contests, build resources, and grow competitive
                programming across the Pacific Northwest.
              </p>

              <div className="mt-10 border-l-2 border-secondary bg-secondary/5 px-5 py-4">
                <p className="font-label text-[11px] uppercase tracking-[0.18em] text-secondary">
                  Form not loading?
                </p>
                <a
                  href={FORM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex min-h-11 items-center font-headline text-sm font-bold uppercase tracking-wider text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  Open in Google Forms
                </a>
              </div>
            </div>

            <div className="min-w-0 border border-outline-variant bg-surface shadow-[0_0_40px_rgba(0,240,255,0.06)]">
              <div className="flex min-h-12 items-center justify-between border-b border-outline-variant bg-surface-container px-4 sm:px-6">
                <span className="font-label text-[10px] uppercase tracking-[0.24em] text-primary">
                  Team Application
                </span>
                <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                  Google Forms
                </span>
              </div>
              <iframe
                src={`${FORM_URL}?embedded=true`}
                title="SACO team application form"
                className="block min-h-[1100px] w-full bg-white sm:min-h-[1200px]"
                loading="lazy"
              >
                Loading registration form…
              </iframe>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
