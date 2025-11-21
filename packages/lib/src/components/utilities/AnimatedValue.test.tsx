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
    const originalRAF = globalThis.requestAnimationFrame;
    globalThis.requestAnimationFrame = ((callback: FrameRequestCallback) => {
      frames.push(callback);
      return 1;
    }) as typeof globalThis.requestAnimationFrame;
    try {
      const { rerender, getByText } = render(<AnimatedValue value={10} />);
      rerender(<AnimatedValue value={20} duration={100} />);
      await act(async () => {
        for (const cb of frames) {
          cb(performance.now() + 200);
        }
      });
      const valueEl = getByText((content) => /^\d+/.test(content));
      expect(Number(valueEl.textContent)).toBeCloseTo(20, 5);
    } finally {
      globalThis.requestAnimationFrame = originalRAF;
    }
  });
});
