import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { VerticalMeter } from "./VerticalMeter";

describe("VerticalMeter", () => {
  test("renders labels and values", () => {
    const { getByText } = render(
      <VerticalMeter values={[20, 80]} labels={["core1", "core2"]} />,
    );
    expect(getByText("core1")).toBeDefined();
    expect(getByText("80%")).toBeDefined();
  });
});
