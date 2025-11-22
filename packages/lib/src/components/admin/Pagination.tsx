import type React from "react";
import { cn } from "../../utils/cn";

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  siblingCount?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  siblingCount = 1,
  className,
  ...props
}) => {
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const getPageNumbers = (): (number | "...")[] => {
    const totalPageNumbers = siblingCount * 2 + 3;

    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      return [...range(1, leftItemCount), "...", totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      return [1, "...", ...range(totalPages - rightItemCount + 1, totalPages)];
    }

    return [
      1,
      "...",
      ...range(leftSiblingIndex, rightSiblingIndex),
      "...",
      totalPages,
    ];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={cn("flex items-center gap-1 font-mono text-sm", className)}
      {...props}
    >
      {showFirstLast && (
        <PaginationButton
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          {"<<"}
        </PaginationButton>
      )}
      <PaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        {"<"}
      </PaginationButton>

      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-terminal-brightBlack"
          >
            ...
          </span>
        ) : (
          <PaginationButton
            key={page}
            onClick={() => onPageChange(page)}
            active={currentPage === page}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </PaginationButton>
        ),
      )}

      <PaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        {">"}
      </PaginationButton>
      {showFirstLast && (
        <PaginationButton
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
        >
          {">>"}
        </PaginationButton>
      )}
    </div>
  );
};

interface PaginationButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const PaginationButton: React.FC<PaginationButtonProps> = ({
  children,
  className,
  active = false,
  disabled,
  ...props
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "min-w-[32px] px-2 py-1 transition-colors",
        "focus:outline-none focus-visible:ring-1 focus-visible:ring-terminal-accent",
        active
          ? "bg-terminal-accent text-terminal-background"
          : "text-terminal-foreground hover:bg-terminal-brightBlack/20 hover:text-terminal-brightWhite",
        disabled && "cursor-not-allowed opacity-40",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export interface PaginationInfoProps
  extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export const PaginationInfo: React.FC<PaginationInfoProps> = ({
  currentPage,
  pageSize,
  totalItems,
  className,
  ...props
}) => {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      className={cn(
        "font-mono text-sm text-terminal-brightBlack",
        className,
      )}
      {...props}
    >
      Showing {start}-{end} of {totalItems}
    </div>
  );
};
