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
          Your clipboard, <em>remembered.</em>
        </motion.h1>

        <motion.p className="lp-hero-sub" variants={item}>
          PersonaBoard quietly keeps everything you copy, so nothing slips away. One hotkey,
          and it&apos;s all right there. No cloud. No accounts. Just a private board for your
          thoughts.
        </motion.p>

        <motion.div className="lp-hero-ctas" variants={item}>
          <DownloadButton className="lp-btn lp-btn-primary">
            Download free for Windows
          </DownloadButton>
        </motion.div>

        <motion.p className="lp-hero-note" variants={item}>
          Free for Windows · One hotkey: ⌃⇧V
        </motion.p>
      </motion.div>
    </section>
  );
}

export function VideoPlaceholder() {
  return (
    <Reveal className="lp-video lp-container" delay={0.1}>
      <div className="lp-video-frame">
        <video
          src="/videos/demo.mp4"
          className="lp-video-el"
          autoPlay
          muted
          loop
          playsInline
          controls
          aria-label="A short video tour of PersonaBoard"
        />
      </div>
    </Reveal>
  );
}
