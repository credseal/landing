import { useEffect } from "react";

const SELECTOR = ".section, .bento-card, .price-card, .faq-item, .int-card";

export function useReveal() {
  useEffect(() => {
    const sections = document.querySelectorAll(SELECTOR);
    sections.forEach((el, i) => {
      el.classList.add("reveal");
      (el as HTMLElement).style.transitionDelay = `${(i % 6) * 50}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}
