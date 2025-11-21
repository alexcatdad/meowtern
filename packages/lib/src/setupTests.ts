import { afterEach, expect } from "bun:test";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";

GlobalRegistrator.register();

expect.extend(matchers);

class MockResizeObserver {
  callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe(target: Element) {
    this.callback([{ target }] as ResizeObserverEntry[], this);
  }
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error ensure deterministic ResizeObserver for tests
globalThis.ResizeObserver = MockResizeObserver;

afterEach(() => {
  cleanup();
});
