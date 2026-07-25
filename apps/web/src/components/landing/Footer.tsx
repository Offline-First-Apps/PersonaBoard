import { Wordmark } from "./Navbar";
import { DownloadButton } from "./DownloadButton";
import { Reveal } from "./Reveal";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "#features", label: "Features" },
      { href: "#how-it-works", label: "How it works" },
      { href: "#download", label: "Download" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#", label: "About" },
      { href: "#", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "#", label: "Privacy" },
      { href: "#", label: "License" },
    ],
  },
] as const;

const SOCIALS = [
  {
    label: "X",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.9 2H22l-6.8 7.8L23 22h-6.3l-4.9-6.4L6.2 22H3l7.3-8.3L1 2h6.4l4.4 5.9L18.9 2zm-1.1 18h1.7L7.1 3.9H5.3L17.8 20z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.5 2 2 6.5 2 12c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.2-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.5.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 22 12c0-5.5-4.5-10-10-10z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
  },
] as const;

export function FinalCta() {
  return (
    <div className="lp-container" id="download">
      <Reveal className="lp-final-cta">
        <h2>
          Ready to stop
          <br />
          re-copying things?
        </h2>
        <p>
          Download PersonaBoard, copy like you normally do, and the next time you think
          &ldquo;I just had that&rdquo; — you&apos;ll still have it.
        </p>
        <DownloadButton className="lp-btn lp-btn-light">Download for free</DownloadButton>
      </Reveal>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <Reveal className="lp-footer-card">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand">
              <Wordmark />
              <p className="lp-footer-tag">
                A quiet clipboard history for your desktop. No cloud, no accounts — everything
                stays on your machine.
              </p>
              <div className="lp-footer-socials">
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} aria-label={s.label} className="lp-footer-social">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
            {COLUMNS.map((col) => (
              <div key={col.title} className="lp-footer-col">
                <h4>{col.title}</h4>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="lp-footer-bottom">
            <span>© 2026 PersonaBoard. All rights reserved.</span>
            <span className="lp-footer-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </span>
          </div>
        </Reveal>
        <div aria-hidden="true" className="lp-footer-watermark">
          PersonaBoard
        </div>
      </div>
    </footer>
  );
}
