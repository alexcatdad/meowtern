import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import { Breadcrumb } from "./Breadcrumb";

describe("Breadcrumb", () => {
  test("calls handler when segment clicked", () => {
    const onClick = mock(() => {});
    const { getByText } = render(
      <Breadcrumb
        segments={[{ label: "root", onClick }, { label: "folder" }]}
      />,
    );
    fireEvent.click(getByText("root"));
    expect(onClick.mock.calls.length).toBe(1);
  });
});
