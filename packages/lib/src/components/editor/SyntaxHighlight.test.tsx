import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { SyntaxHighlight } from "./SyntaxHighlight";

describe("SyntaxHighlight", () => {
  test("highlights keywords", () => {
    const { container } = render(<SyntaxHighlight code="const x = 1;" />);
    expect(container.querySelector("span")).toBeTruthy();
  });
});
