import type React from "react";
import { cn } from "../../utils/cn";
import { clamp, formatPercent } from "../../utils/format";
import { AnimatedValue } from "../utilities/AnimatedValue";

export type VerticalMeterVariant = "smooth" | "pixelated";

export interface VerticalMeterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  values: number[];
  labels?: string[];
  showValues?: boolean;
  variant?: VerticalMeterVariant;
  blockSize?: number;
}

export const VerticalMeter: React.FC<VerticalMeterProps> = ({
  className,
  values,
  labels = [],
  showValues = true,
  variant = "smooth",
  blockSize = 8,
  ...props
}) => {
  const isPixelated = variant === "pixelated";
  const meterHeight = 128; // h-32 = 128px

  return (
    <div
      className={cn(
        "flex items-end gap-2 rounded-terminal border border-terminal-gridLine/60 p-3",
        className,
      )}
      {...props}
    >
      {values.map((value, index) => {
        const pct = clamp(value, 0, 100);
        const meterKey = labels[index] ?? `meter-${index}-${value}`;
        const totalBlocks = isPixelated
          ? Math.ceil(meterHeight / blockSize)
          : 0;
        const filledBlocks = isPixelated
          ? Math.floor((pct / 100) * totalBlocks)
          : 0;

        return (
          <div
            key={meterKey}
            className="flex flex-col items-center gap-2 text-xs uppercase"
          >
            <div
              className={cn(
                "flex w-6 rounded-terminal border border-terminal-gridLine/50 bg-terminal-black/40",
                isPixelated
                  ? "h-32 flex-col-reverse gap-[1px] p-[1px]"
                  : "h-32 items-end",
              )}
            >
              {isPixelated ? (
                <>
                  {Array.from({ length: totalBlocks }).map((_, blockIndex) => {
                    const isFilled = blockIndex < filledBlocks;
                    return (
                      <div
                        key={blockIndex}
                        className={cn(
                          "w-full border transition-colors duration-300",
                          isFilled
                            ? "bg-terminal-green border-terminal-green/60 shadow-[0_0_4px_rgba(22,198,12,0.4)]"
                            : "bg-terminal-black/60 border-terminal-gridLine/40",
                        )}
                        style={{ height: `${blockSize}px` }}
                      />
                    );
                  })}
                </>
              ) : (
                <div
                  className="w-full rounded-b-terminal bg-terminal-green transition-[height] duration-700 ease-out"
                  style={{ height: `${pct}%` }}
                  aria-label={labels[index]}
                />
              )}
            </div>
            {labels[index] && (
              <span className="text-terminal-brightBlack">{labels[index]}</span>
            )}
            {showValues && (
              <span className="font-bold text-terminal-foreground">
                <AnimatedValue
                  value={pct}
                  format={(next) => formatPercent(next, 0)}
                />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
