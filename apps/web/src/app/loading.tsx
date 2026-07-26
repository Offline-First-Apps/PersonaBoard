export default function Loading() {
  return (
    <div className="lp">
      <main className="lp-status" aria-busy="true" aria-label="Loading">
        <span className="lp-wordmark-badge lp-status-badge lp-loading-pulse" aria-hidden="true">
          P
        </span>
        <p className="lp-status-body">One moment — getting things in order.</p>
      </main>
    </div>
  );
}
