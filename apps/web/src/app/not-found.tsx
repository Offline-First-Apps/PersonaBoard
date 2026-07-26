import Link from "next/link";

export default function NotFound() {
  return (
    <div className="lp">
      <main className="lp-status">
        <span className="lp-wordmark-badge lp-status-badge" aria-hidden="true">
          P
        </span>
        <p className="lp-status-code lp-mono">404</p>
        <h1 className="lp-status-title">This page isn&apos;t on the board.</h1>
        <p className="lp-status-body">
          Whatever you copied is still safe — this page just never existed. Let&apos;s get you
          back somewhere useful.
        </p>
        <div className="lp-hero-ctas">
          <Link href="/" className="lp-btn lp-btn-primary">
            Back to the board
          </Link>
          <Link href="/#features" className="lp-btn lp-btn-secondary">
            See the features
          </Link>
        </div>
      </main>
    </div>
  );
}
