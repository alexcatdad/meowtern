import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { createRef } from "react";
import { ScrollableArea } from "./ScrollableArea";

describe("ScrollableArea", () => {
  test("renders content within scroll container", () => {
    const { getByText } = render(
      <ScrollableArea maxHeight={100}>
        <div>Scrollable</div>
      </ScrollableArea>,
    );
    expect(getByText("Scrollable")).toBeDefined();
  });

  test("forwards refs to consumers", () => {
    const fnRefCalls: Array<HTMLDivElement | null> = [];
    const fnRef = (node: HTMLDivElement | null) => fnRefCalls.push(node);
    const objRef = createRef<HTMLDivElement>();
    render(
      <ScrollableArea ref={fnRef}>
        <div>fn ref</div>
      </ScrollableArea>,
    );
    render(
      <ScrollableArea ref={objRef}>
        <div>obj ref</div>
      </ScrollableArea>,
    );
    expect(fnRefCalls.at(-1)).toBeInstanceOf(HTMLDivElement);
    expect(objRef.current).toBeInstanceOf(HTMLDivElement);
  });
});
