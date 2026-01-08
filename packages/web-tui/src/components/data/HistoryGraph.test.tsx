import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { HistoryGraph } from "./HistoryGraph";

describe("HistoryGraph", () => {
  test("renders list of points", () => {
    const { getByText } = render(
      <HistoryGraph
        title="History"
        points={[
          { label: "12:00", value: 20 },
          { label: "12:05", value: 40 },
        ]}
      />,
    );
    expect(getByText("History")).toBeDefined();
    expect(getByText("12:05")).toBeDefined();
  });

  test("passes variant to inner LineGraph", () => {
    const { container } = render(
      <HistoryGraph
        points={[
          { label: "12:00", value: 20 },
          { label: "12:05", value: 40 },
        ]}
        variant="crt"
      />,
    );
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("shape-rendering")).toBe("crispEdges");
  });

  test("keeps pixelated flag for backwards compatibility", () => {
    const { container } = render(
      <HistoryGraph
        points={[
          { label: "12:00", value: 20 },
          { label: "12:05", value: 40 },
        ]}
        pixelated
      />,
    );
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("shape-rendering")).toBe("crispEdges");
  });
});
