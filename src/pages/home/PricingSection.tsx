import { Link } from "react-router-dom";

export function PricingSection() {
  return (
    <section className="section" id="pricing">
      <div className="section-tag">Pricing</div>
      <h2 className="section-title">Simple, predictable pricing</h2>
      <p className="section-sub">No markup on LLM costs. You pay your providers directly. We charge for the gateway.</p>

      <div className="pricing-grid">
        <div className="price-card">
          <div className="price-tier">Hobby</div>
          <div className="price-amount">£0</div>
          <div className="price-desc">Perfect for side projects and trying things out.</div>
          <ul className="price-features">
            <li>1,000 executions / month</li>
            <li>1 organisation</li>
            <li>All providers</li>
            <li>Community support</li>
            <li>7-day audit log</li>
          </ul>
          <Link to="/request-access" className="price-cta btn-outline" style={{ border: "1px solid var(--border-bright)", color: "var(--fg-2)" }}>
            Get Started
          </Link>
        </div>

        <div className="price-card featured">
          <span className="price-badge">Most popular</span>
          <div className="price-tier">Pro</div>
          <div className="price-amount">
            £15<span className="price-period"> /mo</span>
          </div>
          <div className="price-desc">For professionals and small teams shipping AI products.</div>
          <ul className="price-features">
            <li>35,000 executions / month</li>
            <li>4 organisations</li>
            <li>All providers</li>
            <li>Email support</li>
            <li>90-day audit log</li>
            <li>Custom cost caps</li>
          </ul>
          <Link to="/request-access" className="price-cta btn-green" style={{ background: "var(--green)", color: "#000", fontWeight: 700 }}>
            Get Started
          </Link>
        </div>

        <div className="price-card">
          <div className="price-tier">Enterprise</div>
          <div className="price-amount" style={{ fontSize: 36 }}>
            Custom
          </div>
          <div className="price-desc">For teams with advanced security, compliance, and scale needs.</div>
          <ul className="price-features">
            <li>Unlimited executions</li>
            <li>Unlimited organisations</li>
            <li>SSO / SAML / SCIM</li>
            <li>99.9% SLA</li>
            <li>On-prem deployment</li>
            <li>Dedicated support</li>
          </ul>
          <a href="mailto:hello@identark.io" className="price-cta btn-outline" style={{ border: "1px solid var(--border-bright)", color: "var(--fg-2)" }}>
            Contact Sales
          </a>
        </div>
      </div>
    </section>
  );
}
