import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import { MenuBar } from "./MenuBar";

describe("MenuBar", () => {
  test("opens submenu on hover", () => {
    const onSelect = mock(() => {});
    const { getByText, queryByText } = render(
      <MenuBar
        items={[
          {
            label: "File",
            items: [{ label: "Open", onSelect }],
          },
        ]}
      />,
    );
    fireEvent.mouseEnter(getByText("File"));
    const option = getByText("Open");
    expect(option).toBeDefined();
    fireEvent.click(option);
    expect(onSelect.mock.calls.length).toBe(1);
    expect(queryByText("Open")).toBeDefined();
  });

  test("handles direct item actions", () => {
    const onSelect = mock(() => {});
    const { getByText } = render(
      <MenuBar items={[{ label: "Help", onSelect }]} />,
    );
    fireEvent.click(getByText("Help"));
    expect(onSelect.mock.calls.length).toBe(1);
  });

  test("displays shortcuts for submenu items", () => {
    const { getByText } = render(
      <MenuBar
        items={[
          {
            label: "File",
            items: [{ label: "Save", shortcut: "cmd+s" }],
          },
        ]}
      />,
    );
    fireEvent.mouseEnter(getByText("File"));
    expect(getByText("Cmd + S")).toBeDefined();
  });

  test("toggles submenu visibility via clicks", () => {
    const { getByText, queryByText } = render(
      <MenuBar
        items={[
          {
            label: "View",
            items: [{ label: "Zoom In" }],
          },
        ]}
      />,
    );
    const trigger = getByText("View");
    fireEvent.click(trigger);
    expect(getByText("Zoom In")).toBeDefined();
    fireEvent.click(trigger);
    expect(queryByText("Zoom In")).toBeNull();
  });

  test("closes submenu on mouse leave", () => {
    const { getByText, queryByText } = render(
      <MenuBar
        items={[
          {
            label: "File",
            items: [{ label: "New" }],
          },
        ]}
      />,
    );
    const button = getByText("File");
    const wrapper = button.parentElement;
    if (!wrapper) {
      throw new Error("Missing wrapper");
    }
    fireEvent.mouseEnter(wrapper);
    expect(getByText("New")).toBeDefined();
    fireEvent.mouseLeave(wrapper);
    expect(queryByText("New")).toBeNull();
  });
});
