import { describe, expect, test } from "bun:test";
import { renderHook } from "@testing-library/react";
import { useStableId } from "./useStableId";

describe("useStableId", () => {
  test("returns a stable id for the component lifecycle", () => {
    const { result, rerender } = renderHook(() => useStableId("demo"));
    const firstValue = result.current;
    rerender();
    expect(result.current).toBe(firstValue);
    expect(firstValue.startsWith("demo-")).toBe(true);
  });

  test("generates unique ids for different prefixes", () => {
    const first = renderHook(() => useStableId("alpha"));
    const second = renderHook(() => useStableId("beta"));
    expect(first.result.current).not.toBe(second.result.current);
    expect(first.result.current.startsWith("alpha-")).toBe(true);
    expect(second.result.current.startsWith("beta-")).toBe(true);
  });
});
