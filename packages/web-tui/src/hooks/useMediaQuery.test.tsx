import { describe, expect, test } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { useMediaQuery } from "./useMediaQuery";

describe("useMediaQuery", () => {
  test("returns true when query matches", () => {
    const listeners: Array<(event: MediaQueryListEvent) => void> = [];
    const mockMatchMedia = (matches: boolean): MediaQueryList => ({
      matches,
      media: "(max-width: 768px)",
      onchange: null,
      addEventListener: (_event, listener) => {
        listeners.push(listener);
      },
      removeEventListener: (_event, listener) => {
        const index = listeners.indexOf(listener);
        if (index >= 0) listeners.splice(index, 1);
      },
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    });

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => mockMatchMedia(query === "(max-width: 768px)"),
    });

    const { result } = renderHook(() =>
      useMediaQuery("(max-width: 768px)", true),
    );
    expect(result.current).toBe(true);

    act(() => {
      for (const listener of listeners) {
        listener({ matches: false } as MediaQueryListEvent);
      }
    });
    expect(result.current).toBe(false);
  });
});
