export const clamp = (value: number, min = 0, max = 1) => {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
};

export const roundTo = (value: number, digits = 0) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

export const formatPercent = (value: number, digits = 0) => {
  return `${roundTo(clamp(value, 0, 100), digits)}%`;
};

const SIZE_UNITS = ["B", "KB", "MB", "GB", "TB"];
export const formatBytes = (bytes: number, digits = 1) => {
  if (!Number.isFinite(bytes)) return "0 B";
  if (bytes === 0) return "0 B";
  const multiplier = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / 1024 ** multiplier;
  return `${roundTo(value, digits)} ${SIZE_UNITS[multiplier]}`;
};

export const formatDuration = (ms: number) => {
  if (!Number.isFinite(ms)) return "0ms";
  if (ms < 1000) return `${ms}ms`;
  const seconds = ms / 1000;
  if (seconds < 60) return `${roundTo(seconds, 1)}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = roundTo(seconds % 60, 0);
  return `${minutes}m ${remaining}s`.trim();
};

export const formatPath = (parts: string[]) => {
  return parts.filter(Boolean).join("/");
};

export const range = (length: number) =>
  Array.from({ length }, (_, index) => index);

export const lerp = (start: number, end: number, t: number) =>
  start + (end - start) * clamp(t, 0, 1);

export const getSparklinePoints = (values: number[], height = 20) => {
  if (values.length === 0) return "";
  const max = Math.max(...values);
  const min = Math.min(...values);
  const normalized = values.map((value) => {
    if (max === min) return height / 2;
    return ((value - min) / (max - min)) * height;
  });
  return normalized
    .map(
      (value, index) => `${index === 0 ? "M" : "L"} ${index} ${height - value}`,
    )
    .join(" ");
};
