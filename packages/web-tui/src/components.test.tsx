import { afterEach, describe, expect, it, jest } from "bun:test";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { Box } from "./components/Box";
import { Button } from "./components/Button";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Input, handleInputKeyDown } from "./components/Input";
import { PixelatedImage } from "./components/PixelatedImage";
import { TerminalWindow } from "./components/TerminalWindow";
import { Text } from "./components/Text";

afterEach(() => {
  cleanup();
});

describe("Components", () => {
  it("Text renders correctly", () => {
    console.log("Document:", !!global.document);
    console.log("Body:", !!document.body);
    const { getByText } = render(<Text>Hello World</Text>);
    expect(getByText("Hello World")).toBeInTheDocument();
  });

  it("Box renders with title", () => {
    const { getByText } = render(
      <Box title="My Box" border>
        Content
      </Box>,
    );
    expect(getByText("My Box")).toBeInTheDocument();
    expect(getByText("Content")).toBeInTheDocument();
  });

  it("Input renders with prefix", () => {
    const { getByText, getByRole } = render(<Input prefix=">" />);
    expect(getByText(">")).toBeInTheDocument();
    expect(getByRole("textbox")).toBeInTheDocument();
  });

  it("Input handles enter key logic", () => {
    const handleEnter = jest.fn();
    const mockEvent = {
      key: "Enter",
      currentTarget: { value: "test command" },
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    handleInputKeyDown(mockEvent, handleEnter);

    expect(handleEnter).toHaveBeenCalledWith("test command");
    expect(mockEvent.currentTarget.value).toBe("");
  });

  it("Input handles backspace with bell logic", () => {
    const mockStart = jest.fn();
    const mockOscillator = {
      connect: jest.fn(),
      start: mockStart,
      stop: jest.fn(),
      disconnect: jest.fn(),
      frequency: { value: 0 },
    };
    const mockGain = {
      connect: jest.fn(),
      gain: {
        value: 0,
        exponentialRampToValueAtTime: jest.fn(),
      },
    };
    const mockAudioContext = {
      createOscillator: () => mockOscillator,
      createGain: () => mockGain,
      currentTime: 0,
      close: jest.fn(),
      destination: {},
    };

    // @ts-ignore
    window.AudioContext = jest.fn(() => mockAudioContext);
    // @ts-ignore
    window.webkitAudioContext = window.AudioContext;

    const mockEvent = {
      key: "Backspace",
      currentTarget: { value: "" },
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    handleInputKeyDown(mockEvent, undefined, true);
    expect(mockStart).toHaveBeenCalled();
  });

  it("Button renders variants", () => {
    const { getByText, rerender } = render(
      <Button variant="primary">Primary</Button>,
    );
    expect(getByText("Primary").className).toContain("bg-terminal-blue");

    rerender(<Button variant="danger">Danger</Button>);
    expect(getByText("Danger").className).toContain("bg-terminal-red");
  });

  it("Header renders children", () => {
    const { getByText } = render(<Header>Header Content</Header>);
    expect(getByText("Header Content")).toBeInTheDocument();
  });

  it("Footer renders children", () => {
    const { getByText } = render(<Footer>Footer Content</Footer>);
    expect(getByText("Footer Content")).toBeInTheDocument();
  });

  it("TerminalWindow renders with controls", () => {
    const handleClose = jest.fn();
    const handleMinimize = jest.fn();
    const handleMaximize = jest.fn();

    const { getByText } = render(
      <TerminalWindow
        title="Terminal"
        onClose={handleClose}
        onMinimize={handleMinimize}
        onMaximize={handleMaximize}
      >
        Window Content
      </TerminalWindow>,
    );

    expect(getByText("Terminal")).toBeInTheDocument();
    expect(getByText("Window Content")).toBeInTheDocument();

    fireEvent.click(getByText("✕"));
    expect(handleClose).toHaveBeenCalled();

    fireEvent.click(getByText("_"));
    expect(handleMinimize).toHaveBeenCalled();

    fireEvent.click(getByText("□"));
    expect(handleMaximize).toHaveBeenCalled();
  });

  it("PixelatedImage renders with styles", () => {
    const { getByAltText } = render(
      <PixelatedImage
        src="test.png"
        alt="Test Image"
        grayscale
        contrast={1.5}
      />,
    );

    const img = getByAltText("Test Image");
    expect(img.style.imageRendering).toBe("pixelated");
    expect(img.style.filter).toContain("grayscale(100%)");
    expect(img.style.filter).toContain("contrast(1.5)");
  });
});
