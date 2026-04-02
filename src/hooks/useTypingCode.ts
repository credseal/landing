import { useEffect, useRef, type RefObject } from "react";
import type { CodeToken } from "@/home/codeTokens";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function useTypingCode(
  enabled: boolean,
  targetRef: RefObject<HTMLElement | null>,
  tokens: CodeToken[],
  onComplete?: () => void,
) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!enabled || !targetRef.current) return;

    const el = targetRef.current;
    let cancelled = false;

    async function run() {
      el.innerHTML = '<span class="typing-cursor"></span>';
      const cursor = el.querySelector(".typing-cursor");
      if (!cursor) return;

      for (const line of tokens) {
        if (cancelled) return;

        if (line.text === "" && line.newline) {
          el.insertBefore(document.createTextNode("\n"), cursor);
          await sleep(80);
          continue;
        }

        const span = document.createElement("span");
        if (line.class) span.className = line.class;
        el.insertBefore(span, cursor);

        for (const char of line.text) {
          if (cancelled) return;
          span.textContent += char;
          await sleep(20);
        }

        if (line.newline) {
          el.insertBefore(document.createTextNode("\n"), cursor);
          await sleep(80);
        }
      }

      cursor.classList.add("hidden");
      onCompleteRef.current?.();
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [enabled, targetRef, tokens]);
}
