import type React from "react";
import { useRef } from "react";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import { cn } from "../../utils/cn";

export type LogLevel = "info" | "warn" | "error" | "success" | "debug";

export interface LogEntry {
  id?: string;
  message: string;
  level?: LogLevel;
  timestamp?: string;
}

const levelClasses: Record<LogLevel, string> = {
  info: "text-terminal-foreground",
  warn: "text-terminal-yellow",
  error: "text-terminal-red",
  success: "text-terminal-green",
  debug: "text-terminal-brightBlack",
};

export interface LogViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  logs: LogEntry[];
  maxLines?: number;
  autoScroll?: boolean;
}

export const LogViewer: React.FC<LogViewerProps> = ({
  className,
  logs,
  maxLines = 500,
  autoScroll = true,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useAutoScroll(containerRef, { stickToBottom: autoScroll });
  const trimmedLogs = logs.slice(-maxLines);

  return (
    <div
      ref={containerRef}
      className={cn(
        "max-h-80 overflow-auto rounded-terminal border border-terminal-gridLine/60 bg-terminal-black/70 p-3 font-mono text-xs leading-relaxed",
        className,
      )}
      {...props}
    >
      {trimmedLogs.map((log, index) => (
        <div
          key={log.id ?? index}
          className={cn(
            "whitespace-pre-wrap",
            levelClasses[log.level ?? "info"],
          )}
        >
          {log.timestamp && (
            <span className="mr-2 text-terminal-brightBlack">
              {log.timestamp}
            </span>
          )}
          {log.message}
        </div>
      ))}
    </div>
  );
};
