import type { ReactNode } from "react";

const faqs: { q: string; a: ReactNode }[] = [
  {
    q: "Why not just use environment variables?",
    a: "Env vars are accessible to your agent's entire process. A prompt injection attack, a confused agent, or a malicious tool call can read and exfiltrate them. IdentArk ensures your agent only holds a session token — the actual credentials never enter the agent process.",
  },
  {
    q: "Does this add latency to my LLM calls?",
    a: "Our benchmark shows under 1.5ms of SDK overhead per call — less than 0.001% of typical LLM response time (300–800ms). The vault fetch happens in parallel with request setup and is not on the critical path.",
  },
  {
    q: "Which LLM providers do you support?",
    a: "We support OpenAI, Anthropic, Mistral, AWS Bedrock, Azure OpenAI, and Google Gemini. Adding a new provider takes minutes — just register your API key in the vault and start making calls.",
  },
  {
    q: "What happens if the gateway goes down?",
    a: (
      <>
        Your agent&apos;s LLM calls fail with a typed{" "}
        <code style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--green)" }}>NetworkError</code> that you handle
        in your retry logic. We run on Fly.io with health checks and auto-restart. Enterprise customers get SLAs and multi-region
        failover.
      </>
    ),
  },
  {
    q: "Do you store my prompts or responses?",
    a: "No. Audit logs record metadata only: timestamps, token counts, costs, agent IDs. Prompt and response content is never stored. Enterprise customers configure full data retention and deletion policies.",
  },
  {
    q: "How does the open-source SDK relate to IdentArk Cloud?",
    a: (
      <>
        The SDK is MIT licensed and free forever.{" "}
        <code style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--gold)" }}>DirectGateway</code> works locally with
        no account.{" "}
        <code style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--gold)" }}>ControlPlaneGateway</code> connects to
        our hosted cloud — or you can self-host the control plane for enterprise.
      </>
    ),
  },
];

export function FaqSection() {
  return (
    <section className="section">
      <div className="section-tag">FAQ</div>
      <h2 className="section-title">Common questions</h2>

      <div className="faq-grid">
        {faqs.map((item) => (
          <div key={item.q} className="faq-item">
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
