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
    expect(node?.style.backgroundColor).toBe("rgb(9, 11, 24)");
  });
});
