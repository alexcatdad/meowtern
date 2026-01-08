import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import { InputDialog } from "./InputDialog";

describe("InputDialog", () => {
  test("captures input and confirms value", () => {
    const onConfirm = mock(() => {});
    const { getByPlaceholderText, getByText } = render(
      <InputDialog
        open
        title="Name"
        onConfirm={onConfirm}
        onClose={() => {}}
      />,
    );
    const field = getByPlaceholderText("Enter value") as HTMLInputElement;
    field.value = "web";
    fireEvent.input(field);
    fireEvent.click(getByText("Confirm"));
    expect(onConfirm.mock.calls[0][0]).toBe("web");
  });
});
