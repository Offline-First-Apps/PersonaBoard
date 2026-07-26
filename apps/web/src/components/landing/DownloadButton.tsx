"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DownloadDialog } from "./DownloadDialog";

/* Every "Download for free" CTA on the page renders through this — one
   dialog, one capture flow. */

function WindowsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
    </svg>
  );
}

export function DownloadButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        type="button"
        className={className}
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.15 }}
      >
        <WindowsIcon />
        {children}
      </motion.button>
      <DownloadDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
