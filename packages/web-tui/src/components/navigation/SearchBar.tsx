import type React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../Button";

export interface SearchBarProps extends React.HTMLAttributes<HTMLDivElement> {
  query: string;
  onQueryChange: (value: string) => void;
  replace?: string;
  onReplaceChange?: (value: string) => void;
  onNext?: () => void;
  onPrev?: () => void;
  onReplace?: () => void;
  onReplaceAll?: () => void;
  matchCount?: number;
  currentIndex?: number;
}

export const createQueryInputHandler =
  (onQueryChange: (value: string) => void) =>
  (event: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(event.target.value);
  };

export const createReplaceInputHandler =
  (onReplaceChange?: (value: string) => void) =>
  (event: React.ChangeEvent<HTMLInputElement>) => {
    onReplaceChange?.(event.target.value);
  };

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  replace = "",
  onReplaceChange,
  onNext,
  onPrev,
  onReplace,
  onReplaceAll,
  matchCount,
  currentIndex,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-terminal border border-terminal-gridLine/60 bg-terminal-panel p-2 text-sm text-terminal-foreground",
        className,
      )}
      {...props}
    >
      <label className="flex flex-1 flex-col gap-1">
        <span className="text-xs uppercase text-terminal-brightBlack">
          Find
        </span>
        <input
          value={query}
          onChange={createQueryInputHandler(onQueryChange)}
          className="rounded-terminal border border-terminal-gridLine/40 bg-terminal-black/70 px-2 py-1 font-mono outline-none focus:border-terminal-green"
        />
      </label>
      {onReplaceChange && (
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-xs uppercase text-terminal-brightBlack">
            Replace
          </span>
          <input
            value={replace}
            onChange={createReplaceInputHandler(onReplaceChange)}
            className="rounded-terminal border border-terminal-gridLine/40 bg-terminal-black/70 px-2 py-1 font-mono outline-none focus:border-terminal-green"
          />
        </label>
      )}
      <div className="flex items-center gap-2">
        <Button size="sm" variant="secondary" onClick={onPrev}>
          Prev
        </Button>
        <Button size="sm" variant="secondary" onClick={onNext}>
          Next
        </Button>
      </div>
      {onReplace && (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="primary" onClick={onReplace}>
            Replace
          </Button>
          {onReplaceAll && (
            <Button size="sm" variant="primary" onClick={onReplaceAll}>
              Replace All
            </Button>
          )}
        </div>
      )}
      <div className="text-xs text-terminal-brightBlack">
        {matchCount !== undefined && currentIndex !== undefined
          ? `${currentIndex + 1} / ${matchCount}`
          : null}
      </div>
    </div>
  );
};
