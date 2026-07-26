import { Reveal } from "./Reveal";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const STEPS = [
  {
    n: "1",
    title: "You copy. It stays.",
    body: "Not just the last thing. Everything. Links, addresses, code, messages — the board holds them all, timestamped and searchable, until you need them back.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path d="M5 15V5a2 2 0 0 1 2-2h10" />
      </svg>
    ),
  },
  {
    n: "2",
    title: "Press Ctrl+Shift+V.",
    body: "The board appears — centered, calm, already listening. Type a word, pick an item, press Enter. It pastes and disappears. You never leave your flow.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 9h2M11 9h2M15 9h2M7 13h10" />
      </svg>
    ),
  },
  {
    n: "3",
    title: "Pin what you reach for.",
    body: "The Zoom link. The project ID. The phrase you type ten times a day. Pin it once. It lives at the top, under “Kept close,” and survives every clear.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <path d="M12 17v5" />
        <path d="M9 3h6l-1 6 3 3v2H7v-2l3-3-1-6z" />
      </svg>
    ),
  },
] as const;

export function HowItWorks() {
  return (
    <section className="lp-section lp-container" id="how-it-works">
      <Reveal className="lp-center">
        <p className="lp-section-eyebrow">How it works</p>
        <h2 className="lp-section-title">Three steps. Then it disappears.</h2>
      </Reveal>

      <div className="lp-steps">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.1} className="lp-step">
            <div className="lp-step-num lp-serif" aria-hidden="true">
              {s.n}
            </div>
            <div className="lp-step-icon">{s.icon}</div>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
