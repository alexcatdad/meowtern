import type React from "react";
import { useMemo, useState } from "react";
import { cn } from "../../utils/cn";
import { Surface } from "../primitives/Surface";

export type SortDirection = "asc" | "desc";

export interface DataTableColumn<T extends Record<string, unknown>> {
  key: keyof T | string;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T extends Record<string, unknown>>
  extends React.HTMLAttributes<HTMLDivElement> {
  columns: Array<DataTableColumn<T>>;
  data: T[];
  initialSort?: { key: string; direction?: SortDirection };
  maxHeight?: number;
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
  getRowKey?: (row: T, index: number) => React.Key;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  className,
  initialSort,
  maxHeight = 320,
  onRowClick,
  emptyState = "No data",
  getRowKey,
  ...props
}: DataTableProps<T>) {
  const [sort, setSort] = useState<{
    key: string;
    direction: SortDirection;
  }>(() => ({
    key: initialSort?.key ?? (columns[0]?.key as string),
    direction: initialSort?.direction ?? "asc",
  }));

  const sortedData = useMemo(() => {
    const cloned = [...data];
    const column = columns.find((col) => col.key === sort.key);
    if (!column) return cloned;
    cloned.sort((a, b) => {
      const aValue = a[sort.key as keyof T];
      const bValue = b[sort.key as keyof T];
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sort.direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      return sort.direction === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
    return cloned;
  }, [columns, data, sort.direction, sort.key]);

  const toggleSort = (key: string) => {
    setSort((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  return (
    <Surface variant="plain" className={cn("p-0", className)} {...props}>
      <div className="overflow-auto" style={{ maxHeight }}>
        <table className="min-w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-terminal-black/70 text-xs uppercase tracking-wide text-terminal-brightBlack">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  style={{ width: column.width }}
                  className={cn(
                    "border-b border-terminal-gridLine/50 px-3 py-2 text-left",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right",
                  )}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 uppercase tracking-wider text-terminal-accent transition-colors hover:text-terminal-accent/70"
                      onClick={() => toggleSort(column.key as string)}
                    >
                      {column.label}
                      {sort.key === column.key && (
                        <span aria-hidden="true">
                          {sort.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 uppercase tracking-wider text-terminal-foreground/70">
                      {column.label}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-6 text-center text-terminal-brightBlack"
                >
                  {emptyState}
                </td>
              </tr>
            )}
            {sortedData.map((row, rowIndex) => {
              const rowIdentifier =
                getRowKey?.(row, rowIndex) ??
                JSON.stringify({ index: rowIndex, row });
              const handleRowKeyDown = (
                event: React.KeyboardEvent<HTMLTableRowElement>,
              ) => {
                if (
                  onRowClick &&
                  (event.key === "Enter" || event.key === " ")
                ) {
                  event.preventDefault();
                  onRowClick(row);
                }
              };
              return (
                <tr
                  key={rowIdentifier}
                  className={cn(
                    "border-b border-terminal-gridLine/40 transition-colors",
                    onRowClick &&
                      "cursor-pointer hover:bg-terminal-black/40 focus-visible:bg-terminal-black/50",
                  )}
                  tabIndex={onRowClick ? 0 : -1}
                  onClick={() => onRowClick?.(row)}
                  onKeyDown={handleRowKeyDown}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={cn(
                        "px-3 py-2 align-top text-terminal-foreground",
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right",
                      )}
                    >
                      {column.render
                        ? column.render(row)
                        : String(
                            (row as Record<string, unknown>)[
                              column.key as string
                            ] ?? "",
                          )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Surface>
  );
}
