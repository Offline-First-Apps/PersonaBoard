"use client";

import { useState } from "react";
import { DownloadButton } from "./DownloadButton";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#privacy", label: "Privacy" },
] as const;

export function Wordmark() {
  return (
    <a href="#top" className="lp-wordmark">
      <span className="lp-wordmark-dot" aria-hidden="true" />
      PersonaBoard
    </a>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="lp-nav">
      <div className="lp-container lp-nav-inner">
        <Wordmark />
        <ul className="lp-nav-links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="lp-nav-actions">
          <DownloadButton className="lp-btn lp-btn-primary lp-btn-sm">
            Download free
          </DownloadButton>
          <button
            className="lp-nav-burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {open ? (
                <>
                  <path d="M5 5l14 14" />
                  <path d="M19 5L5 19" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
      <div className={`lp-nav-mobile${open ? " lp-nav-mobile-open" : ""}`}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <DownloadButton className="lp-btn lp-btn-primary">Download free</DownloadButton>
      </div>
    </nav>
  );
}
