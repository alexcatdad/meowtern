import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { FunctionKeyBar } from "./FunctionKeyBar";

describe("FunctionKeyBar", () => {
  test("renders provided keys", () => {
    const { getByText } = render(
      <FunctionKeyBar keys={[{ key: "F1", label: "Help" }]} />,
    );
    expect(getByText("Help")).toBeDefined();
  });
});
