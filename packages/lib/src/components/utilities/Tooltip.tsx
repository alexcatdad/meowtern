import type React from "react";
import { useState } from "react";
import { cn } from "../../utils/cn";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom";
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = "top",
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          className={cn(
            "absolute z-50 whitespace-nowrap rounded-terminal bg-terminal-black px-2 py-1 text-xs text-terminal-foreground shadow-lg",
            side === "top" ? "bottom-full mb-1" : "top-full mt-1",
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
};
