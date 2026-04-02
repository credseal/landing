import { useEffect } from "react";

const DOMAIN = "identark.io";
const SCRIPT = "https://plausible.io/js/script.js";

export function Plausible() {
  useEffect(() => {
    if (document.querySelector(`script[data-domain="${DOMAIN}"]`)) return;
    const s = document.createElement("script");
    s.defer = true;
    s.dataset.domain = DOMAIN;
    s.src = SCRIPT;
    document.head.appendChild(s);
  }, []);
  return null;
}
