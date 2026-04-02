import { Link } from "react-router-dom";
import { LogoMark } from "@/components/LogoMark";
import type { ReactNode } from "react";

export function AuthShell({
  children,
  headerRight,
}: {
  children: ReactNode;
  headerRight?: ReactNode;
}) {
  return (
    <div className="auth-app">
      <header>
        <Link to="/" className="logo">
          <div className="logo-mark">
            <LogoMark />
          </div>
          IdentArk
        </Link>
        {headerRight}
      </header>
      <main>{children}</main>
      <footer>
        <span>© 2026 IdentArk</span>
        <div className="footer-links">
          <a href="https://github.com/identark/sdk" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://github.com/identark/sdk#readme" target="_blank" rel="noopener noreferrer">
            Docs
          </a>
          <a href="mailto:hello@identark.io">Contact</a>
        </div>
      </footer>
    </div>
  );
}
