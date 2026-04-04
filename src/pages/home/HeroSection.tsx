import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { afterCode, beforeCode } from "@/home/codeTokens";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { useTypingCode } from "@/hooks/useTypingCode";

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function HeroSection() {
  const panelRef = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLPreElement>(null);
  const afterRef = useRef<HTMLPreElement>(null);
  const inView = useInViewOnce(panelRef, 0.3);
  const [startAfter, setStartAfter] = useState(false);

  useTypingCode(inView, beforeRef, beforeCode, () => {
    window.setTimeout(() => setStartAfter(true), 500);
  });
  useTypingCode(startAfter, afterRef, afterCode);

  return (
    <section className="hero" style={{ animation: "fadeSlideIn 0.8s ease-out forwards" }}>
      <div className="particles" aria-hidden>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      <div className="hero-eyebrow">
        <span className="eyebrow-dot" />
        Open Source · MIT License · Self-Host Ready
      </div>

      <h1>
        The credential layer
        <br />
        for <em>AI agents</em>
      </h1>

      <p className="hero-sub">
        Your agents run with zero API keys. IdentArk&apos;s gateway fetches credentials per-request from an encrypted vault
        — so a compromised agent can&apos;t leak your secrets.
      </p>

      <div className="hero-actions">
        <Link to="/request-access" className="btn btn-green btn-lg">
          Request Early Access
          <ArrowRight />
        </Link>
        <a href="https://github.com/identark/sdk" target="_blank" rel="noopener noreferrer" className="github-btn">
          <GitHubIcon />
          View on GitHub
        </a>
      </div>

      <div className="hero-split">
        <div className="code-panel" id="code-panel-before" ref={panelRef}>
          <div className="panel-bar">
            <div className="panel-dots">
              <span className="dot dot-r" />
              <span className="dot dot-y" />
              <span className="dot dot-g" />
            </div>
            <span className="panel-label">agent.py</span>
            <span className="panel-tag tag-before">BEFORE</span>
          </div>
          <div className="panel-code">
            <pre ref={beforeRef}>
              <span className="typing-cursor" />
            </pre>
          </div>
        </div>

        <div className="code-panel" id="code-panel-after">
          <div className="panel-bar">
            <div className="panel-dots">
              <span className="dot dot-r" />
              <span className="dot dot-y" />
              <span className="dot dot-g" />
            </div>
            <span className="panel-label">agent.py</span>
            <span className="panel-tag tag-after">AFTER</span>
          </div>
          <div className="panel-code">
            <pre ref={afterRef}>
              <span className="typing-cursor" />
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
