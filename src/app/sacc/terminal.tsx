"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type CommentLine = { kind: "comment"; text: string };
type DataLine = { kind: "data"; label: string; value: string };
type Line = CommentLine | DataLine;

const LINES: Line[] = [
  { kind: "comment", text: "// System initializing..." },
  { kind: "data", label: "STATUS:", value: "REGISTRATION OPEN" },
  { kind: "data", label: "DATE:", value: "MAY 23, 2026" },
  { kind: "data", label: "TIME:", value: "11:30 AM - 5:00 PM"},
  { kind: "data", label: "VENUE:", value: "CODING MIND ACADEMY" },
  {
    kind: "data",
    label: "ADDRESS:",
    value: "4006 148TH AVE NE, REDMOND, WA 98052",
  },
  { kind: "data", label: "MODE:", value: "IN-PERSON" },
  { kind: "comment", text: "> Awaiting execution..." },
];

const TYPE_DELAY_MS = 30;
const BODY_MIN_HEIGHT = `${(LINES.length + 1) * 1.625}em`;

function TerminalCursor() {
  return (
    <span className="ml-px inline-block h-[1em] w-[0.55em] shrink-0 animate-pulse bg-[#00F0FF]" />
  );
}

function useTypewriter(text: string, active: boolean) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!active || doneRef.current) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        doneRef.current = true;
        setDone(true);
      }
    }, TYPE_DELAY_MS);
    return () => clearInterval(id);
  }, [text, active]);

  return { displayed, done };
}

function TerminalLine({
  line,
  lineNo,
  active,
  onDone,
}: {
  line: Line;
  lineNo: number;
  active: boolean;
  onDone: () => void;
}) {
  const raw = line.kind === "comment" ? line.text : `${line.label} ${line.value}`;
  const { displayed, done } = useTypewriter(raw, active);

  const firedRef = useRef(false);
  useEffect(() => {
    if (done && !firedRef.current) {
      firedRef.current = true;
      onDone();
    }
  }, [done, onDone]);

  const showCursor = active && !done;
  const visible = active || done;

  return (
    <div className="flex items-center gap-4 leading-relaxed">
      <span className="inline-block w-5 shrink-0 select-none text-right text-[#334155]">
        {lineNo}
      </span>
      <span className="inline-flex items-center">
        {visible && (
          line.kind === "comment" ? (
            <span className="text-[#64748B]">{displayed}</span>
          ) : (
            <>
              <span className="text-[#00FFA3]">{"> "}{displayed.slice(0, line.label.length)}</span>
              {displayed.length > line.label.length && (
                <span className="text-blue-400">{"\u00A0"}{displayed.slice(line.label.length + 1)}</span>
              )}
            </>
          )
        )}
        {showCursor && <TerminalCursor />}
      </span>
    </div>
  );
}

export default function Terminal() {
  const [visibleCount, setVisibleCount] = useState(1);

  const advance = useCallback(
    () => setVisibleCount((c) => Math.min(c + 1, LINES.length + 1)),
    [],
  );

  return (
    <div className="group relative my-6 w-full min-w-0 max-w-2xl overflow-hidden border border-[#1E293B] bg-[#0C0D11] text-left shadow-xl transition-colors sm:my-8">
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-[#00F0FF] to-transparent opacity-60" />

      <div className="flex items-center gap-3 border-b border-[#1E293B] bg-[#14161C] px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF3366]" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#00FFA3]" />
        </div>
        <span className="font-sacc-mono text-xs tracking-wider text-[#64748B]">
          sacc_terminal
        </span>
      </div>

      <div className="relative min-w-0 overflow-x-auto px-4 py-4 sm:px-5 sm:py-5">
        <div className="terminal-crt-lines pointer-events-none absolute inset-0 z-10 opacity-[0.03]" />

        <div
          className="font-sacc-mono relative z-20 min-w-0 select-none text-xs text-[#F1F5F9] sm:text-sm md:text-base"
          style={{ minHeight: BODY_MIN_HEIGHT }}
        >
          {LINES.slice(0, visibleCount).map((line, i) => (
            <TerminalLine
              key={i}
              line={line}
              lineNo={i + 1}
              active={i === visibleCount - 1}
              onDone={advance}
            />
          ))}

          {visibleCount > LINES.length && (
            <div className="flex items-center gap-4 leading-relaxed">
              <span className="inline-block w-5 shrink-0 select-none text-right text-[#334155]">
                {LINES.length + 1}
              </span>
              <TerminalCursor />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
