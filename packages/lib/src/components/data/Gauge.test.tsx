import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { Gauge } from "./Gauge";

describe("Gauge", () => {
  test("displays formatted percent", () => {
    const { getByText } = render(<Gauge value={75} label="CPU" />);
    expect(getByText("75%")).toBeDefined();
    expect(getByText("CPU")).toBeDefined();
  });
});
