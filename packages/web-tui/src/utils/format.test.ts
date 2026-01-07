import { describe, expect, test } from "bun:test";
import {
  clamp,
  formatBytes,
  formatDuration,
  formatPath,
  formatPercent,
  getSparklinePoints,
  lerp,
  range,
  roundTo,
} from "./format";

describe("format utilities", () => {
  test("clamp keeps values within bounds", () => {
    expect(clamp(10, 0, 5)).toBe(5);
    expect(clamp(-2, 0, 5)).toBe(0);
    expect(clamp(2, 0, 5)).toBe(2);
  });

  test("roundTo trims digits", () => {
    expect(roundTo(1.2345, 2)).toBe(1.23);
  });

  test("formatPercent clamps and formats", () => {
    expect(formatPercent(120)).toBe("100%");
    expect(formatPercent(42.42, 1)).toBe("42.4%");
  });

  test("formatBytes scales values", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(1024)).toBe("1 KB");
  });

  test("formatDuration renders human strings", () => {
    expect(formatDuration(500)).toBe("500ms");
    expect(formatDuration(5000)).toBe("5s");
    expect(formatDuration(65000)).toBe("1m 5s");
  });

  test("formatPath joins segments", () => {
    expect(formatPath(["var", "log", "sys"])).toBe("var/log/sys");
  });

  test("range creates arrays", () => {
    expect(range(3)).toEqual([0, 1, 2]);
  });

  test("lerp interpolates values", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
  });

  test("getSparklinePoints returns svg commands", () => {
    const points = getSparklinePoints([0, 5, 10], 10);
    expect(points.startsWith("M")).toBe(true);
    expect(points.includes("L")).toBe(true);
  });
});
