import { LogoMark } from "@/components/LogoMark";

export function LandingFooter() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="logo">
            <div className="logo-mark">
              <LogoMark />
            </div>
            IdentArk
          </div>
          <p>The credential isolation layer for production AI agents.</p>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#pricing">Pricing</a>
              </li>
              <li>
                <a href="https://github.com/identark/sdk/releases" target="_blank" rel="noopener noreferrer">
                  Changelog
                </a>
              </li>
              <li>
                <a href="https://identark-cloud.fly.dev/health" target="_blank" rel="noopener noreferrer">
                  Status
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Developers</h4>
            <ul>
              <li>
                <a href="https://github.com/identark/sdk" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://github.com/identark/sdk#readme" target="_blank" rel="noopener noreferrer">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://pypi.org/project/identark-sdk/" target="_blank" rel="noopener noreferrer">
                  PyPI
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="mailto:hello@identark.io">Contact</a>
              </li>
              <li>
                <a href="https://github.com/identark/sdk/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">
                  MIT License
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 IdentArk</span>
        <span>MIT License · Open Source</span>
      </div>
    </footer>
  );
}
