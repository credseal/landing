import { Link } from "react-router-dom";

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function CtaSection() {
  return (
    <section className="cta-section">
      <div className="cta-box">
        <h2>
          Zero secrets.
          <br />
          Full audit trail.
        </h2>
        <p>We&apos;re onboarding 10 developers for our private beta.</p>
        <div className="cta-actions">
          <Link to="/request-access" className="btn btn-green btn-lg">
            Request Early Access
            <ArrowRight />
          </Link>
          <a href="https://github.com/identark/sdk" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
            View on GitHub
          </a>
        </div>
        <div
          className="install-cmd"
          style={{
            animation: "fadeSlideIn 0.5s ease-out",
            animationDelay: "0.3s",
            animationFillMode: "backwards",
          }}
        >
          <span className="cmd-prompt">$</span>
          pip install identark-sdk
        </div>
      </div>
    </section>
  );
}
