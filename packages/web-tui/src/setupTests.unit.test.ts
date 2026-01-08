import { describe, expect, test } from "bun:test";

describe("test setup bootstrap", () => {
  test("provides deterministic ResizeObserver mock", () => {
    const observed: Element[] = [];
    const observer = new ResizeObserver((entries) => {
      observed.push(...entries.map((entry) => entry.target));
    });
    const target = document.createElement("div");
    observer.observe(target);
    expect(observed[0]).toBe(target);
    observer.unobserve(target);
    observer.disconnect();
  });
});
