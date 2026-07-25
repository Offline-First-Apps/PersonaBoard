import { DownloadButton } from "./DownloadButton";

function ShotIcon({ children }: { children: React.ReactNode }) {
  return <div className="lp-shot-icon">{children}</div>;
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/* Screenshot placeholder — warm paper frame until real captures ship. */
function Shot({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="lp-feature-shot lp-shot" role="img" aria-label={label}>
      <ShotIcon>{icon}</ShotIcon>
      <span className="lp-shot-label">{label}</span>
    </div>
  );
}

const FEATURES = [
  {
    title: "Summon it from anywhere",
    body: "One hotkey and the board settles onto your screen — centered, calm, already focused on search. Press it again and it's gone. It feels less like opening an app and more like remembering something.",
    kbd: "Ctrl + Shift + V",
    shot: "screenshot — the board floating over a desktop",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 9h2M11 9h2M15 9h2M7 13h10" />
      </svg>
    ),
  },
  {
    title: "Find it in two seconds",
    body: "Type a word you remember — “track”, “address”, that function name — and the list narrows as you type. Arrow keys to choose, Enter to paste, Escape to walk away. Your hands never leave the keyboard.",
    kbd: "↑ ↓ · Enter · Esc",
    shot: "screenshot — searching “track” with one result highlighted",
    flip: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
    ),
  },
  {
    title: "Keep the important ones close",
    body: "Pin the things you reach for every day — the tracking number, the meeting link, the snippet. Pinned items sit above the timeline under “Kept close”, and they survive every history clear.",
    kbd: "Pinned survives “Clear history”",
    shot: "screenshot — the Kept close section with a gold pin",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <path d="M12 17v5" />
        <path d="M9 3h6l-1 6 3 3v2H7v-2l3-3-1-6z" />
      </svg>
    ),
  },
  {
    title: "Private by design",
    body: "No account. No sync. No analytics phoning home. Your clipboard lives in a local database on your machine, and clearing it actually clears it. The app is quiet because there's nothing to report.",
    kbd: "0 bytes leave this machine",
    shot: "screenshot — settings panel, retention and clear controls",
    flip: true,
    privacy: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <rect x="4" y="10" width="16" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    ),
  },
] as const;

export function Features() {
  return (
    <section className="lp-section lp-container" id="features">
      <div className="lp-center">
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
      </div>

      {FEATURES.map((f) => (
        <div
          key={f.title}
          className={`lp-feature${"flip" in f && f.flip ? " lp-feature-flip" : ""}`}
          id={"privacy" in f && f.privacy ? "privacy" : undefined}
        >
          <div className="lp-feature-copy">
            <h3>{f.title}</h3>
            <p>{f.body}</p>
            <span className="lp-feature-kbd">{f.kbd}</span>
          </div>
          <Shot label={f.shot} icon={f.icon} />
        </div>
      ))}
    </section>
  );
}

export function CtaBand() {
  return (
    <div className="lp-container" id="download">
      <div className="lp-cta-band">
        <h2>Stop re-copying the same things.</h2>
        <p>
          Download PersonaBoard, copy like you normally do, and the next time you think
          &ldquo;I just had that&rdquo; — you&apos;ll still have it.
        </p>
        <DownloadButton className="lp-btn lp-btn-primary">Download for free</DownloadButton>
      </div>
    </div>
  );
}
