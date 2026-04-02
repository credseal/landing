import { useEffect, useRef, useState, type RefObject } from "react";

export function useInViewOnce<T extends Element>(ref: RefObject<T | null>, threshold = 0.3) {
  const [visible, setVisible] = useState(false);
  const seenRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seenRef.current) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !seenRef.current) {
          seenRef.current = true;
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);

  return visible;
}
