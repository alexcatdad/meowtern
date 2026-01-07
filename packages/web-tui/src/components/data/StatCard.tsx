import type React from "react";
import { cn } from "../../utils/cn";
import { formatBytes } from "../../utils/format";
import { Surface } from "../primitives/Surface";
import { AnimatedValue } from "../utilities/AnimatedValue";

type Trend = "up" | "down" | "flat";

const trendClasses: Record<Trend, string> = {
  up: "text-terminal-green",
  down: "text-terminal-red",
  flat: "text-terminal-brightBlack",
};

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  secondary?: string;
  trend?: Trend;
  hint?: string;
  formatValue?: (value: string | number) => string;
}

export const StatCard: React.FC<StatCardProps> = ({
  className,
  label,
  value,
  secondary,
  trend = "flat",
  hint,
  formatValue = (input) =>
    typeof input === "number" ? formatBytes(input) : input,
  ...props
}) => {
  return (
    <Surface
      variant="raised"
      className={cn("flex flex-col gap-2 text-sm", className)}
      {...props}
    >
      <span className="text-xs uppercase tracking-wide text-terminal-brightBlack">
        {label}
      </span>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-terminal-foreground">
          {typeof value === "number" ? (
            <AnimatedValue value={value} format={(next) => formatValue(next)} />
          ) : (
            formatValue(value)
          )}
        </span>
        {secondary && (
          <span className={cn("text-xs", trendClasses[trend])}>
            {secondary}
          </span>
        )}
      </div>
      {hint && (
        <span className="text-xs text-terminal-brightBlack">{hint}</span>
      )}
    </Surface>
  );
};
