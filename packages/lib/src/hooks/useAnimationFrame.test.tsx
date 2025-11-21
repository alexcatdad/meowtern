import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { useAnimationFrame } from "./useAnimationFrame";

let rafCallbacks: FrameRequestCallback[] = [];

beforeEach(() => {
  rafCallbacks = [];
  globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
    rafCallbacks.push(callback);
    return rafCallbacks.length;
  };
  globalThis.cancelAnimationFrame = (id: number) => {
    rafCallbacks[id - 1] = () => {};
  };
});

afterEach(() => {
  rafCallbacks = [];
});

describe("useAnimationFrame", () => {
  test("invokes callback on animation frames when enabled", () => {
    const spy: number[] = [];
    renderHook(() =>
      useAnimationFrame((delta) => {
        spy.push(delta);
      }),
    );

    act(() => {
      for (const callback of rafCallbacks) {
        callback(16);
      }
    });

    expect(spy.length).toBeGreaterThan(0);
    expect(spy[0]).toBe(0);
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

    act(() => {
      for (const callback of rafCallbacks) {
        callback(16);
      }
    });
    rerender({ enabled: false });
    act(() => {
      for (const callback of rafCallbacks) {
        callback(16);
      }
    });

    expect(spy.length).toBeGreaterThan(0);
    unmount();
  });
});
