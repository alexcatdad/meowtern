import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { KeyValueList } from "./KeyValueList";

describe("KeyValueList", () => {
  test("renders provided key value pairs", () => {
    const { getByText } = render(
      <KeyValueList
        items={[
          { key: "Host", value: "server-01" },
          { key: "IP", value: "127.0.0.1" },
        ]}
      />,
    );
    expect(getByText("Host")).toBeDefined();
    expect(getByText("127.0.0.1")).toBeDefined();
  });
});
