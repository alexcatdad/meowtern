import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { ThemeProvider } from "./ThemeProvider";

describe("ThemeProvider", () => {
  test("applies preset styles", () => {
    const { getByText } = render(
      <ThemeProvider preset="polar-night">
        <span>content</span>
      </ThemeProvider>,
    );
    const node = getByText("content").parentElement;
    const bgColor = node?.style.backgroundColor;
    // Accept both hex and rgb formats (browser differences)
    expect(
      bgColor === "rgb(9, 11, 24)" || bgColor === "#090b18",
    ).toBeTruthy();
  });
});
