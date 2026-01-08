import type React from "react";
import { cn } from "../utils/cn";
import { Box, type BoxProps } from "./Box";
import { Text } from "./Text";

export interface TerminalWindowProps extends BoxProps {
  title?: string;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  children,
  title = "Terminal",
  onClose,
  onMinimize,
  onMaximize,
  className,
  ...props
}) => {
  return (
    <Box
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-terminal border border-terminal-gridLine/40 bg-gradient-to-b from-[#090f1d] via-[#05070f] to-terminal-black shadow-[0_55px_150px_rgba(3,4,10,0.95),0_25px_80px_rgba(5,7,15,0.6)]",
        "before:pointer-events-none before:absolute before:inset-0 before:content-[''] before:bg-[radial-gradient(circle_at_top,rgba(21,241,255,0.12),transparent_60%)] before:opacity-30",
        "h-auto min-h-[70vh] sm:min-h-[75vh] md:min-h-[85vh]",
        className,
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-terminal-gridLine/40 bg-gradient-to-r from-terminal-accent/20 via-terminal-black to-terminal-magenta/10 px-3 py-2 text-[10px] uppercase tracking-wider text-terminal-brightWhite sm:text-xs">
        <Text variant="bold" className="text-terminal-brightWhite">
          {title}
        </Text>
        <div className="flex gap-1 sm:gap-2">
          {onMinimize && (
            <button
              type="button"
              onClick={onMinimize}
              className="rounded-sm px-2 py-0.5 text-terminal-foreground transition hover:bg-terminal-accent/20"
            >
              _
            </button>
          )}
          {onMaximize && (
            <button
              type="button"
              onClick={onMaximize}
              className="rounded-sm px-2 py-0.5 text-terminal-foreground transition hover:bg-terminal-accent/20"
            >
              □
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm px-2 py-0.5 text-terminal-foreground transition hover:bg-terminal-red/40"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[#04060c]/60 p-3 text-sm text-terminal-foreground sm:p-4">
        {children}
      </div>
    </Box>
  );
};
