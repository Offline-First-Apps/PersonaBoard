"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DownloadDialog } from "./DownloadDialog";

/* Every "Download for free" CTA on the page renders through this — one
   dialog, one capture flow. */
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
        {children}
      </motion.button>
      <DownloadDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
}
