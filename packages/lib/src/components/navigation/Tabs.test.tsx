import { describe, expect, test } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import { Tabs } from "./Tabs";

const tabs = [
  { id: "one", label: "One", content: <div>First</div> },
  { id: "two", label: "Two", content: <div>Second</div> },
];

describe("Tabs", () => {
  test("switches tabs on click", () => {
    const { getByText } = render(<Tabs tabs={tabs} />);
    fireEvent.click(getByText("Two"));
    expect(getByText("Second")).toBeDefined();
  });
});
