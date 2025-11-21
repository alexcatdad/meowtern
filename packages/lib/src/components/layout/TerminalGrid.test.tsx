import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { TerminalGrid } from "./TerminalGrid";

describe("TerminalGrid", () => {
  test("applies custom column count", () => {
    const { container } = render(
      <TerminalGrid columns={2}>
        <div>one</div>
        <div>two</div>
      </TerminalGrid>,
    );
    const style = container.firstChild as HTMLElement;
    expect(style.style.gridTemplateColumns).toContain("repeat(2");
  });
});
