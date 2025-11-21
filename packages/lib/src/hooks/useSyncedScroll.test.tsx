import { describe, expect, test } from "bun:test";
import { renderHook } from "@testing-library/react";
import { useRef } from "react";
import { useSyncedScroll } from "./useSyncedScroll";

const createElement = () => {
  const el = document.createElement("div");
  el.style.height = "100px";
  el.style.width = "100px";
  return el;
};

describe("useSyncedScroll", () => {
  test("syncs vertical scroll positions", () => {
    const first = createElement();
    const second = createElement();

    renderHook(() => {
      const refA = useRef(first);
      const refB = useRef(second);
      useSyncedScroll([refA, refB]);
    });

    first.scrollTop = 40;
    first.dispatchEvent(new Event("scroll"));
    expect(second.scrollTop).toBe(40);
  });

  test("syncs horizontal scroll positions when configured", () => {
    const first = createElement();
    const second = createElement();

    renderHook(() => {
      const refA = useRef(first);
      const refB = useRef(second);
      useSyncedScroll([refA, refB], { direction: "horizontal" });
    });

    first.scrollLeft = 25;
    first.dispatchEvent(new Event("scroll"));
    expect(second.scrollLeft).toBe(25);
  });
});
