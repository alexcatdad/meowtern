import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import { Dialog } from "./Dialog";

describe("Dialog", () => {
  test("renders title and actions when open", () => {
    const onClose = mock(() => {});
    const { getByText } = render(
      <Dialog
        open
        title="Confirm"
        description="Are you sure?"
        onClose={onClose}
        actions={[{ id: "ok", label: "OK", onSelect: onClose }]}
      >
        <p>Content</p>
      </Dialog>,
    );
    expect(getByText("Confirm")).toBeDefined();
    fireEvent.click(getByText("OK"));
    expect(onClose.mock.calls.length).toBe(1);
  });
});
