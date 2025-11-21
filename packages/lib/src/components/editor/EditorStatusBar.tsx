import type React from "react";
import { cn } from "../../utils/cn";

export interface EditorStatusBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  fileName?: string;
  line?: number;
  column?: number;
  mode?: string;
}

export const EditorStatusBar: React.FC<EditorStatusBarProps> = ({
  fileName,
  line,
  column,
  mode = "INSERT",
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "mt-2 flex items-center justify-between rounded-terminal border border-terminal-gridLine/60 px-3 py-1 text-xs uppercase text-terminal-brightBlack",
        className,
      )}
      {...props}
    >
      <span>{fileName ?? "untitled.txt"}</span>
      <span>
        Ln {line ?? 1}, Col {column ?? 1}
      </span>
      <span>{mode}</span>
    </div>
  );
};
