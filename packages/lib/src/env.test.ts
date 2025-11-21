import { describe, expect, it } from "bun:test";

describe("Environment", () => {
  it("has document", () => {
    expect(global.document).toBeDefined();
    expect(document.createElement("div")).toBeDefined();
  });
});
