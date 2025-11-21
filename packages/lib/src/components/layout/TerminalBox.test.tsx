import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { TerminalBox } from "./TerminalBox";

describe("TerminalBox", () => {
  test("renders title and subtitle", () => {
    const { getByText } = render(
      <TerminalBox title="System" subtitle="live">
        content
      </TerminalBox>,
    );
    expect(getByText("System")).toBeDefined();
    expect(getByText("live")).toBeDefined();
  });

  test("applies border style classes", () => {
    const { container } = render(
      <TerminalBox borderStyle="double">box</TerminalBox>,
    );
    expect(container.firstElementChild?.className).toContain("ring-2");
  });

  test("supports CRT variant", () => {
    const { container } = render(
      <TerminalBox variant="crt">box</TerminalBox>,
    );
    const className = container.firstElementChild?.className || "";
    expect(className).toContain("before:");
  });
});
