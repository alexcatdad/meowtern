import type React from "react";
import { cn } from "../../utils/cn";

export type LineGraphVariant = "smooth" | "stepped" | "crt";

const clampBetween = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const quantize = (value: number, step: number) => {
  if (step <= 0) return value;
  return Math.round(value / step) * step;
};

const normalizeValues = (values: number[], height: number) => {
  if (values.length === 0) return [];
  const max = Math.max(...values);
  const min = Math.min(...values);
  return values.map((value) => {
    if (max === min) return height / 2;
    return ((value - min) / (max - min)) * height;
  });
};

const getSmoothPath = (values: number[], height: number) => {
  const normalized = normalizeValues(values, height);
  return normalized
    .map(
      (value, index) => `${index === 0 ? "M" : "L"} ${index} ${height - value}`,
    )
    .join(" ");
};

const getSteppedPath = (values: number[], height: number, quantizeStep = 0) => {
  const normalized = normalizeValues(values, height);
  if (normalized.length === 0) return "";
  const formatY = (value: number) =>
    clampBetween(quantize(height - value, quantizeStep), 0, height);

  const commands = [`M 0 ${formatY(normalized[0])}`];
  for (let index = 1; index < normalized.length; index += 1) {
    const previousY = formatY(normalized[index - 1]);
    const nextY = formatY(normalized[index]);
    commands.push(`H ${index}`);
    if (nextY !== previousY) {
      commands.push(`V ${nextY}`);
    }
  }
  return commands.join(" ");
};

type Block = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const getBlockPath = (
  values: number[],
  height: number,
  blockSize: number,
): Block[] => {
  const normalized = normalizeValues(values, height);
  if (normalized.length === 0) return [];

  const blocks: Block[] = [];
  const quantizedStep = Math.max(blockSize, 8);

  for (let index = 0; index < normalized.length - 1; index += 1) {
    const y1 = quantize(height - normalized[index], quantizedStep);
    const y2 = quantize(height - normalized[index + 1], quantizedStep);
    const clampedY1 = clampBetween(y1, 0, height);
    const clampedY2 = clampBetween(y2, 0, height);

    const blockWidth = 1;
    const blockHeight = quantizedStep;

    blocks.push({
      x: index,
      y: clampedY1 - blockHeight / 2,
      width: blockWidth,
      height: blockHeight,
    });

    if (clampedY1 !== clampedY2) {
      const verticalHeight = Math.abs(clampedY2 - clampedY1);
      blocks.push({
        x: index + 0.5 - quantizedStep / 2,
        y: Math.min(clampedY1, clampedY2),
        width: quantizedStep,
        height: verticalHeight,
      });
    }
  }

  const lastY = quantize(
    height - normalized[normalized.length - 1],
    quantizedStep,
  );
  const lastClampedY = clampBetween(lastY, 0, height);
  blocks.push({
    x: normalized.length - 1,
    y: lastClampedY - quantizedStep / 2,
    width: 1,
    height: quantizedStep,
  });

  return blocks;
};

const shouldUseScanlines = (variant: LineGraphVariant) => variant === "crt";

export interface LineGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  values: number[];
  height?: number;
  fill?: boolean;
  strokeWidth?: number;
  gradientId?: string;
  pixelated?: boolean;
  pixelSize?: number;
  variant?: LineGraphVariant;
}

