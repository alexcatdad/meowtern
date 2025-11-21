import type React from "react";
import { cn } from "../../utils/cn";
import { clamp, formatPercent } from "../../utils/format";
import { AnimatedValue } from "../utilities/AnimatedValue";

export type ProgressBarVariant = "smooth" | "pixelated";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  label?: string;
  showValue?: boolean;
  char?: string;
  size?: "sm" | "md" | "lg";
  variant?: ProgressBarVariant;
  blockSize?: number;
}

const sizes: Record<NonNullable<ProgressBarProps["size"]>, string> = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  className,
  value,
  label,
  showValue = true,
  char = "█",
  size = "md",
  variant = "smooth",
  blockSize = 8,
  ...props
}) => {
  const pct = clamp(value, 0, 100);
  const normalized = pct / 100;
  const fillChars = Math.round(normalized * 20);
  const track = char.repeat(fillChars).padEnd(20, " ");

  const isPixelated = variant === "pixelated";

  // Calculate number of blocks for pixelated variant
  const totalBlocks = isPixelated ? Math.ceil(100 / blockSize) : 0;
  const filledBlocks = isPixelated
    ? Math.floor((pct / 100) * totalBlocks)
    : 0;

  return (
    <div
      className={cn("flex flex-col gap-1 font-mono text-xs", className)}
      {...props}
    >
      {label && (
        <span className="text-terminal-brightBlack uppercase">{label}</span>
      )}
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        className={cn(
          "relative overflow-hidden rounded-terminal border border-terminal-gridLine/60 bg-[#05070f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-accent/60",
          sizes[size],
          isPixelated && "flex p-[1px] gap-[1px]",
        )}
      >
        {isPixelated ? (
          <>
            {Array.from({ length: totalBlocks }).map((_, index) => {
              const isFilled = index < filledBlocks;
              return (
                <div
                  key={index}
                  className={cn(
                    "flex-1 border transition-colors duration-300",
                    isFilled
                      ? "bg-gradient-to-r from-terminal-accent via-terminal-success to-terminal-warning border-terminal-green/60 shadow-[0_0_4px_rgba(22,198,12,0.4)]"
                      : "bg-terminal-black/60 border-terminal-gridLine/40",
                  )}
                />
              );
            })}
          </>
        ) : (
          <>
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-terminal-accent via-terminal-success to-terminal-warning shadow-[0_0_25px_rgba(21,241,255,0.35)] transition-[width] duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
            <span className="relative z-10 flex h-full items-center px-2 text-[0.65rem] tracking-[0.4em] text-terminal-black mix-blend-screen">
              {track}
            </span>
          </>
        )}
      </div>
      {showValue && (
        <span className="text-terminal-foreground">
          <AnimatedValue
            value={pct}
            format={(next) => formatPercent(next, 0)}
          />
        </span>
      )}
    </div>
  );
};
