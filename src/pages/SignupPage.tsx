import "@/styles/auth.css";
import { FormEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Plausible } from "@/components/Plausible";
import { AuthShell } from "@/layouts/AuthShell";
import { apiUrl, oauthStartUrl } from "@/lib/api";

const VALID_INVITES = ["IDENTARK10", "EARLY2026", "FOUNDER"];

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function SignupPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const invite = searchParams.get("invite") ?? "";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    if (!invite || !VALID_INVITES.includes(invite)) {
      navigate("/request-access", { replace: true });
    }
  }, [invite, navigate]);

  useEffect(() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) s++;
    if (password.match(/[0-9]/)) s++;
    if (password.match(/[^a-zA-Z0-9]/)) s++;
    setStrength(s);
  }, [password]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());

    try {
      const response = await fetch(apiUrl("/auth/signup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || result.message || "Signup failed");
      navigate("/login?registered=true", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  if (!invite || !VALID_INVITES.includes(invite)) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Sign up — IdentArk</title>
        <meta name="description" content="Create your free IdentArk account. Zero-secret AI agents in under 5 minutes." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Plausible />

      <AuthShell
        headerRight={
          <Link to="/login" className="header-link">
            Already have an account? <strong style={{ color: "var(--green)" }}>Log in</strong>
          </Link>
        }
      >
        <div className="signup-container">
          <div className="signup-header">
            <p
              className="beta-invite"
              style={{ color: "var(--gold)", fontSize: 13, fontWeight: 600, marginBottom: 12, letterSpacing: "0.02em" }}
            >
              You&apos;ve been invited to the private beta
            </p>
            <h1>Create your account</h1>
            <p>Start securing your AI agents for free</p>
          </div>

          <div className="signup-card">
            <div className="social-buttons">
              <button type="button" className="social-btn github" onClick={() => (window.location.href = oauthStartUrl("github"))}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Continue with GitHub
              </button>
              <button type="button" className="social-btn google" onClick={() => (window.location.href = oauthStartUrl("google"))}>
                <GoogleIcon />
                Continue with Google
              </button>
            </div>

            <div className="divider">
              <span>or</span>
            </div>

            {error ? (
              <div
                id="signup-error"
                style={{
                  background: "rgba(255,77,77,0.1)",
                  border: "1px solid rgba(255,77,77,0.3)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  marginBottom: 20,
                  color: "#ff4d4d",
                  fontSize: 13,
                }}
              >
                {error}
              </div>
            ) : null}

            <form onSubmit={onSubmit}>
              <input type="hidden" name="invite_code" value={invite} readOnly />

              <div className="form-row signup-names">
                <div className="form-group">
                  <label htmlFor="first_name">First name</label>
                  <input type="text" id="first_name" name="first_name" placeholder="Jane" required autoComplete="given-name" />
                </div>
                <div className="form-group">
                  <label htmlFor="last_name">Last name</label>
                  <input type="text" id="last_name" name="last_name" placeholder="Smith" required autoComplete="family-name" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Work email</label>
                <input type="email" id="email" name="email" placeholder="you@company.com" required autoComplete="email" />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a strong password"
                  required
                  autoComplete="new-password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="password-strength">
                  {[0, 1, 2, 3].map((i) => {
                    const on = i < strength;
                    const tier = strength === 1 ? "weak" : strength === 2 ? "medium" : "active";
                    return <div key={i} className={on ? `strength-bar ${tier}` : "strength-bar"} />;
                  })}
                </div>
                <p className="form-hint">At least 8 characters</p>
              </div>

              <div className="form-group">
                <label htmlFor="org_name">Organisation name</label>
                <input type="text" id="org_name" name="org_name" placeholder="Acme Inc" autoComplete="organization" />
                <p className="form-hint">Optional — you can set this up later</p>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>

            <div className="terms">
              By signing up, you agree to our <a href="/terms.html">Terms of Service</a> and <a href="/privacy.html">Privacy Policy</a>.
            </div>

            <div className="features-list">
              <div className="feature-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Free tier includes 500 executions/month
              </div>
              <div className="feature-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                No credit card required
              </div>
              <div className="feature-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Full audit log access from day one
              </div>
            </div>
          </div>

          <div className="signup-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </AuthShell>
    </>
  );
}
