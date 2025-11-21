import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { LineGraph } from "./LineGraph";

describe("LineGraph", () => {
  test("renders svg path with values", () => {
    const { container } = render(<LineGraph values={[0, 10, 5]} />);
    const path = container.querySelector("path");
    expect(path).toBeTruthy();
  });

  test("enables CRT rendering when using the variant", () => {
    const { container } = render(
      <LineGraph values={[0, 5, 10]} variant="crt" pixelSize={4} />,
    );
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("shape-rendering")).toBe("crispEdges");
  });

  test("maintains backwards compatibility with pixelated flag", () => {
    const { container } = render(
      <LineGraph values={[0, 5, 10]} pixelated pixelSize={4} />,
    );
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("shape-rendering")).toBe("crispEdges");
  });

  test("stepped variant uses square strokes", () => {
    const { container } = render(
      <LineGraph values={[2, 8, 4]} variant="stepped" />,
    );
    const paths = container.querySelectorAll("path");
    const strokePath = paths[paths.length - 1];
    expect(strokePath?.getAttribute("stroke-linecap")).toBe("butt");
  });
});
