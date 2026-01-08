import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { StatCard } from "./StatCard";

describe("StatCard", () => {
  test("renders value and secondary data", () => {
    const { getByText } = render(
      <StatCard label="Memory" value="8 GB" secondary="+4%" trend="up" />,
    );
    expect(getByText("Memory")).toBeDefined();
    expect(getByText("8 GB")).toBeDefined();
    expect(getByText("+4%")).toBeDefined();
  });
});
