"use client";

import { useState } from "react";
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
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>
      <DownloadDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
