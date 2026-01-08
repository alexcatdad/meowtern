import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import { SelectDialog } from "./SelectDialog";

describe("SelectDialog", () => {
  test("invokes onSelect with chosen option", () => {
    const onSelect = mock(() => {});
    const { getByText } = render(
      <SelectDialog
        open
        title="Pick"
        options={[{ id: "1", label: "Option 1" }]}
        onSelect={onSelect}
      />,
    );
    fireEvent.click(getByText("Option 1"));
    expect(onSelect.mock.calls[0][0].id).toBe("1");
  });
});
