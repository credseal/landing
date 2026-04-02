const integrations: { href: string; img: string; label: string; status: "live" | "soon" }[] = [
  {
    href: "https://github.com/identark/sdk/blob/main/docs/adapters/langchain.md",
    img: "https://avatars.githubusercontent.com/u/126733545",
    label: "LangChain",
    status: "live",
  },
  {
    href: "https://github.com/identark/sdk/blob/main/adapters/n8n",
    img: "https://avatars.githubusercontent.com/u/45487711",
    label: "n8n",
    status: "live",
  },
  { href: "https://github.com/identark/sdk", img: "https://avatars.githubusercontent.com/u/170677839", label: "CrewAI", status: "live" },
  { href: "https://github.com/identark/sdk", img: "https://avatars.githubusercontent.com/u/14957082", label: "OpenAI", status: "live" },
  { href: "https://github.com/identark/sdk", img: "https://avatars.githubusercontent.com/u/76263028", label: "Anthropic", status: "live" },
  { href: "#", img: "https://avatars.githubusercontent.com/u/130722866", label: "LlamaIndex", status: "soon" },
  { href: "https://github.com/identark/sdk", img: "https://avatars.githubusercontent.com/u/132372032", label: "Mistral", status: "live" },
  { href: "#", img: "https://avatars.githubusercontent.com/u/6844498", label: "Azure OpenAI", status: "soon" },
  { href: "https://github.com/identark/sdk", img: "https://avatars.githubusercontent.com/u/2232217", label: "AWS Bedrock", status: "live" },
];

function RestIcon() {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--fg-3)" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
      </svg>
    </div>
  );
}

export function IntegrationsSection() {
  return (
    <section className="section" id="integrations">
      <div className="section-tag">Integrations</div>
      <h2 className="section-title">Works with your stack</h2>
      <p className="section-sub">Drop-in adapters for the frameworks your team already uses.</p>

      <div className="integrations-grid">
        {integrations.map((item) => (
          <a key={item.label} href={item.href} className="int-card" target="_blank" rel="noopener noreferrer">
            <img src={item.img} alt="" loading="lazy" />
            {item.label}
            <span className={`int-status int-${item.status}`}>{item.status}</span>
          </a>
        ))}
        <a href="https://github.com/identark/sdk" className="int-card" target="_blank" rel="noopener noreferrer">
          <RestIcon />
          REST API
          <span className="int-status int-live">live</span>
        </a>
      </div>
    </section>
  );
}
