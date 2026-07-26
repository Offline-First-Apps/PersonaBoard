import { Reveal } from "./Reveal";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

interface BentoFeature {
  title: string;
  body: string;
  shot: string;
  icon: React.ReactNode;
  id?: string;
}

/* Row 1 — the two hero features */
const TOP: BentoFeature[] = [
  {
    title: "Never search for something you already found.",
    body: "You copy a tracking number in the morning. At 4 PM, you press the hotkey, type “track,” and it's there. No digging through emails. No retracing your browser history. You just... have it.",
    shot: "screenshot — searching “track”, one result highlighted",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
    ),
  },
  {
    title: "Never lose a thought to an accidental overwrite.",
    body: "You copy something important. Before you paste, you grab a link. The important thing is gone — at least, that's how it used to work. PersonaBoard keeps it. It's the second item. Look.",
    shot: "screenshot — the timeline with the rescued item second",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v5h5" />
        <path d="M12 8v4l3 2" />
      </svg>
    ),
  },
];

/* Row 2 — the quieter strengths */
const BOTTOM: BentoFeature[] = [
  {
    title: "Never re-type what you use every day.",
    body: "Some things you paste over and over. Don't. Pin them once, and they're always waiting — above the timeline, easy to reach, impossible to lose.",
    shot: "screenshot — the Kept close section",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <path d="M12 17v5" />
        <path d="M9 3h6l-1 6 3 3v2H7v-2l3-3-1-6z" />
      </svg>
    ),
  },
  {
    title: "Images, not just text.",
    body: "Screenshots, copied images, diagrams — they land on the board with real thumbnails. Because not everything worth keeping is words.",
    shot: "screenshot — image thumbnails on the board",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="1.6" />
        <path d="M21 16l-5.5-5.5a1.5 1.5 0 0 0-2.1 0L5 19" />
      </svg>
    ),
  },
  {
    title: "Private by design.",
    body: "No account required. No cloud sync. No analytics. No telemetry. Your clipboard lives in a local database on your machine, and clearing it means it's actually cleared. It's your board. Not ours.",
    shot: "screenshot — settings, retention and clear controls",
    id: "privacy",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <rect x="4" y="10" width="16" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    ),
  },
];

function BentoCard({ feature, tall, delay }: { feature: BentoFeature; tall?: boolean; delay: number }) {
  return (
    <Reveal delay={delay} className="lp-bento-item">
      <article className="lp-bento-card" id={feature.id}>
        <div
          className={`lp-bento-shot${tall ? " lp-bento-shot-tall" : ""}`}
          role="img"
          aria-label={feature.shot}
        >
          <div className="lp-shot-icon">{feature.icon}</div>
          <span className="lp-shot-label">{feature.shot}</span>
        </div>
        <div className="lp-bento-copy">
          <h3>{feature.title}</h3>
          <p>{feature.body}</p>
        </div>
      </article>
    </Reveal>
  );
}

export function Features() {
  return (
    <section className="lp-section lp-container" id="features">
      <Reveal className="lp-center">
        <p className="lp-section-eyebrow">Why it matters</p>
        <h2 className="lp-section-title">
          A clipboard that remembers,
          <br />
          so you don&apos;t have to
        </h2>
        <p className="lp-section-sub">
          The OS clipboard holds one thing. PersonaBoard holds everything — quietly, in the
          background, until the moment you need it back.
        </p>
      </Reveal>

      <div className="lp-bento">
        <div className="lp-bento-row lp-bento-row-top">
          {TOP.map((f, i) => (
            <BentoCard key={f.title} feature={f} tall delay={i * 0.08} />
          ))}
        </div>
        <div className="lp-bento-row lp-bento-row-bottom">
          {BOTTOM.map((f, i) => (
            <BentoCard key={f.title} feature={f} delay={0.1 + i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
