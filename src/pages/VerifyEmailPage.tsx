import "@/styles/verify-email.css";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { Plausible } from "@/components/Plausible";
import { LogoMark } from "@/components/LogoMark";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "you@company.com";
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [digits, setDigits] = useState<string[]>(() => Array(6).fill(""));
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const code = digits.join("");
  const canSubmit = code.length === 6;

  function setDigit(i: number, ch: string) {
    setDigits((d) => {
      const next = [...d];
      next[i] = ch;
      return next;
    });
  }

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    const t = window.setInterval(() => {
      setCountdown((c) => (c !== null && c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0) setCountdown(null);
  }, [countdown]);

  function onVerify(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit || busy) return;
    setBusy(true);
    window
      .setTimeout(() => {
        setSuccess(true);
        setBusy(false);
        window.setTimeout(() => {
          window.location.href = "/dashboard/index.html?welcome=true";
        }, 2000);
      }, 1500);
  }

  async function onResend() {
    setResendBusy(true);
    await new Promise((r) => setTimeout(r, 1000));
    setResendBusy(false);
    setCountdown(60);
  }

  return (
    <>
      <Helmet>
        <title>Verify Your Email — IdentArk</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Plausible />

      <div className="verify-app">
        <header>
          <Link to="/" className="logo">
            <div className="logo-mark">
              <LogoMark />
            </div>
            IdentArk
          </Link>
        </header>

        <main>
          <div className="verify-container">
            {!success ? (
              <div className="pending-state">
                <div className="verify-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>

                <h1>Check your email</h1>
                <p>
                  We sent a verification code to
                  <br />
                  <span className="email-highlight">{email}</span>
                </p>

                <div className="verify-card">
                  <form id="verify-form" onSubmit={onVerify}>
                    <div className="code-input-group">
                      {digits.map((val, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            inputsRef.current[index] = el;
                          }}
                          type="text"
                          className={`code-input${val ? " filled" : ""}`}
                          maxLength={1}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          autoComplete={index === 0 ? "one-time-code" : undefined}
                          value={val}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, "").slice(-1);
                            if (!v) {
                              setDigit(index, "");
                              return;
                            }
                            setDigit(index, v);
                            if (index < 5) inputsRef.current[index + 1]?.focus();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Backspace" && !digits[index] && index > 0) {
                              inputsRef.current[index - 1]?.focus();
                            }
                          }}
                          onPaste={(e) => {
                            e.preventDefault();
                            const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                            const next = Array(6).fill("");
                            pasted.split("").forEach((c, i) => {
                              next[i] = c;
                            });
                            setDigits(next);
                            const last = Math.min(pasted.length, 6) - 1;
                            if (last >= 0) inputsRef.current[last]?.focus();
                          }}
                        />
                      ))}
                    </div>

                    <button type="submit" className="verify-btn" disabled={!canSubmit || busy}>
                      {busy ? "Verifying…" : "Verify email"}
                    </button>
                  </form>

                  <div className="resend-section">
                    <p className="resend-text">Didn&apos;t receive the code?</p>
                    <button type="button" className="resend-btn" onClick={onResend} disabled={resendBusy || countdown !== null}>
                      {resendBusy ? "Sending…" : countdown !== null ? `Wait ${countdown}s` : "Resend code"}
                    </button>
                    {countdown !== null && countdown > 0 ? (
                      <p className="countdown">
                        Resend available in <span>{countdown}</span>s
                      </p>
                    ) : null}
                  </div>
                </div>

                <p className="help-text">
                  Wrong email? <Link to="/request-access">Request access</Link> or try signing up again.
                </p>
              </div>
            ) : (
              <div className="success-state is-visible">
                <div className="verify-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <h1>Email verified!</h1>
                <p>Your account is ready. Redirecting you to the dashboard...</p>
              </div>
            )}
          </div>
        </main>

        <footer>
          <span>© 2026 IdentArk</span>
        </footer>
      </div>
    </>
  );
}
