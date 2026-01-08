import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { FilePreview } from "./FilePreview";

describe("FilePreview", () => {
  test("shows metadata and content", () => {
    const { getByText } = render(
      <FilePreview
        name="app.log"
        path="/var/log"
        language="log"
        content="Starting server..."
        metadata={{ Size: "2 KB" }}
      />,
    );
    expect(getByText("app.log")).toBeDefined();
    expect(getByText("Size")).toBeDefined();
    expect(getByText("Starting server...")).toBeDefined();
  });
});
