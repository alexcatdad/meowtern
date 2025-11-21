import { type RefObject, useEffect } from "react";

type Direction = "vertical" | "horizontal" | "both";

export const useSyncedScroll = (
  refs: RefObject<HTMLElement>[],
  options: { direction?: Direction } = {},
) => {
  const { direction = "vertical" } = options;

  useEffect(() => {
    const elements = refs
      .map((ref) => ref.current)
      .filter((el): el is HTMLElement => Boolean(el));
    if (elements.length < 2) return;

    let isSyncing = false;

    const attachListener = (source: HTMLElement) => {
      const listener = () => {
        if (isSyncing) return;
        isSyncing = true;
        for (const element of elements) {
          if (element === source) continue;
          if (direction === "vertical" || direction === "both") {
            element.scrollTop = source.scrollTop;
          }
          if (direction === "horizontal" || direction === "both") {
            element.scrollLeft = source.scrollLeft;
          }
        }
        isSyncing = false;
      };
      source.addEventListener("scroll", listener, { passive: true });
      return () => source.removeEventListener("scroll", listener);
    };

    const cleanups = elements.map((element) => attachListener(element));
    return () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  }, [direction, refs]);
};
