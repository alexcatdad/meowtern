import type React from "react";
import { useRef } from "react";
import { cn } from "../utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: string;
  onEnter?: (value: string) => void;
  bellOnBackspace?: boolean;
}

export const playBell = () => {
  // Simple beep using audio context or fallback
  // For now, we'll just log or use a simple oscillator if we want to be fancy,
  // but the requirement asked for a bell sound.
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (AudioContextClass) {
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.1;
      osc.start();
      setTimeout(() => osc.stop(), 100);
    }
  } catch (e) {
    console.warn("AudioContext not supported");
  }
};

export const handleInputKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
  onEnter?: (value: string) => void,
  bellOnBackspace = true,
) => {
  if (e.key === "Enter" && onEnter) {
    onEnter(e.currentTarget.value);
    e.currentTarget.value = "";
  }

  if (
    e.key === "Backspace" &&
    e.currentTarget.value.length === 0 &&
    bellOnBackspace
  ) {
    playBell();
  }
};

export const createInputKeyHandler = (
  onEnter?: (value: string) => void,
  bellOnBackspace = true,
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void,
) => {
  return (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleInputKeyDown(e, onEnter, bellOnBackspace);
    onKeyDown?.(e);
  };
};

export const Input: React.FC<InputProps> = ({
  className,
  prefix = ">",
  onEnter,
  bellOnBackspace = true,
  onKeyDown,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = createInputKeyHandler(
    onEnter,
    bellOnBackspace,
    onKeyDown,
  );

  return (
    <div className={cn("flex items-center w-full", className)}>
      {prefix && (
        <span className="mr-2 text-terminal-green font-bold select-none">
          {prefix}
        </span>
      )}
      <input
        ref={inputRef}
        type="text"
        className="flex-1 bg-transparent border-none outline-none text-terminal-foreground placeholder-terminal-brightBlack font-mono"
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        {...props}
      />
    </div>
  );
};
