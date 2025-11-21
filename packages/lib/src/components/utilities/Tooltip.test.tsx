import { describe, expect, test } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  test("shows content on hover", () => {
    const { getByText, queryByText } = render(
      <Tooltip content="Hint">
        <span>Hover</span>
      </Tooltip>,
    );
    expect(queryByText("Hint")).toBeNull();
    fireEvent.mouseEnter(getByText("Hover"));
    expect(getByText("Hint")).toBeDefined();
  });

  test("supports alternate sides", () => {
    const { getByText } = render(
      <Tooltip content="Info" side="bottom">
        <span>Anchor</span>
      </Tooltip>,
    );
    const anchor = getByText("Anchor");
    fireEvent.mouseEnter(anchor);
    const tip = getByText("Info");
    expect(tip.className).toContain("top-full");
  });

  test("hides content on mouse leave", () => {
    const { getByText, queryByText } = render(
      <Tooltip content="Details">
        <span>Hover me</span>
      </Tooltip>,
    );
    const anchor = getByText("Hover me");
    fireEvent.mouseEnter(anchor);
    expect(getByText("Details")).toBeDefined();
    fireEvent.mouseLeave(anchor);
    expect(queryByText("Details")).toBeNull();
  });
});
