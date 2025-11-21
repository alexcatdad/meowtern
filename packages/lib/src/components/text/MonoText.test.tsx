import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { MonoText } from "./MonoText";

describe("MonoText", () => {
  test("applies alignment and muted styles", () => {
    const { getByText } = render(
      <MonoText align="center" muted>
        text
      </MonoText>,
    );
    const node = getByText("text");
    expect(node.className).toContain("text-center");
    expect(node.className).toContain("text-terminal-brightBlack");
  });
});
