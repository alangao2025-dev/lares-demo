import { createContext, useContext } from "react";
import type { L, Lang } from "./data/i18n";

export const LangCtx = createContext<Lang>("en");
export function useT() {
  const lang = useContext(LangCtx);
  return { lang, t: (x: L | undefined) => (x ? x[lang] : "") };
}

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M4 19 L20 5 L36 19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 17 V35 H31 V17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <rect x="14" y="20" width="12" height="2.2" rx="1" fill="currentColor" />
      <rect x="14" y="25" width="5" height="2.2" rx="1" fill="currentColor" />
      <rect x="21" y="25" width="5" height="2.2" rx="1" fill="currentColor" />
      <rect x="14" y="30" width="12" height="2.2" rx="1" fill="currentColor" />
    </svg>
  );
}

export function HexLines({ lines, size = 1 }: { lines: number[]; size?: number }) {
  return (
    <div className="hexlines" style={{ gap: 6 * size }}>
      {[5, 4, 3, 2, 1, 0].map((i) => (
        <div key={i} className={`hl ${lines[i] ? "yang" : "yin"}`} style={{ width: 84 * size, height: 9 * size, gap: 12 * size }}>
          <span /><span />
        </div>
      ))}
    </div>
  );
}
