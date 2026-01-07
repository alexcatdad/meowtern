import { describe, expect, mock, test } from "bun:test";
import { act, fireEvent, getByLabelText, render } from "@testing-library/react";
import { LogStream } from "./LogStream";

describe("LogStream", () => {
  test("applies default filter to logs", () => {
    const { container } = render(
      <LogStream
        defaultFilter="error"
        logs={[
          { message: "start server" },
          { message: "error connecting", level: "error" },
        ]}
      />,
    );
    const lines = container.querySelectorAll(".whitespace-pre-wrap");
    expect(lines).toHaveLength(1);
    expect(lines[0].textContent).toContain("error connecting");
  });

  test("toggles live mode button", () => {
    const { getByText } = render(
      <LogStream logs={[{ message: "info" }]} onFilterChange={() => {}} />,
    );
    fireEvent.click(getByText("Live"));
    expect(getByText("Paused")).toBeDefined();
  });
});
