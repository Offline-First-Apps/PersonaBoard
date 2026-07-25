import { DownloadButton } from "./DownloadButton";

export function Hero() {
  return (
    <section className="lp-hero lp-container" id="top">
      <span className="lp-hero-badge">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3.5l2.5 5.4 5.8.6-4.4 4 1.2 5.8L12 16.3l-5.1 3 1.2-5.8-4.4-4 5.8-.6L12 3.5z" />
        </svg>
        Now with image clipboard support
      </span>

      <h1>
        Everything you copy, <em>kept close.</em>
      </h1>

      <p className="lp-hero-sub">
        PersonaBoard is a quiet clipboard history for your desktop. Press one hotkey, find the
        thing you copied this morning, paste it, and get back to work. No cloud, no accounts —
        it all stays on your machine.
      </p>

      <div className="lp-hero-ctas">
        <DownloadButton className="lp-btn lp-btn-primary">Download for free</DownloadButton>
        <a href="#how-it-works" className="lp-btn lp-btn-secondary">
          See how it works
        </a>
      </div>

      <p className="lp-hero-note">Windows · Free while in early access · One hotkey: ⌃⇧V</p>
    </section>
  );
}

export function VideoPlaceholder() {
  return (
    <div className="lp-video lp-container" id="how-it-works">
      <div className="lp-video-frame" role="img" aria-label="A short video tour of PersonaBoard">
        <button className="lp-video-play" aria-label="Play the tour (coming soon)">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5-11-6.5z" />
          </svg>
        </button>
        <span className="lp-video-caption">A 60-second tour of the board — video coming soon</span>
      </div>
    </div>
  );
}
