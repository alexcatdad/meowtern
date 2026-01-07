import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { EditorStatusBar } from "./EditorStatusBar";

describe("EditorStatusBar", () => {
  test("shows file info and cursor position", () => {
    const { getByText } = render(
      <EditorStatusBar fileName="main.ts" line={10} column={5} mode="NORMAL" />,
    );
    expect(getByText("main.ts")).toBeDefined();
    expect(getByText("Ln 10, Col 5")).toBeDefined();
  });
});
