import { describe, expect, test } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import { DualPane } from "./DualPane";

const defineScrollProps = (element: HTMLElement) => {
  Object.defineProperties(element, {
    scrollTop: {
      value: 0,
      writable: true,
    },
    scrollHeight: {
      value: 200,
    },
    clientHeight: {
      value: 100,
    },
  });
};

describe("DualPane", () => {
  test("renders controls and syncs scroll", () => {
    const { container, getByText } = render(
      <DualPane
        left={<div>left</div>}
        right={<div>right</div>}
        leftTitle="L"
        rightTitle="R"
      />,
    );

    fireEvent.click(getByText("R"));

    const panes = container.querySelectorAll(".max-h-80");
    const leftPane = panes[0] as HTMLElement;
    const rightPane = panes[1] as HTMLElement;
    defineScrollProps(leftPane);
    defineScrollProps(rightPane);

    leftPane.scrollTop = 50;
    leftPane.dispatchEvent(new Event("scroll"));
    expect(rightPane.scrollTop).toBe(50);
  });
});
