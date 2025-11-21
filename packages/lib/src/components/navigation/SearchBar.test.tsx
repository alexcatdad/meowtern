import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import type React from "react";
import {
  SearchBar,
  createQueryInputHandler,
  createReplaceInputHandler,
} from "./SearchBar";

describe("SearchBar", () => {
  test("exposes controls for navigation", () => {
    const onNext = mock(() => {});
    const onPrev = mock(() => {});
    const { getByText } = render(
      <SearchBar
        query=""
        onQueryChange={() => {}}
        onNext={onNext}
        onPrev={onPrev}
      />,
    );
    fireEvent.click(getByText("Next"));
    expect(onNext.mock.calls.length).toBe(1);
    fireEvent.click(getByText("Prev"));
    expect(onPrev.mock.calls.length).toBe(1);
  });

  test("supports replace actions", () => {
    const onReplaceChange = mock(() => {});
    const onReplace = mock(() => {});
    const onReplaceAll = mock(() => {});
    const { container, getByText, getAllByText } = render(
      <SearchBar
        query=""
        onQueryChange={() => {}}
        replace=""
        onReplaceChange={onReplaceChange}
        onNext={() => {}}
        onPrev={() => {}}
        onReplace={onReplace}
        onReplaceAll={onReplaceAll}
        matchCount={5}
        currentIndex={2}
      />,
    );
    const replaceInput = container.querySelectorAll("input")[1];
    fireEvent.change(replaceInput, {
      target: { value: "bar" },
    });
    fireEvent.click(getAllByText("Replace")[1]);
    fireEvent.click(getByText("Replace All"));
    expect(onReplace.mock.calls.length).toBe(1);
    expect(onReplaceAll.mock.calls.length).toBe(1);
  });

  test("input handlers emit values", () => {
    const onQueryChange = mock(() => {});
    const onReplaceChange = mock(() => {});
    const queryHandler = createQueryInputHandler(onQueryChange);
    const replaceHandler = createReplaceInputHandler(onReplaceChange);
    queryHandler({
      target: { value: "foo" },
    } as React.ChangeEvent<HTMLInputElement>);
    replaceHandler?.({
      target: { value: "bar" },
    } as React.ChangeEvent<HTMLInputElement>);
    expect(onQueryChange.mock.calls[0][0]).toBe("foo");
    expect(onReplaceChange.mock.calls[0][0]).toBe("bar");
  });
});
