import { useEffect, useState } from "react";

export const useMediaQuery = (query: string, enabled = true): boolean => {
  const getMatch = () => {
    if (!enabled || typeof window === "undefined" || !window.matchMedia) {
      return false;
    }
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState<boolean>(getMatch);

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || !window.matchMedia) {
      setMatches(false);
      return;
    }

    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    setMatches(mediaQueryList.matches);
    mediaQueryList.addEventListener("change", listener);

    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [query, enabled]);

  return matches;
};
