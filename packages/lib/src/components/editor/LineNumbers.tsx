import type React from "react";
import { cn } from "../../utils/cn";

export interface LineNumbersProps extends React.HTMLAttributes<HTMLDivElement> {
  lineCount: number;
  currentLine?: number;
}

export const LineNumbers: React.FC<LineNumbersProps> = ({
  lineCount,
  currentLine,
  className,
  ...props
}) => {
  return (
    <div
      data-testid="line-numbers"
      className={cn(
        "flex flex-col bg-terminal-black/60 px-3 py-2 font-mono text-xs text-terminal-brightBlack",
        className,
      )}
      {...props}
    >
      {Array.from({ length: lineCount }, (_, index) => index + 1).map(
        (line) => (
          <span
            key={line}
            className={cn(
              "leading-5",
              currentLine === line && "text-terminal-foreground",
            )}
          >
            {line}
          </span>
        ),
      )}
    </div>
  );
};
