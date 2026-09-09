import { useEffect, useRef } from "react";

export function useAutoScroll<T extends HTMLElement>(trigger: unknown) {
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const current = elementRef.current;
    if (!current) {
      return;
    }

    current.scrollTop = current.scrollHeight;
  }, [trigger]);

  return elementRef;
}
