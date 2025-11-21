import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { Separator } from "./Separator";

describe("Separator", () => {
  test("renders horizontal separator with label", () => {
    const { getByText } = render(<Separator label="section" />);
    expect(getByText("section")).toBeDefined();
  });

  test("renders vertical separator", () => {
    const { container } = render(<Separator orientation="vertical" />);
    expect(
      container.querySelector('[aria-orientation="vertical"]'),
    ).toBeTruthy();
  });
});
