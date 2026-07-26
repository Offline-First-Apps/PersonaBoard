"use client";

import { motion } from "framer-motion";
import { DownloadButton } from "./DownloadButton";
import { Reveal } from "./Reveal";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export function Hero() {
  return (
    <section className="lp-hero lp-container" id="top">
      <div aria-hidden="true" className="lp-hero-glow" />
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <span className="lp-hero-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3.5l2.5 5.4 5.8.6-4.4 4 1.2 5.8L12 16.3l-5.1 3 1.2-5.8-4.4-4 5.8-.6L12 3.5z" />
            </svg>
            Now with image clipboard support
          </span>
        </motion.div>

        <motion.h1 variants={item}>
          Everything you copy, <em>kept close.</em>
        </motion.h1>

        <motion.p className="lp-hero-sub" variants={item}>
          PersonaBoard is a quiet clipboard history for your desktop. Press one hotkey, find the
          thing you copied this morning, paste it, and get back to work. No cloud, no accounts —
          it all stays on your machine.
        </motion.p>

        <motion.div className="lp-hero-ctas" variants={item}>
          <DownloadButton className="lp-btn lp-btn-primary">Download for free</DownloadButton>
          <a href="#how-it-works" className="lp-btn lp-btn-secondary">
            See how it works
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </a>
        </motion.div>

        <motion.p className="lp-hero-note" variants={item}>
          Windows · Free while in early access · One hotkey: ⌃⇧V
        </motion.p>
      </motion.div>
    </section>
  );
}

export function VideoPlaceholder() {
  return (
    <Reveal className="lp-video lp-container" delay={0.1}>
      <div className="lp-video-frame" role="img" aria-label="A short video tour of PersonaBoard" id="how-it-works">
        <motion.button
          className="lp-video-play"
          aria-label="Play the tour (coming soon)"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.15 }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5-11-6.5z" />
          </svg>
        </motion.button>
        <span className="lp-video-caption">A 60-second tour of the board — video coming soon</span>
      </div>
    </Reveal>
  );
}
