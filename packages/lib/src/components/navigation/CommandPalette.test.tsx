import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import { CommandPalette, filterCommands } from "./CommandPalette";

describe("CommandPalette", () => {
  test("filters commands and selects entry", () => {
    const onSelect = mock(() => {});
    const { getByPlaceholderText, getByText } = render(
      <CommandPalette
        open
        onClose={() => {}}
        onSelect={onSelect}
        commands={[
          { id: "1", label: "Open File" },
          { id: "2", label: "Close File" },
        ]}
      />,
    );
    fireEvent.change(getByPlaceholderText("Type a command..."), {
      target: { value: "Open" },
    });
    fireEvent.click(getByText("Open File"));
    expect(onSelect.mock.calls[0][0].id).toBe("1");
  });

  test("closes on escape", () => {
    const onClose = mock(() => {});
    render(
      <CommandPalette
        open
        onClose={onClose}
        onSelect={() => {}}
        commands={[{ id: "1", label: "Close" }]}
      />,
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose.mock.calls.length).toBe(1);
  });

  test("renders empty state when no matches", () => {
    const { getByText } = render(
      <CommandPalette
        open
        onClose={() => {}}
        onSelect={() => {}}
        commands={[]}
      />,
    );
    expect(getByText("No commands found")).toBeDefined();
  });

  test("returns null when closed", () => {
    const { container } = render(
      <CommandPalette
        open={false}
        onClose={() => {}}
        onSelect={() => {}}
        commands={[]}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  test("shows description and shortcut formatting", () => {
    const { getByText } = render(
      <CommandPalette
        open
        onClose={() => {}}
        onSelect={() => {}}
        commands={[
          {
            id: "jump",
            label: "Jump to File",
            description: "Search workspace files",
            shortcut: "ctrl+p",
          },
        ]}
      />,
    );
    expect(getByText("Search workspace files")).toBeDefined();
    expect(getByText("Ctrl + P")).toBeDefined();
  });

  test("filters commands helper returns matches", () => {
    const result = filterCommands(
      [
        { id: "1", label: "Open File" },
        { id: "2", label: "Close File" },
      ],
      "open",
    );
    expect(result).toHaveLength(1);
    expect(result[0]?.label).toBe("Open File");
  });

  test("removes keydown listener on unmount", () => {
    const originalRemove = window.removeEventListener;
    const spy = mock(() => {});
    window.removeEventListener = spy as typeof window.removeEventListener;
    const { unmount } = render(
      <CommandPalette
        open
        onClose={() => {}}
        onSelect={() => {}}
        commands={[{ id: "1", label: "Example" }]}
      />,
    );
    unmount();
    expect(spy.mock.calls[0][0]).toBe("keydown");
    window.removeEventListener = originalRemove;
  });
});
