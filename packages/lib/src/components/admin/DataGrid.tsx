import React, { forwardRef, useMemo, useState } from "react";
import { cn } from "../../utils/cn";
import { Pagination, PaginationInfo } from "./Pagination";
import type { SortDirection } from "../content/DataTable";

export interface DataGridColumn<T extends Record<string, unknown>> {
  key: keyof T | string;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface DataGridProps<T extends Record<string, unknown>>
  extends React.HTMLAttributes<HTMLDivElement> {
  columns: Array<DataGridColumn<T>>;
  data: T[];
  selectable?: boolean;
  selectedRows?: Set<React.Key>;
  onSelectionChange?: (selectedRows: Set<React.Key>) => void;
  getRowKey: (row: T, index: number) => React.Key;
  onRowClick?: (row: T) => void;
  pagination?: boolean;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  emptyState?: React.ReactNode;
  stickyHeader?: boolean;
  striped?: boolean;
  compact?: boolean;
  loading?: boolean;
  initialSort?: { key: string; direction?: SortDirection };
  "aria-label"?: string;
}

function DataGridInner<T extends Record<string, unknown>>(
  {
    columns,
    data,
    selectable = false,
    selectedRows: controlledSelected,
    onSelectionChange,
    getRowKey,
    onRowClick,
    pagination = false,
    pageSize = 10,
    currentPage: controlledPage,
    onPageChange,
    emptyState = "No data available",
    stickyHeader = true,
    striped = false,
    compact = false,
    loading = false,
    initialSort,
    className,
    "aria-label": ariaLabel,
    ...props
  }: DataGridProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const [internalPage, setInternalPage] = useState(1);
  const [internalSelected, setInternalSelected] = useState<Set<React.Key>>(
    new Set(),
  );
  const [sort, setSort] = useState<{
    key: string;
    direction: SortDirection;
  }>(() => ({
    key: initialSort?.key ?? "",
    direction: initialSort?.direction ?? "asc",
  }));

  const currentPage = controlledPage ?? internalPage;
  const selectedRows = controlledSelected ?? internalSelected;

  const setPage = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setInternalPage(page);
    }
  };

  const setSelected = (newSelected: Set<React.Key>) => {
    if (onSelectionChange) {
      onSelectionChange(newSelected);
    } else {
      setInternalSelected(newSelected);
    }
  };

  const sortedData = useMemo(() => {
    if (!sort.key) return data;
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

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

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

  const allSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row, i) => selectedRows.has(getRowKey(row, i)));

  const someSelected =
    paginatedData.some((row, i) => selectedRows.has(getRowKey(row, i))) &&
    !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      const newSelected = new Set(selectedRows);
      paginatedData.forEach((row, i) => {
        newSelected.delete(getRowKey(row, i));
      });
      setSelected(newSelected);
    } else {
      const newSelected = new Set(selectedRows);
      paginatedData.forEach((row, i) => {
        newSelected.add(getRowKey(row, i));
      });
      setSelected(newSelected);
    }
  };

  const toggleSelectRow = (key: React.Key) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelected(newSelected);
  };

  const getAriaSort = (
    columnKey: string,
  ): "ascending" | "descending" | "none" => {
    if (sort.key !== columnKey) return "none";
    return sort.direction === "asc" ? "ascending" : "descending";
  };

  if (columns.length === 0) {
    return (
      <div
        ref={ref}
        className={cn("text-terminal-brightBlack text-sm", className)}
        {...props}
      >
        No columns defined
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="overflow-auto border border-terminal-gridLine">
        <table
          className="min-w-full border-collapse font-mono text-sm"
          aria-label={ariaLabel}
        >
          <thead
            className={cn(
              "bg-terminal-black/70 text-xs uppercase tracking-wide text-terminal-brightBlack",
              stickyHeader && "sticky top-0 z-10",
            )}
          >
            <tr>
              {selectable && (
                <th
                  scope="col"
                  className="w-10 border-b border-terminal-gridLine px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 cursor-pointer accent-terminal-accent"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  scope="col"
                  style={{ width: column.width }}
                  aria-sort={column.sortable ? getAriaSort(column.key as string) : undefined}
                  className={cn(
                    "border-b border-terminal-gridLine px-3",
                    compact ? "py-1.5" : "py-2",
                    "text-left",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right",
                  )}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 uppercase tracking-wider text-terminal-accent transition-colors hover:text-terminal-accent/70"
                      onClick={() => toggleSort(column.key as string)}
                      aria-label={`Sort by ${column.label}`}
                    >
                      {column.label}
                      {sort.key === column.key && (
                        <span aria-hidden="true">
                          {sort.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </button>
                  ) : (
                    <span className="text-terminal-foreground/70">
                      {column.label}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-3 py-8 text-center text-terminal-brightBlack"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="animate-pulse">Loading...</span>
                  </div>
                </td>
              </tr>
            )}
            {!loading && paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-3 py-8 text-center text-terminal-brightBlack"
                >
                  {emptyState}
                </td>
              </tr>
            )}
            {!loading &&
              paginatedData.map((row, rowIndex) => {
                const rowKey = getRowKey(row, rowIndex);
                const isSelected = selectedRows.has(rowKey);

                return (
                  <tr
                    key={rowKey}
                    className={cn(
                      "border-b border-terminal-gridLine/40 transition-colors",
                      striped && rowIndex % 2 === 1 && "bg-terminal-black/20",
                      isSelected && "bg-terminal-accent/10",
                      onRowClick &&
                        "cursor-pointer hover:bg-terminal-black/40 focus-visible:bg-terminal-black/50",
                    )}
                    onClick={() => onRowClick?.(row)}
                    tabIndex={onRowClick ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (onRowClick && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        onRowClick(row);
                      }
                    }}
                  >
                    {selectable && (
                      <td
                        className={cn("px-3", compact ? "py-1.5" : "py-2")}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(rowKey)}
                          className="h-4 w-4 cursor-pointer accent-terminal-accent"
                          aria-label={`Select row ${rowIndex + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={cn(
                          "px-3 align-top text-terminal-foreground",
                          compact ? "py-1.5" : "py-2",
                          column.align === "center" && "text-center",
                          column.align === "right" && "text-right",
                        )}
                      >
                        {column.render
                          ? column.render(row, rowIndex)
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

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <PaginationInfo
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={sortedData.length}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {selectable && selectedRows.size > 0 && (
        <div className="text-sm text-terminal-brightBlack">
          {selectedRows.size} row{selectedRows.size !== 1 ? "s" : ""} selected
        </div>
      )}
    </div>
  );
}

export const DataGrid = forwardRef(DataGridInner) as <
  T extends Record<string, unknown>,
>(
  props: DataGridProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.ReactElement;

(DataGrid as React.FC).displayName = "DataGrid";

// Keep backwards compatibility alias
export const AdminTable = DataGrid;
export type AdminTableProps<T extends Record<string, unknown>> =
  DataGridProps<T>;
export type AdminTableColumn<T extends Record<string, unknown>> =
  DataGridColumn<T>;
