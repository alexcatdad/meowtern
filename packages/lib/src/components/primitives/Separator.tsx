import type React from "react";
import { cn } from "../../utils/cn";

type Orientation = "horizontal" | "vertical";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: Orientation;
  label?: string;
  labelAlign?: "start" | "center" | "end";
}

export const Separator: React.FC<SeparatorProps> = ({
  orientation = "horizontal",
  className,
  label,
  labelAlign = "center",
  ...props
}) => {
  if (orientation === "vertical") {
    return (
      <div
        className={cn("mx-2 h-full w-px bg-terminal-gridLine/60", className)}
        {...props}
      />
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <span className="h-px flex-1 bg-terminal-gridLine/60" />
      {label && (
        <span
          className={cn(
            "text-xs uppercase tracking-wide text-terminal-brightBlack",
            labelAlign === "start" && "ml-2 mr-auto",
            labelAlign === "center" && "mx-2",
            labelAlign === "end" && "mr-2 ml-auto",
          )}
        >
          {label}
        </span>
      )}
      <span className="h-px flex-1 bg-terminal-gridLine/60" />
    </div>
  );
};
