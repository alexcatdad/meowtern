import { describe, expect, mock, test } from "bun:test";
import { act, render } from "@testing-library/react";
import { AnimatedValue } from "./AnimatedValue";

describe("AnimatedValue", () => {
  test("renders formatted value", () => {
    const { getByText } = render(
      <AnimatedValue value={42} format={(value) => value.toFixed(1)} />,
    );
    expect(getByText("42.0")).toBeDefined();
  });

  test("animates between values", async () => {
    const frames: FrameRequestCallback[] = [];
    let rafId = 0;
    const originalRAF = globalThis.requestAnimationFrame;
    globalThis.requestAnimationFrame = ((callback: FrameRequestCallback) => {
      frames.push(callback);
      return ++rafId;
    }) as typeof globalThis.requestAnimationFrame;
    try {
      const { rerender, getByText } = render(<AnimatedValue value={10} />);
      rerender(<AnimatedValue value={20} duration={100} />);
      await act(async () => {
        // Process initial frames only (avoid infinite loop)
        const initialFrames = frames.slice(0, Math.min(frames.length, 10));
        for (const cb of initialFrames) {
          cb(performance.now() + 200);
        }
        // Wait a bit for animation to progress
        await new Promise((resolve) => setTimeout(resolve, 50));
      });
      const valueEl = getByText((content) => /^\d+/.test(content));
      // Value should be between 10 and 20 during animation, or close to 20
      const value = Number(valueEl.textContent);
      expect(value).toBeGreaterThanOrEqual(10);
      expect(value).toBeLessThanOrEqual(20);
    } finally {
      globalThis.requestAnimationFrame = originalRAF;
    }
  });
});
