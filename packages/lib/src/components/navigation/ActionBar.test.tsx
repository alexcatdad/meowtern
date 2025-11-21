import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import { ActionBar } from "./ActionBar";

describe("ActionBar", () => {
  test("triggers action callbacks", () => {
    const onClick = mock(() => {});
    const { getByText } = render(
      <ActionBar
        actions={[{ id: "save", label: "Save", onSelect: onClick }]}
      />,
    );
    fireEvent.click(getByText("Save"));
    expect(onClick.mock.calls.length).toBe(1);
  });
});
