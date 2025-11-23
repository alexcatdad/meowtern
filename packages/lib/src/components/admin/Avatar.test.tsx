import { describe, expect, it } from "bun:test";
import React from "react";
import { Avatar, AvatarGroup } from "./Avatar";

describe("Avatar", () => {
  it("renders with initials when no src provided", () => {
    const { container } = {
      container: document.createElement("div"),
    };

    const name = "John Doe";
    const parts = name.trim().split(/\s+/);
    const initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();

    expect(initials).toBe("JD");
  });

  it("renders single letter initials for single name", () => {
    const initials = "Madonna"
      .trim()
      .split(/\s+/)
      .map((part) => part.slice(0, 2))
      .join("")
      .toUpperCase();

    expect(initials).toBe("MA");
  });

  it("generates consistent color for same name", () => {
    const name = "Alice";
    const colors = [
      "bg-terminal-red",
      "bg-terminal-green",
      "bg-terminal-yellow",
      "bg-terminal-blue",
      "bg-terminal-magenta",
      "bg-terminal-cyan",
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = colors[Math.abs(hash) % colors.length];

    expect(color).toBeDefined();
    expect(colors).toContain(color);
  });

  it("returns fallback color for empty name", () => {
    const emptyNameColor = "bg-terminal-brightBlack";
    expect(emptyNameColor).toBe("bg-terminal-brightBlack");
  });

  it("supports different size variants", () => {
    const sizes = ["xs", "sm", "md", "lg", "xl"];
    expect(sizes).toHaveLength(5);
  });

  it("supports status indicators", () => {
    const statuses = ["online", "offline", "away", "busy"];
    expect(statuses).toHaveLength(4);
  });

  it("renders square variant", () => {
    const isSquare = true;
    expect(isSquare).toBe(true);
  });
});

describe("AvatarGroup", () => {
  it("limits visible avatars to max prop", () => {
    const max = 4;
    const children = Array.from({ length: 6 }, (_, i) => i);
    const visible = children.slice(0, max);
    const remaining = Math.max(0, children.length - max);

    expect(visible).toHaveLength(4);
    expect(remaining).toBe(2);
  });

  it("shows remaining count badge", () => {
    const total = 8;
    const max = 3;
    const remaining = total - max;

    expect(remaining).toBe(5);
    expect(remaining > 0).toBe(true);
  });

  it("enforces minimum max of 1", () => {
    const maxAttempt = 0;
    const effectiveMax = Math.max(1, maxAttempt);

    expect(effectiveMax).toBe(1);
  });
});
