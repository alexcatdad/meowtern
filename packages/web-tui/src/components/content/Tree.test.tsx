import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import { Tree } from "./Tree";

const nodes = [
  {
    id: "root",
    label: "root",
    children: [{ id: "child", label: "child" }],
  },
];

describe("Tree", () => {
  test("toggles expansion on click", () => {
    const { getByText, queryByText } = render(
      <Tree nodes={nodes} defaultExpanded={["root"]} />,
    );
    expect(getByText("child")).toBeDefined();
    fireEvent.click(getByText("root"));
    expect(queryByText("child")).toBeNull();
  });

  test("renders metadata and notifies selection", () => {
    const onSelect = mock(() => {});
    const icon = <span data-testid="icon">*</span>;
    const enrichedNodes = [
      {
        id: "srv",
        label: "services",
        meta: "2 pods",
        icon,
        children: [{ id: "pod", label: "pod-a" }],
      },
    ];
    const { getByText, getByTestId } = render(
      <Tree nodes={enrichedNodes} onSelect={onSelect} />,
    );
    fireEvent.click(getByText("services"));
    expect(onSelect.mock.calls[0][0].id).toBe("srv");
    expect(getByTestId("icon")).toBeDefined();
    expect(getByText("2 pods")).toBeDefined();
  });
});
