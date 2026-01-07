import type React from "react";
import { formatBytes, formatPercent } from "../../utils/format";
import { Button } from "../Button";
import { DataTable } from "./DataTable";

export interface Process extends Record<string, unknown> {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  status: "running" | "sleeping" | "zombie";
}

export interface ProcessListProps extends React.HTMLAttributes<HTMLDivElement> {
  processes: Process[];
  onTerminate?: (pid: number) => void;
  onRestart?: (pid: number) => void;
}

const statusColors: Record<Process["status"], string> = {
  running: "text-terminal-green",
  sleeping: "text-terminal-brightBlack",
  zombie: "text-terminal-red",
};

export const ProcessList: React.FC<ProcessListProps> = ({
  processes,
  onTerminate,
  onRestart,
  ...props
}) => {
  return (
    <DataTable
      data={processes}
      columns={[
        {
          key: "pid",
          label: "PID",
          width: "5rem",
          sortable: true,
        },
        {
          key: "name",
          label: "Process",
          sortable: true,
        },
        {
          key: "cpu",
          label: "CPU",
          width: "5rem",
          align: "right",
          sortable: true,
          render: (row) => formatPercent(row.cpu as number, 1),
        },
        {
          key: "memory",
          label: "Memory",
          width: "7rem",
          align: "right",
          sortable: true,
          render: (row) => formatBytes(row.memory as number),
        },
        {
          key: "status",
          label: "Status",
          width: "7rem",
          render: (row) => (
            <span className={statusColors[row.status as Process["status"]]}>
              {row.status as string}
            </span>
          ),
        },
        {
          key: "actions",
          label: "Actions",
          width: "10rem",
          render: (row) => (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRestart?.(row.pid as number)}
              >
                Restart
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => onTerminate?.(row.pid as number)}
              >
                Kill
              </Button>
            </div>
          ),
        },
      ]}
      {...props}
    />
  );
};
