import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import { FileList } from "./FileList";

const items = [
  { name: "b.log", type: "file", size: 200 },
  { name: "a.log", type: "file", size: 100 },
];

describe("FileList", () => {
  test("sorts entries when header clicked twice for descending", () => {
    const { getAllByRole, getByText } = render(<FileList items={items} />);
    const firstRowBefore = getAllByRole("row")[1];
    expect(firstRowBefore.textContent).toContain("a.log");
    const toggleHeader = getByText(/size/i);
    fireEvent.click(toggleHeader);
    fireEvent.click(toggleHeader);
    const firstRowAfter = getAllByRole("row")[1];
    expect(firstRowAfter.textContent).toContain("b.log");
  });

  test("fires onSelect when row clicked", () => {
    const onSelect = mock(() => {});
    const { getAllByRole } = render(
      <FileList items={items} onSelect={onSelect} />,
    );
    fireEvent.click(getAllByRole("row")[1]);
    expect(onSelect.mock.calls[0][0].name).toBe("a.log");
  });
});
