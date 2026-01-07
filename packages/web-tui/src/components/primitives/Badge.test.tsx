import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  test("renders dot and variant classes", () => {
    const { getByText, container } = render(
      <Badge variant="success" dot>
        online
      </Badge>,
    );
    expect(getByText("online")).toBeDefined();
    expect(container.querySelector("span span")).toBeTruthy();
  });
});
