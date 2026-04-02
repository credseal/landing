import { FormEvent, useState } from "react";
import { apiUrl } from "@/lib/api";

export function EmailCapture() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");

    try {
      const res = await fetch(apiUrl("/newsletter"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("ok");
      setMessage("Thanks — you’re on the list.");
      e.currentTarget.reset();
    } catch {
      setStatus("err");
      setMessage("Couldn’t subscribe. Try again in a moment.");
    }
  }

  return (
    <div className="email-section">
      <div className="email-inner">
        <h3>Stay in the loop</h3>
        <p>New adapters, security updates, and best practices. Low volume, high signal.</p>
        <form className="email-form" onSubmit={onSubmit}>
          <input type="email" name="email" placeholder="you@company.com" required aria-label="Email address" />
          <button type="submit" className="btn btn-green" disabled={status === "loading"}>
            {status === "loading" ? "…" : "Subscribe"}
          </button>
        </form>
        {message ? (
          <p style={{ marginTop: 12, fontSize: 14, color: status === "ok" ? "var(--success)" : "var(--red)" }}>{message}</p>
        ) : null}
      </div>
    </div>
  );
}
