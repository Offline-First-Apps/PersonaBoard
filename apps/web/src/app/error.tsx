"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="lp">
      <main className="lp-status">
        <span className="lp-wordmark-badge lp-status-badge" aria-hidden="true">
          P
        </span>
        <p className="lp-status-code lp-mono">Error</p>
        <h1 className="lp-status-title">Something slipped off the clipboard.</h1>
        <p className="lp-status-body">
          An unexpected error interrupted the page. Your downloads and your clipboard are
          unaffected — try again, and it should settle.
        </p>
        <div className="lp-hero-ctas">
          <button type="button" className="lp-btn lp-btn-primary" onClick={reset}>
            Try again
          </button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="lp-btn lp-btn-secondary">
            Back to the board
          </a>
        </div>
      </main>
    </div>
  );
}
