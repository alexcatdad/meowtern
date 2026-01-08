import { describe, expect, it } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import { TerminalProvider, useTerminal } from "./context";

const TestComponent = () => {
  const { theme, toggleTheme } = useTerminal();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button type="button" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};

describe("TerminalProvider", () => {
  it("provides default theme as dark", () => {
    const { getByTestId } = render(
      <TerminalProvider>
        <TestComponent />
      </TerminalProvider>,
    );
    expect(getByTestId("theme").textContent).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("toggles theme", () => {
    const { getByText, getByTestId } = render(
      <TerminalProvider>
        <TestComponent />
      </TerminalProvider>,
    );

    const button = getByText("Toggle Theme");
    fireEvent.click(button);

    expect(getByTestId("theme").textContent).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    fireEvent.click(button);
    expect(getByTestId("theme").textContent).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("respects provided default theme", () => {
    document.documentElement.classList.remove("dark");
    const { getByTestId } = render(
      <TerminalProvider defaultTheme="light">
        <TestComponent />
      </TerminalProvider>,
    );
    expect(getByTestId("theme").textContent).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("throws when useTerminal is called outside provider", () => {
    const originalError = console.error;
    console.error = () => {};
    expect(() => render(<TestComponent />)).toThrow(
      "useTerminal must be used within a TerminalProvider",
    );
    console.error = originalError;
  });
});
