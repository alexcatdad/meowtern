import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  test("shows progress value", () => {
    const { getByRole, getByText } = render(
      <ProgressBar value={50} label="CPU" />,
    );
    expect(getByRole("progressbar").getAttribute("aria-valuenow")).toBe("50");
    expect(getByText("50%")).toBeDefined();
  });
});
