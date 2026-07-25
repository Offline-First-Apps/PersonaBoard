"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DownloadButton } from "./DownloadButton";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#privacy", label: "Privacy" },
] as const;

export function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <a href="#top" className={`lp-wordmark${dark ? " lp-wordmark-dark" : ""}`}>
      <span className="lp-wordmark-badge" aria-hidden="true">
        P
      </span>
      PersonaBoard
    </a>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="lp-nav"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="lp-container">
        <nav className="lp-nav-pill" aria-label="Main">
          <a href="#top" className="lp-nav-logo" aria-label="PersonaBoard home">
            P
          </a>

          <ul className="lp-nav-links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>

          <div className="lp-nav-actions">
            <DownloadButton className="lp-btn lp-btn-light lp-btn-sm">
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
        </nav>

        {open && (
          <motion.div
            className="lp-nav-mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <DownloadButton className="lp-btn lp-btn-primary">Download free</DownloadButton>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
