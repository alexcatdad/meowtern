import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { Surface } from "./Surface";

describe("Surface", () => {
  test("applies variant classes", () => {
    const { getByText } = render(<Surface variant="sunken">content</Surface>);
    expect(getByText("content").className).toContain("shadow-[inset_0_0_25px_rgba(0,0,0,0.6)]");
  });

  test("applies CRT variant with scanlines", () => {
    const { getByText } = render(<Surface variant="crt">content</Surface>);
    const className = getByText("content").className;
    expect(className).toContain("before:");
    expect(className).toContain("after:");
  });

  test("supports interactive styles", () => {
    const { getByText } = render(
      <Surface interactive className="custom">
        clickable
      </Surface>,
    );
    expect(getByText("clickable").className).toContain("cursor-pointer");
    expect(getByText("clickable").className).toContain("custom");
  });
});
