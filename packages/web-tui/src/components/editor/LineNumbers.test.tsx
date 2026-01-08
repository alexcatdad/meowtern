import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { LineNumbers } from "./LineNumbers";

describe("LineNumbers", () => {
  test("renders given amount of lines", () => {
    const { getAllByText } = render(
      <LineNumbers lineCount={3} currentLine={2} />,
    );
    expect(getAllByText("2")[0].className).toContain(
      "text-terminal-foreground",
    );
  });
});
