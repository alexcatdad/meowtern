import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { KeyboardShortcuts } from "./KeyboardShortcuts";

describe("KeyboardShortcuts", () => {
  test("renders shortcuts", () => {
    const { getByText } = render(
      <KeyboardShortcuts
        shortcuts={[{ combo: "ctrl+s", description: "Save" }]}
      />,
    );
    expect(getByText("Save")).toBeDefined();
    expect(getByText("Ctrl + S")).toBeDefined();
  });
});
