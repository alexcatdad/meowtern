import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import { ContextMenu } from "./ContextMenu";

describe("ContextMenu", () => {
  test("renders items when visible", () => {
    const onSelect = mock(() => {});
    const { getByText } = render(
      <ContextMenu visible items={[{ label: "Delete", onSelect }]} />,
    );
    fireEvent.click(getByText("Delete"));
    expect(onSelect.mock.calls.length).toBe(1);
  });
});
