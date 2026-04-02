import { Link } from "react-router-dom";
import { LogoMark } from "@/components/LogoMark";

export function LandingNav({ scrolled }: { scrolled: boolean }) {
  return (
    <nav className={scrolled ? "scrolled" : undefined}>
      <Link to="/" className="logo">
        <div className="logo-mark">
          <LogoMark />
        </div>
        IdentArk
      </Link>

      <div className="nav-center">
        <a href="/demo.html">Live Demo</a>
        <a href="#features">Features</a>
        <a href="#how-it-works">How it works</a>
        <a href="#integrations">Integrations</a>
        <a href="#pricing">Pricing</a>
        <a href="https://github.com/identark/sdk/discussions" target="_blank" rel="noopener noreferrer">
          Community
        </a>
        <a href="https://github.com/identark/sdk" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>

      <div className="nav-right">
        <Link to="/login" className="btn btn-outline">
          Sign in
        </Link>
        <Link to="/request-access" className="btn btn-green">
          Request Access
        </Link>
      </div>
    </nav>
  );
}
