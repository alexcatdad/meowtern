import type React from "react";
import { cn } from "../../utils/cn";
import { clamp, formatPercent } from "../../utils/format";
import { AnimatedValue } from "../utilities/AnimatedValue";

export type GaugeVariant = "smooth" | "pixelated";

export interface GaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: number;
  label?: string;
  min?: number;
  max?: number;
  variant?: GaugeVariant;
  blockCount?: number;
}

export const Gauge: React.FC<GaugeProps> = ({
  className,
  value,
  size = 140,
  label,
  min = 0,
  max = 100,
  variant = "smooth",
  blockCount = 24,
  ...props
}) => {
  const normalized = clamp(((value - min) / (max - min)) * 100, 0, 100);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;
  const isPixelated = variant === "pixelated";
  const centerX = 80;
  const centerY = 80;
  const strokeWidth = 14;

  const filledBlocks = isPixelated
    ? Math.round((normalized / 100) * blockCount)
    : 0;
  const blockAngle = 360 / blockCount;

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-terminal border border-terminal-gridLine/70 p-4",
        className,
      )}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        role="img"
        aria-label={`${label} gauge`}
        shapeRendering={isPixelated ? "crispEdges" : "geometricPrecision"}
      >
        <title>{label} gauge</title>
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {isPixelated ? (
          <>
            {Array.from({ length: blockCount }).map((_, index) => {
              const startAngle = -90 + index * blockAngle;
              const endAngle = -90 + (index + 1) * blockAngle;
              const isFilled = index < filledBlocks;
              const gradientStop = index / blockCount;
              const innerRadius = radius - strokeWidth / 2;
              const outerRadius = radius + strokeWidth / 2;

              const startInner = {
                x:
                  centerX +
                  innerRadius * Math.cos((startAngle * Math.PI) / 180),
                y:
                  centerY +
                  innerRadius * Math.sin((startAngle * Math.PI) / 180),
              };
              const startOuter = {
                x:
                  centerX +
                  outerRadius * Math.cos((startAngle * Math.PI) / 180),
                y:
                  centerY +
                  outerRadius * Math.sin((startAngle * Math.PI) / 180),
              };
              const endInner = {
                x: centerX + innerRadius * Math.cos((endAngle * Math.PI) / 180),
                y: centerY + innerRadius * Math.sin((endAngle * Math.PI) / 180),
              };
              const endOuter = {
                x: centerX + outerRadius * Math.cos((endAngle * Math.PI) / 180),
                y: centerY + outerRadius * Math.sin((endAngle * Math.PI) / 180),
              };
              const largeArcFlag = blockAngle > 180 ? 1 : 0;

              const blockPath = `M ${startInner.x} ${startInner.y} 
                A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${endInner.x} ${endInner.y}
                L ${endOuter.x} ${endOuter.y}
                A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${startOuter.x} ${startOuter.y}
                Z`;

              return (
                <g key={index}>
                  <path
                    d={blockPath}
                    fill={
                      isFilled
                        ? `hsl(${120 + gradientStop * 240}, 70%, 50%)`
                        : "rgba(255,255,255,0.05)"
                    }
                    stroke={
                      isFilled
                        ? "rgba(22,198,12,0.8)"
                        : "rgba(255,255,255,0.15)"
                    }
                    strokeWidth="0.5"
                    strokeLinejoin="miter"
                    className={cn(
                      isFilled && "drop-shadow-[0_0_4px_rgba(22,198,12,0.5)]",
                    )}
                    style={{
                      filter: isFilled
                        ? "drop-shadow(0 0 2px rgba(22,198,12,0.6))"
                        : undefined,
                    }}
                  />
                </g>
              );
            })}
          </>
        ) : (
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="transparent"
            stroke="url(#gauge-gradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 80 80)"
            style={{
              transition:
                "stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        )}
        <defs>
          <linearGradient id="gauge-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#16c60c" />
            <stop offset="100%" stopColor="#3b78ff" />
          </linearGradient>
        </defs>
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="font-mono text-xl"
          fill="#f2f2f2"
        >
          <AnimatedValue
            value={normalized}
            format={(next) => formatPercent(next, 0)}
          />
        </text>
      </svg>
      {label && (
        <span className="text-xs uppercase tracking-wide text-terminal-brightBlack">
          {label}
        </span>
      )}
    </div>
  );
};
