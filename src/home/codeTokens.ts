export type CodeToken = {
  text: string;
  class?: string;
  inline?: boolean;
  newline?: boolean;
};

export const beforeCode: CodeToken[] = [
  { text: "import", class: "c-keyword", inline: true },
  { text: " os", class: "c-var", newline: true },
  { text: "from", class: "c-keyword", inline: true },
  { text: " openai ", class: "c-var", inline: true },
  { text: "import", class: "c-keyword", inline: true },
  { text: " OpenAI", class: "c-func", newline: true },
  { text: "", newline: true },
  { text: "# ⚠ Key in env — leaks if agent compromised", class: "c-comment" },
  { text: "client", class: "c-var", inline: true },
  { text: " = ", class: "c-var", inline: true },
  { text: "OpenAI", class: "c-func", inline: true },
  { text: "(", class: "c-var", newline: true },
  { text: "  api_key=", class: "c-var", inline: true },
  { text: 'os.environ["OPENAI_API_KEY"]', class: "c-red", newline: true },
  { text: ")", class: "c-var", newline: true },
  { text: "", newline: true },
  { text: "response", class: "c-var", inline: true },
  { text: " = ", class: "c-var", inline: true },
  { text: "client.chat.completions.", class: "c-var", inline: true },
  { text: "create", class: "c-func", inline: true },
  { text: "(", class: "c-var", newline: true },
  { text: "  model=", class: "c-var", inline: true },
  { text: '"gpt-4o"', class: "c-string", inline: true },
  { text: ",", class: "c-var", newline: true },
  { text: "  messages=messages", class: "c-var", newline: true },
  { text: ")", class: "c-var", newline: true },
];

export const afterCode: CodeToken[] = [
  { text: "from", class: "c-keyword", inline: true },
  { text: " identark ", class: "c-var", inline: true },
  { text: "import", class: "c-keyword", inline: true },
  { text: " ControlPlaneGateway", class: "c-func", newline: true },
  { text: "", newline: true },
  { text: "# ✓ Agent holds no secrets", class: "c-comment" },
  { text: "gateway", class: "c-var", inline: true },
  { text: " = ", class: "c-var", inline: true },
  { text: "ControlPlaneGateway", class: "c-func", inline: true },
  { text: "()", class: "c-var", newline: true },
  { text: "", newline: true },
  { text: "response", class: "c-var", inline: true },
  { text: " = ", class: "c-var", inline: true },
  { text: "gateway.", class: "c-var", inline: true },
  { text: "invoke_llm", class: "c-func", inline: true },
  { text: "(", class: "c-var", newline: true },
  { text: "  messages=messages", class: "c-var", newline: true },
  { text: ")", class: "c-var", newline: true },
  { text: "", newline: true },
  { text: "# Vault fetches key. Agent never sees it.", class: "c-comment" },
];
