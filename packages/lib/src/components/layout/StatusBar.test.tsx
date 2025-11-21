import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { StatusBar } from "./StatusBar";

describe("StatusBar", () => {
  test("renders segments with tone", () => {
    const { getByText } = render(
      <StatusBar
        segments={[
          { label: "CPU", value: "34%", tone: "success" },
          { label: "Errors", value: "0", tone: "danger" },
        ]}
      />,
    );
    expect(getByText("CPU")).toBeDefined();
    expect(getByText("0").parentElement?.className).toContain(
      "text-terminal-red",
    );
  });
});
