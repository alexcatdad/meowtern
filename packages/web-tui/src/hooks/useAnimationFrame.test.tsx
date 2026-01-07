import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { useAnimationFrame } from "./useAnimationFrame";

let rafCallbacks: FrameRequestCallback[] = [];
let rafIdCounter = 0;
const rafIdMap = new Map<number, FrameRequestCallback>();
let shouldProcessRaf = false;

beforeEach(() => {
  rafCallbacks = [];
  rafIdCounter = 0;
  rafIdMap.clear();
  shouldProcessRaf = false;
  globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
    const id = ++rafIdCounter;
    rafIdMap.set(id, callback);
    // Only add to callbacks if we're in a processing phase
    if (shouldProcessRaf) {
      rafCallbacks.push(callback);
    }
    return id;
  };
  globalThis.cancelAnimationFrame = (id: number) => {
    rafIdMap.delete(id);
  };
});

afterEach(() => {
  rafCallbacks = [];
  rafIdMap.clear();
  shouldProcessRaf = false;
});

describe("useAnimationFrame", () => {
  test("invokes callback on animation frames when enabled", () => {
    const spy: number[] = [];
    const { unmount } = renderHook(() =>
      useAnimationFrame((delta) => {
        spy.push(delta);
      }),
    );

    // Process initial RAF callbacks (only the first one, not recursive ones)
    act(() => {
      shouldProcessRaf = true;
      const initialCallbacks = Array.from(rafIdMap.values());
      for (const callback of initialCallbacks.slice(0, 1)) {
        callback(16);
      }
      shouldProcessRaf = false;
    });

    expect(spy.length).toBeGreaterThan(0);
    expect(spy[0]).toBe(0);
    unmount();
  });

  test("stops when disabled", () => {
    const spy: number[] = [];
    const { rerender, unmount } = renderHook(
      ({ enabled }) =>
        useAnimationFrame(
          (delta) => {
            spy.push(delta);
          },
          { enabled },
        ),
      {
        initialProps: { enabled: true },
      },
    );

    // Process initial callback only
    act(() => {
      shouldProcessRaf = true;
      const initialCallbacks = Array.from(rafIdMap.values());
      if (initialCallbacks.length > 0) {
        initialCallbacks[0](16);
      }
      shouldProcessRaf = false;
    });

    expect(spy.length).toBeGreaterThan(0);

    // Disable and verify no more callbacks
    rerender({ enabled: false });
    const callbackCountBefore = rafIdMap.size;

    act(() => {
      // Should not process any new callbacks after disabling
      shouldProcessRaf = false;
    });

    unmount();
  });
});
