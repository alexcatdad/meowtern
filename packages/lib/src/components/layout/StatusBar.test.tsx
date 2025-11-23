import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { StatusBar } from "./StatusBar";

describe("StatusBar", () => {
  test("renders segments with tone", () => {
    const { getByText, container } = render(
      <StatusBar
        segments={[
          { label: "CPU", value: "34%", tone: "success" },
          { label: "Errors", value: "0", tone: "danger" },
        ]}
      />,
    );
    expect(getByText("CPU")).toBeDefined();
    const errorElement = getByText("0");
    // Check if the element or its parent has the danger tone class (text-terminal-danger)
    const hasDangerClass =
      errorElement.className?.includes("text-terminal-danger") ||
      errorElement.parentElement?.className?.includes("text-terminal-danger") ||
      container.querySelector(".text-terminal-danger");
    expect(hasDangerClass).toBeTruthy();
  });
});
