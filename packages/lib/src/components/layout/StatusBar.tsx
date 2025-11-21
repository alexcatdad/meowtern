import type React from "react";
import { cn } from "../../utils/cn";

export type StatusTone = "neutral" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<StatusTone, string> = {
  neutral: "text-terminal-foreground",
  success: "text-terminal-success",
  warning: "text-terminal-warning",
  danger: "text-terminal-danger",
  info: "text-terminal-info",
};

export interface StatusSegment {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  tone?: StatusTone;
}

export interface StatusBarProps extends React.HTMLAttributes<HTMLDivElement> {
  segments: StatusSegment[];
  position?: "top" | "bottom";
}

export const StatusBar: React.FC<StatusBarProps> = ({
  segments,
  className,
  position = "bottom",
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 border-terminal-gridLine/50 bg-gradient-to-r from-[#05070f] via-[#070b16] to-[#05070f] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] sm:gap-6 sm:px-4 sm:text-[11px] sm:tracking-[0.3em]",
        position === "bottom" ? "border-t" : "border-b",
        position === "bottom" ? "sticky bottom-0" : "sticky top-0",
        className,
      )}
      {...props}
    >
      {segments.map((segment) => (
        <span
          key={segment.label}
          className={cn(
            "flex items-center gap-1 sm:gap-2",
            toneClasses[segment.tone ?? "neutral"],
          )}
        >
          {segment.icon}
          <span className="opacity-70">{segment.label}</span>
          {segment.value && <span className="font-bold">{segment.value}</span>}
        </span>
      ))}
    </div>
  );
};
