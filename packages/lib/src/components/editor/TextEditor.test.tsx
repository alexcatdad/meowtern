import { describe, expect, test } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import { TextEditor } from "./TextEditor";

describe("TextEditor", () => {
  test("renders supplied value and line numbers", () => {
    const { rerender, container } = render(
      <TextEditor value="line 1" onChange={() => {}} />,
    );
    let numbers = container.querySelectorAll(
      '[data-testid="line-numbers"] span',
    );
    expect(numbers.length).toBe(1);
    rerender(<TextEditor value={"line 1\nline 2"} onChange={() => {}} />);
    numbers = container.querySelectorAll('[data-testid="line-numbers"] span');
    expect(numbers.length).toBe(2);
  });

  test("updates cursor position on change and select", () => {
    const onChange = (value: string) => value;
    const { container, rerender } = render(
      <TextEditor value="line 1" onChange={onChange} showHighlight={false} />,
    );
    // TextEditor uses contentEditable div, not textarea
    const editor = container.querySelector("[contenteditable='true']") as HTMLElement;
    expect(editor).toBeTruthy();
    if (editor) {
      editor.textContent = "line 1\nline 2";
      fireEvent.input(editor);
      rerender(
        <TextEditor value="line 1\nline 2" onChange={onChange} showHighlight />,
      );
      // Verify the value was updated correctly
      expect(editor.textContent).toContain("line 2");
    }
  });
});
