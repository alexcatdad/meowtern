import { describe, expect, mock, test } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { useRef } from "react";
import { useAutoScroll } from "./useAutoScroll";

const createScrollable = () => {
  const container = document.createElement("div");
  Object.defineProperties(container, {
    clientHeight: { value: 100, writable: true },
    scrollHeight: { value: 300, writable: true },
    scrollTop: {
      get() {
        return this._scrollTop ?? 0;
      },
      set(value) {
        this._scrollTop = value;
      },
    },
  });
  return container as HTMLDivElement & { _scrollTop?: number };
};

describe("useAutoScroll", () => {
  test("scrolls to bottom when pinned", () => {
    const node = createScrollable();

    const { result } = renderHook(() => {
      const ref = useRef(node as unknown as HTMLDivElement);
      return useAutoScroll(ref);
    });

    expect(result.current.isPinned).toBe(true);
    expect(node.scrollTop).toBe(node.scrollHeight);
  });

  test("detects when user scrolls away from bottom", () => {
    const node = createScrollable();

    const { result } = renderHook(() => {
      const ref = useRef(node as unknown as HTMLDivElement);
      return useAutoScroll(ref);
    });

    act(() => {
      node.scrollTop = 0;
      node.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.isPinned).toBe(false);
  });

  test("exposes manual controls", () => {
    const node = createScrollable();
    const { result } = renderHook(() => {
      const ref = useRef(node as unknown as HTMLDivElement);
      return useAutoScroll(ref, { stickToBottom: false });
    });
    act(() => {
      result.current.pinToBottom();
      result.current.scrollToBottom();
    });
    expect(result.current.isPinned).toBe(true);
  });

  test("connects mutation observer and disconnects on cleanup", () => {
    const node = createScrollable();
    const observe = mock(() => {});
    const disconnect = mock(() => {});
    const OriginalMutationObserver = globalThis.MutationObserver;
    let recordedCallback: MutationCallback | undefined;
    class StubObserver {
      observe = observe;
      disconnect = disconnect;
      constructor(callback: MutationCallback) {
        recordedCallback = callback;
      }
    }
    // @ts-expect-error allow overriding in tests
    globalThis.MutationObserver = StubObserver;

    const { unmount } = renderHook(() => {
      const ref = useRef(node as unknown as HTMLDivElement);
      return useAutoScroll(ref);
    });

    act(() => {
      node.scrollTop = 0;
      recordedCallback?.([], {} as MutationObserver);
    });
    expect(node.scrollTop).toBe(node.scrollHeight);
    expect(observe.mock.calls.length).toBe(1);

    unmount();
    expect(disconnect.mock.calls.length).toBe(1);
    if (OriginalMutationObserver) {
      globalThis.MutationObserver = OriginalMutationObserver;
    } else {
      // @ts-expect-error cleanup injected observer
      globalThis.MutationObserver = undefined;
    }
  });
});
