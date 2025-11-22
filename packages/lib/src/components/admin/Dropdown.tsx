import type React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../utils/cn";

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
  align?: "left" | "right";
  sideOffset?: number;
}

export const Dropdown: React.FC<DropdownProps> = ({
  children,
  trigger,
  align = "left",
  sideOffset = 4,
  className,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)} {...props}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            "absolute z-50 min-w-[160px] py-1",
            "border border-terminal-gridLine bg-terminal-background shadow-lg",
            "animate-in fade-in-0 zoom-in-95 duration-100",
            align === "left" ? "left-0" : "right-0",
          )}
          style={{ marginTop: sideOffset }}
          role="menu"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export interface DropdownItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  shortcut?: string;
  destructive?: boolean;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  icon,
  shortcut,
  destructive = false,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-2 px-3 py-1.5 text-sm font-mono text-left",
        "transition-colors focus:outline-none",
        destructive
          ? "text-terminal-red hover:bg-terminal-red/10 focus:bg-terminal-red/10"
          : "text-terminal-foreground hover:bg-terminal-brightBlack/20 focus:bg-terminal-brightBlack/20",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
      {...props}
    >
      {icon && (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center">
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
      {shortcut && (
        <span className="ml-auto text-xs text-terminal-brightBlack">
          {shortcut}
        </span>
      )}
    </button>
  );
};

export interface DropdownSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const DropdownSeparator: React.FC<DropdownSeparatorProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn("my-1 h-px bg-terminal-gridLine", className)}
      role="separator"
      {...props}
    />
  );
};

export interface DropdownLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const DropdownLabel: React.FC<DropdownLabelProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-terminal-brightBlack",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
