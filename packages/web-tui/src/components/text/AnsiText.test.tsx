import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { AnsiText } from "./AnsiText";

describe("AnsiText", () => {
  test("renders ansi-colored segments", () => {
    const value = "\u001b[31mERR\u001b[0m OK";
    const { getByText } = render(<AnsiText value={value} />);
    expect(getByText("ERR").className).toContain("text-terminal-red");
  });
});
