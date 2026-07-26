import { Reveal } from "./Reveal";

interface BentoFeature {
  title: string;
  body: string;
  shot: string;
  image: string;
  id?: string;
}

/* Row 1 — the two hero features */
const TOP: BentoFeature[] = [
  {
    title: "Never search for something you already found.",
    body: "You copy a tracking number in the morning. At 4 PM, you press the hotkey, type “track,” and it's there. No digging through emails. No retracing your browser history. You just... have it.",
    shot: "PersonaBoard search filtering clipboard items by “track”",
    image: "/images/features/search.png",
  },
  {
    title: "Never lose a thought to an accidental overwrite.",
    body: "You copy something important. Before you paste, you grab a link. The important thing is gone — at least, that's how it used to work. PersonaBoard keeps it. It's the second item. Look.",
    shot: "PersonaBoard timeline showing clipboard history with rescued item second",
    image: "/images/features/never-lose.png",
  },
];

/* Row 2 — the quieter strengths */
const BOTTOM: BentoFeature[] = [
  {
    title: "Never re-type what you use every day.",
    body: "Some things you paste over and over. Don't. Pin them once, and they're always waiting — above the timeline, easy to reach, impossible to lose.",
    shot: "PersonaBoard Kept close pinned items section",
    image: "/images/features/kept-close.png",
  },
  {
    title: "Images, not just text.",
    body: "Screenshots, copied images, diagrams — they land on the board with real thumbnails. Because not everything worth keeping is words.",
    shot: "PersonaBoard image thumbnails on the board",
    image: "/images/features/images.png",
  },
  {
    title: "Private by design.",
    body: "No account required. No cloud sync. No analytics. No telemetry. Your clipboard lives in a local database on your machine, and clearing it means it's actually cleared. It's your board. Not ours.",
    shot: "PersonaBoard settings showing retention and privacy controls",
    id: "privacy",
    image: "/images/features/everything.png",
  },
];

function BentoCard({ feature, tall, delay }: { feature: BentoFeature; tall?: boolean; delay: number }) {
  return (
    <Reveal delay={delay} className="lp-bento-item">
      <article className="lp-bento-card" id={feature.id}>
        <div className={`lp-bento-shot${tall ? " lp-bento-shot-tall" : ""}`}>
          <img src={feature.image} alt={feature.shot} className="lp-bento-img" loading="lazy" />
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
