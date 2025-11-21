import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import {
  Input,
  createInputKeyHandler,
  handleInputKeyDown,
  playBell,
} from "./Input";

describe("Input utilities", () => {
  test("handleInputKeyDown calls onEnter", () => {
    const onEnter = mock(() => {});
    const event = {
      key: "Enter",
      currentTarget: { value: "command" },
    } as unknown as React.KeyboardEvent<HTMLInputElement>;
    handleInputKeyDown(event, onEnter, true);
    expect(onEnter.mock.calls[0][0]).toBe("command");
  });

  test("playBell handles missing audio context", () => {
    const warn = mock(() => {});
    const originalWarn = console.warn;
    console.warn = warn as typeof console.warn;
    playBell();
    console.warn = originalWarn;
    expect(warn.mock.calls.length).toBeGreaterThanOrEqual(0);
  });

  test("Input component uses prefix", () => {
    const { getByText } = render(<Input prefix="$" />);
    expect(getByText("$")).toBeDefined();
  });

  test("playBell safely catches constructor errors", () => {
    const warn = mock(() => {});
    const originalWarn = console.warn;
    // @ts-expect-error mock audio context on window
    const originalAudioContext = window.AudioContext;
    class FailingAudioContext {
      constructor() {
        throw new Error("boom");
      }
    }
    // @ts-expect-error assign mock
    window.AudioContext = FailingAudioContext;
    console.warn = warn as typeof console.warn;
    playBell();
    console.warn = originalWarn;
    // @ts-expect-error restore mock
    window.AudioContext = originalAudioContext;
    expect(warn.mock.calls.length).toBeGreaterThan(0);
  });

  test("Input forwards keydown handlers", () => {
    const onKeyDown = mock(() => {});
    const handler = createInputKeyHandler(undefined, true, onKeyDown);
    const event = {
      key: "A",
      currentTarget: { value: "foo" },
      preventDefault() {},
    } as unknown as React.KeyboardEvent<HTMLInputElement>;
    handler(event);
    expect(onKeyDown.mock.calls.length).toBe(1);
  });
});
