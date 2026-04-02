function CoreTag() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function FeaturesSection() {
  return (
    <section className="section" id="features">
      <div className="section-tag">Features</div>
      <h2 className="section-title">Built for production agents</h2>
      <p className="section-sub">Everything you need to run secure, auditable AI workloads — from dev to enterprise.</p>

      <div className="bento">
        <div className="bento-card c-8">
          <div className="card-tag">
            <CoreTag />
            Core
          </div>
          <h3>Zero-secret execution</h3>
          <p>
            Every LLM call routes through the gateway. Credentials are fetched from Vault per-request and discarded immediately. Your agent process never holds a secret — not even in memory between calls.
          </p>
        </div>

        <div className="bento-card c-4">
          <div className="card-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18" />
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg>
          </div>
          <h3>Immutable audit log</h3>
          <p>Every call logged: agent ID, tool, timestamp, cost, latency. Append-only. Your compliance team will finally sign off.</p>
        </div>

        <div className="bento-card c-4">
          <div className="card-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h3>Cost caps per agent</h3>
          <p>Set a hard limit per session or per month. When the cap hits, the gateway raises a typed exception. No runaway bills.</p>
        </div>

        <div className="bento-card c-4">
          <div className="card-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <h3>Streaming via SSE</h3>
          <p>Real-time token streaming with no latency penalty. Same secure gateway, same zero-credential model.</p>
        </div>

        <div className="bento-card c-4">
          <div className="card-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <h3>UK/EU data residency</h3>
          <p>Azure UK South, AWS London, Mistral EU. Your data stays in the region your contracts require.</p>
        </div>

        <div className="bento-card c-4">
          <div className="card-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h3>MockGateway for testing</h3>
          <p>Built-in test gateway lets you unit test every agent behaviour — no real credentials, no network, no cost.</p>
        </div>
      </div>
    </section>
  );
}
