import { describe, expect, it, jest } from "bun:test";
import { cleanup, renderHook } from "@testing-library/react";
import { useKeyboard } from "./hooks/useKeyboard";

describe("useKeyboard", () => {
  it("calls handler on matching key combination", () => {
    const handler = jest.fn();
    renderHook(() => useKeyboard({ "ctrl+c": handler }));

    const event = new KeyboardEvent("keydown", {
      key: "c",
      ctrlKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalled();
  });

  it("does not call handler on non-matching key", () => {
    const handler = jest.fn();
    renderHook(() => useKeyboard({ "ctrl+c": handler }));

    const event = new KeyboardEvent("keydown", {
      key: "d",
      ctrlKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it("handles multiple shortcuts", () => {
    const handlerC = jest.fn();
    const handlerL = jest.fn();
    renderHook(() =>
      useKeyboard({
        "ctrl+c": handlerC,
        "ctrl+l": handlerL,
      }),
    );

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "c", ctrlKey: true, bubbles: true }),
    );
    expect(handlerC).toHaveBeenCalled();
    expect(handlerL).not.toHaveBeenCalled();

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "l", ctrlKey: true, bubbles: true }),
    );
    expect(handlerL).toHaveBeenCalled();
  });

  it("falls back to single key handlers", () => {
    const enterHandler = jest.fn();
    renderHook(() => useKeyboard({ enter: enterHandler }));
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    expect(enterHandler).toHaveBeenCalled();
  });

  it("supports modifier-only handlers", () => {
    const controlHandler = jest.fn();
    renderHook(() => useKeyboard({ control: controlHandler }));
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Control",
        ctrlKey: true,
        bubbles: true,
      }),
    );
    expect(controlHandler).toHaveBeenCalled();
  });
});
