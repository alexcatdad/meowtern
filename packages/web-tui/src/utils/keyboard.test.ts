import { describe, expect, test } from "bun:test";
import { formatKeyCombo, isComboPressed, normalizeCombo } from "./keyboard";

describe("keyboard utils", () => {
  test("normalizes combo ordering", () => {
    expect(normalizeCombo("shift+ctrl+k")).toBe("ctrl+shift+k");
  });

  test("formats combo for display", () => {
    expect(formatKeyCombo("ctrl+k")).toBe("Ctrl + K");
  });

  test("formats multi-character keys", () => {
    expect(formatKeyCombo("alt+PageDown")).toBe("Alt + Pagedown");
  });

  test("detects active combo from keyboard event", () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: true,
    });
    expect(isComboPressed("ctrl+k", event)).toBe(true);
  });

  test("returns false when modifiers do not match", () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: true,
    });
    expect(isComboPressed("ctrl+shift+k", event)).toBe(false);
  });
});
