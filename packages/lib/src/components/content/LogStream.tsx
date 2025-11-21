import type React from "react";
import { useMemo, useState } from "react";
import { cn } from "../../utils/cn";
import { Button } from "../Button";
import { Surface } from "../primitives/Surface";
import { type LogEntry, LogViewer } from "./LogViewer";

export interface LogStreamProps extends React.HTMLAttributes<HTMLDivElement> {
  logs: LogEntry[];
  defaultFilter?: string;
  onFilterChange?: (value: string) => void;
}

export const LogStream: React.FC<LogStreamProps> = ({
  className,
  logs,
  defaultFilter = "",
  onFilterChange,
  ...props
}) => {
  const [filter, setFilter] = useState(defaultFilter);
  const [autoScroll, setAutoScroll] = useState(true);

  const filteredLogs = useMemo(() => {
    if (!filter) return logs;
    return logs.filter((log) =>
      log.message.toLowerCase().includes(filter.toLowerCase()),
    );
  }, [filter, logs]);

  const handleFilterChange = (value: string) => {
    setFilter(value);
    onFilterChange?.(value);
  };

  return (
    <Surface
      variant="sunken"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-terminal-brightBlack">
        <label className="flex-1">
          Filter
          <input
            type="text"
            value={filter}
            onChange={(event) => handleFilterChange(event.target.value)}
            className="mt-1 w-full rounded-terminal border border-terminal-gridLine/30 bg-terminal-black/70 px-2 py-1 text-terminal-foreground outline-none focus:border-terminal-green"
            placeholder="Search logs..."
          />
        </label>
        <Button
          size="sm"
          variant={autoScroll ? "primary" : "ghost"}
          onClick={() => setAutoScroll((prev) => !prev)}
        >
          {autoScroll ? "Live" : "Paused"}
        </Button>
      </div>
      <LogViewer logs={filteredLogs} autoScroll={autoScroll} />
    </Surface>
  );
};
