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
    const { getByRole, rerender } = render(
      <TextEditor value="line 1" onChange={onChange} showHighlight={false} />,
    );
    const textarea = getByRole("textbox") as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "line 1\nline 2" } });
    fireEvent.select(textarea, {
      target: { value: "line 1\nline 2", selectionStart: 7 },
    });
    rerender(
      <TextEditor value="line 1\nline 2" onChange={onChange} showHighlight />,
    );
    expect(textarea.value).toContain("line 2");
  });
});
