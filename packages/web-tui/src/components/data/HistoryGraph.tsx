import type React from "react";
import { cn } from "../../utils/cn";
import { formatPercent } from "../../utils/format";
import { Surface } from "../primitives/Surface";
import { AnimatedValue } from "../utilities/AnimatedValue";
import { LineGraph, type LineGraphVariant } from "./LineGraph";

export interface HistoryPoint {
  label: string;
  value: number;
}

export interface HistoryGraphProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  points: HistoryPoint[];
  maxSamples?: number;
  variant?: LineGraphVariant;
  pixelated?: boolean;
  pixelSize?: number;
}

export const HistoryGraph: React.FC<HistoryGraphProps> = ({
  className,
  title,
  points,
  maxSamples = 12,
  variant,
  pixelated,
  pixelSize,
  ...props
}) => {
  const trimmed = points.slice(-maxSamples);
  const values = trimmed.map((point) => point.value);
  const resolvedVariant: LineGraphVariant =
    pixelated && !variant ? "crt" : (variant ?? "smooth");
  const useCrtSurface = resolvedVariant === "crt";

  return (
    <Surface
      variant={useCrtSurface ? "crt" : "sunken"}
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      {title && (
        <div className="text-xs uppercase tracking-wide text-terminal-brightBlack">
          {title}
        </div>
      )}
      <LineGraph
        values={values}
        height={80}
        variant={resolvedVariant}
        pixelated={pixelated}
        pixelSize={pixelSize}
      />
      <div className="max-h-48 overflow-y-auto pr-1 [mask-image:linear-gradient(180deg,rgba(5,7,15,0),rgba(5,7,15,0.95)12%,rgba(5,7,15,0.95)88%,rgba(5,7,15,0))]">
        <div className="grid grid-cols-3 gap-2 text-[0.65rem] uppercase tracking-wide text-terminal-brightBlack">
          {trimmed.map((point) => (
            <div
              key={point.label}
              className="flex items-center justify-between rounded-terminal border border-terminal-gridLine/40 bg-terminal-black/40 px-2 py-1 shadow-[0_8px_20px_rgba(3,4,10,0.45)]"
            >
              <span>{point.label}</span>
              <span className="font-bold text-terminal-foreground">
                <AnimatedValue
                  value={point.value}
                  format={(next) => formatPercent(next, 0)}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    </Surface>
  );
};
