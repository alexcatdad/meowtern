import { describe, expect, it } from "bun:test";
import { hello } from "./index";

describe("hello", () => {
  it("returns world", () => {
    expect(hello()).toBe("world");
  });
});
