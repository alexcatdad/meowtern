import { describe, expect, test } from "bun:test";
import { TERMINAL_THEMES, getTerminalTheme } from "./presets";

describe("terminal theme presets", () => {
  test("exposes known presets", () => {
    expect(Object.keys(TERMINAL_THEMES)).toContain("btop-classic");
    expect(getTerminalTheme("polar-night").background).toBe("#090b18");
  });
});
