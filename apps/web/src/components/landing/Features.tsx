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
    title: "Summon it from anywhere",
    body: "One hotkey and the board settles onto your screen — centered, calm, already focused on search. Press it again and it's gone. Less like opening an app, more like remembering something.",
    shot: "screenshot — the board floating over a desktop",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 9h2M11 9h2M15 9h2M7 13h10" />
      </svg>
    ),
  },
  {
    title: "Find it in two seconds",
    body: "Type a word you remember — “track”, “address”, that function name — and the list narrows as you type. Arrows to choose, Enter to paste, Escape to walk away.",
    shot: "screenshot — searching “track”, one result highlighted",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
    ),
  },
];

/* Row 2 — the quieter strengths */
const BOTTOM: BentoFeature[] = [
  {
    title: "Keep the important ones close",
    body: "Pin what you reach for daily. Pinned items sit under “Kept close” and survive every history clear.",
    shot: "screenshot — the Kept close section",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <path d="M12 17v5" />
        <path d="M9 3h6l-1 6 3 3v2H7v-2l3-3-1-6z" />
      </svg>
    ),
  },
  {
    title: "Images remembered too",
    body: "Screenshots and copied images land on the board with real thumbnails — not just text gets a second chance.",
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
    title: "Private by design",
    body: "No account, no sync, no analytics. Your clipboard lives in a local database, and clearing it actually clears it.",
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
        <p className="lp-section-eyebrow">What it does</p>
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
