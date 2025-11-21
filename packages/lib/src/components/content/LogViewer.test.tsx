import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { LogViewer } from "./LogViewer";

describe("LogViewer", () => {
  test("renders log messages", () => {
    const { getByText } = render(
      <LogViewer
        logs={[
          { message: "System boot", level: "info", timestamp: "12:00" },
          { message: "Warning", level: "warn" },
        ]}
      />,
    );
    expect(getByText("System boot")).toBeDefined();
    expect(getByText("Warning")).toBeDefined();
  });
});
