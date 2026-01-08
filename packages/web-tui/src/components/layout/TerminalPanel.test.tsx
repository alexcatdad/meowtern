import { beforeAll, describe, expect, test } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import { TerminalPanel } from "./TerminalPanel";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: query === "(max-width: 768px)",
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

describe("TerminalPanel", () => {
  test("renders split panes and handles active change", () => {
    const spy: number[] = [];
    const { getAllByRole } = render(
      <TerminalPanel
        split="vertical"
        onActiveChange={(index) => spy.push(index)}
      >
        <div>pane A</div>
        <div>pane B</div>
      </TerminalPanel>,
    );
    const panes = getAllByRole("button");
    fireEvent.click(panes[1]);
    expect(spy).toContain(1);
  });

  test("collapses content on small screens", () => {
    const { getByRole, queryByText } = render(
      <TerminalPanel header={<span>header</span>}>
        <div>details</div>
      </TerminalPanel>,
    );
    const collapseToggle = getByRole("button", { name: /collapse/i });
    fireEvent.click(collapseToggle);
    expect(queryByText("details")).toBeNull();
    fireEvent.click(collapseToggle);
    expect(queryByText("details")).toBeDefined();
  });
});
