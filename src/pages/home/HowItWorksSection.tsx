export function HowItWorksSection() {
  return (
    <section className="section" id="how-it-works">
      <div className="section-tag">How it works</div>
      <h2 className="section-title">Zero secrets in three steps</h2>
      <p className="section-sub">Switch from direct API calls to credential-isolated execution in under 5 minutes.</p>

      <div className="how-grid">
        <div className="steps-list">
          <div className="step-item">
            <div className="step-num">01</div>
            <div className="step-content">
              <h3>Register your credentials</h3>
              <p>
                Store your LLM API keys once in IdentArk&apos;s encrypted vault via CLI or dashboard. They never leave the
                control plane again.
              </p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-num">02</div>
            <div className="step-content">
              <h3>Swap two lines of code</h3>
              <p>
                Replace your OpenAI or Anthropic client with{" "}
                <code style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--green)" }}>
                  ControlPlaneGateway()
                </code>
                . Your agent logic stays identical.
              </p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-num">03</div>
            <div className="step-content">
              <h3>Deploy with confidence</h3>
              <p>Per-request credential fetch, automatic discard, immutable audit log. Your agent holds zero secrets — even if compromised.</p>
            </div>
          </div>
        </div>

        <div className="arch-diagram">
          <div className="arch-flow">
            <div className="arch-row">
              <div className="arch-node agent" style={{ flex: 1 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
                </svg>
                Your Agent
              </div>
              <div style={{ width: 32, height: 1, background: "var(--border-bright)", flexShrink: 0 }} />
              <div className="arch-node gateway" style={{ flex: 1 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                IdentArk Gateway
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: "calc(50% - 16px)" }}>
              <div style={{ width: 1, height: 20, background: "var(--border-bright)", marginRight: "50%" }} />
            </div>

            <div className="arch-row" style={{ justifyContent: "flex-end" }}>
              <div className="arch-node vault" style={{ flex: "0 1 45%" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                </svg>
                Encrypted Vault
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: "calc(50% - 16px)" }}>
              <div style={{ width: 1, height: 20, background: "var(--border-bright)", marginRight: "50%" }} />
            </div>

            <div className="arch-row" style={{ justifyContent: "flex-end" }}>
              <div className="arch-node llm" style={{ flex: "0 1 45%" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                LLM Provider
              </div>
            </div>
          </div>

          <div className="arch-highlight">agent carries: session_id only &nbsp;·&nbsp; no API keys &nbsp;·&nbsp; no secrets</div>
        </div>
      </div>
    </section>
  );
}