export const LineGraph: React.FC<LineGraphProps> = ({
  className,
  values,
  height = 60,
  fill = true,
  strokeWidth = 2,
  gradientId = "line-graph",
  pixelated,
  pixelSize = 6,
  variant = "smooth",
  ...props
}) => {
  if (values.length === 0) return null;

  const resolvedVariant: LineGraphVariant =
    pixelated === true && variant === "smooth" ? "crt" : variant;

  const usableHeight = Math.max(4, height - strokeWidth);
  const width = Math.max(values.length - 1, 1);
  const strokeGradientId = `${gradientId}-stroke`;
  const scanlinePatternId = `${gradientId}-scanlines`;

  const path =
    resolvedVariant === "smooth"
      ? getSmoothPath(values, usableHeight)
      : getSteppedPath(
          values,
          usableHeight,
          resolvedVariant === "crt" ? Math.max(pixelSize, 8) : 0,
        );

  const blocks =
    resolvedVariant === "crt"
      ? getBlockPath(values, usableHeight, Math.max(pixelSize, 8))
      : [];

  const useScanlines = shouldUseScanlines(resolvedVariant);

  return (
    <div className={cn("w-full", className)} {...props}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        height={height}
        width="100%"
        preserveAspectRatio="none"
        className={cn("overflow-visible", useScanlines && "mix-blend-screen")}
        role="img"
        aria-label="Data line graph"
        shapeRendering={useScanlines ? "crispEdges" : "geometricPrecision"}
      >
        <title>Data line graph</title>
        <defs>
          <linearGradient id={gradientId} x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(97,214,214,0.8)" />
            <stop offset="100%" stopColor="rgba(97,214,214,0)" />
          </linearGradient>
          <linearGradient id={strokeGradientId} x1="0%" x2="100%">
            <stop offset="0%" stopColor="#61d6d6" />
            <stop offset="100%" stopColor="#16c60c" />
          </linearGradient>
          {useScanlines && (
            <pattern
              id={scanlinePatternId}
              width="4"
              height="4"
              patternUnits="userSpaceOnUse"
            >
              <rect width="4" height="2" fill="rgba(0,0,0,0.45)" />
              <rect y="2" width="4" height="2" fill="rgba(255,255,255,0.05)" />
            </pattern>
          )}
        </defs>
        {resolvedVariant === "crt" && blocks.length > 0 ? (
          <>
            {fill && (
              <g opacity={0.45}>
                {blocks.map((block, index) => (
                  <rect
                    key={`fill-${index}`}
                    x={block.x}
                    y={block.y}
                    width={block.width}
                    height={block.height}
                    fill={`url(#${gradientId})`}
                  />
                ))}
              </g>
            )}
            {blocks.map((block, index) => (
              <rect
                key={`block-${index}`}
                x={block.x}
                y={block.y}
                width={block.width}
                height={block.height}
                fill={`url(#${strokeGradientId})`}
                stroke="rgba(22,198,12,0.6)"
                strokeWidth="0.5"
                shapeRendering="crispEdges"
                className="drop-shadow-[0_0_4px_rgba(22,198,12,0.5)]"
              />
            ))}
            {useScanlines && (
              <rect
                x="0"
                y="0"
                width={width}
                height={height}
                fill={`url(#${scanlinePatternId})`}
                opacity={0.4}
              />
            )}
          </>
        ) : (
          <>
            {fill && (
              <path
                d={`${path} L ${width} ${height} L 0 ${height} Z`}
                fill={`url(#${gradientId})`}
                opacity={0.45}
              />
            )}
            {useScanlines && (
              <rect
                x="0"
                y="0"
                width={width}
                height={height}
                fill={`url(#${scanlinePatternId})`}
                opacity={0.4}
              />
            )}
            <path
              d={path}
              fill="none"
              stroke={`url(#${strokeGradientId})`}
              strokeWidth={
                resolvedVariant === "crt"
                  ? Math.max(strokeWidth, 2)
                  : strokeWidth
              }
              strokeLinecap={resolvedVariant === "smooth" ? "round" : "butt"}
              strokeLinejoin={resolvedVariant === "smooth" ? "round" : "miter"}
              shapeRendering={
                resolvedVariant === "smooth"
                  ? "geometricPrecision"
                  : "crispEdges"
              }
              className={cn(
                "drop-shadow-[0_0_15px_rgba(97,214,214,0.6)]",
                resolvedVariant !== "smooth" &&
                  "drop-shadow-[0_0_6px_rgba(22,198,12,0.45)]",
              )}
            />
          </>
        )}
      </svg>
    </div>
  );
};
