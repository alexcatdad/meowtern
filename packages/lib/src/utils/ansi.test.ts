import { describe, expect, test } from "bun:test";
import { parseAnsi } from "./ansi";

describe("ansi parser", () => {
  test("splits strings by ansi sequences", () => {
    const segments = parseAnsi("\x1b[31mError\x1b[0m ok");
    expect(segments.length).toBe(2);
    expect(segments[0].className).toBe("text-terminal-red");
    expect(segments[1].text).toBe(" ok");
  });

  test("handles bold and unknown codes gracefully", () => {
    const segments = parseAnsi("\x1b[1mBold\x1b[99mText");
    expect(segments[0].className).toBe("font-bold");
    expect(segments[1].className).toBe("font-bold");
  });
});
