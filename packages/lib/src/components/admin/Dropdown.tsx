import type React from "react";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
} from "react";
import { useControlledState } from "../../hooks/useControlledState";
import { useMenuKeyboard } from "../../hooks/useMenuKeyboard";
import { cn } from "../../utils/cn";

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactElement;
  align?: "left" | "right";
  sideOffset?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      children,
      trigger,
      align = "left",
      sideOffset = 4,
      open: controlledOpen,
      onOpenChange,
      className,
      ...props
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuId = useId();

    const [open, setOpen] = useControlledState(
      controlledOpen,
      false,
      onOpenChange,
    );

    const getMenuItems = useCallback(() => {
      if (!menuRef.current) return [];
      return Array.from(
        menuRef.current.querySelectorAll('[role="menuitem"]:not([disabled])'),
      ) as HTMLElement[];
    }, []);

    const { handleKeyDown, resetFocus } = useMenuKeyboard(
      open,
      setOpen,
      getMenuItems,
    );

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
    }, [open, setOpen]);

    // Reset focus index when menu closes
    useEffect(() => {
      if (!open) {
        resetFocus();
      }
    }, [open, resetFocus]);

    // Clone trigger to add accessibility props
    const triggerElement = isValidElement(trigger)
      ? cloneElement(trigger as React.ReactElement<Record<string, unknown>>, {
          "aria-haspopup": "menu",
          "aria-expanded": open,
          "aria-controls": open ? menuId : undefined,
          onClick: (e: React.MouseEvent) => {
            const onClick = (
              trigger.props as { onClick?: (e: React.MouseEvent) => void }
            ).onClick;
            onClick?.(e);
            setOpen(!open);
          },
        })
      : trigger;

    return (
      <div
        ref={(node) => {
          (
            containerRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn("relative inline-block", className)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {triggerElement}
        {open && (
          <div
            ref={menuRef}
            id={menuId}
            className={cn(
              "absolute z-50 min-w-[160px] py-0.5",
              "border-2 border-terminal-gridLine bg-terminal-background",
              align === "left" ? "left-0" : "right-0",
            )}
            style={{ marginTop: sideOffset }}
            role="menu"
            aria-orientation="vertical"
          >
            {children}
          </div>
        )}
      </div>
    );
  },
);

Dropdown.displayName = "Dropdown";

export interface DropdownItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  shortcut?: string;
  destructive?: boolean;
}

export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  (
    {
      children,
      icon,
      shortcut,
      destructive = false,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        disabled={disabled}
        tabIndex={-1}
        className={cn(
          "flex w-full items-center gap-2 px-2 py-1 text-sm font-mono text-left",
          "focus:outline-none",
          destructive
            ? "text-terminal-red hover:bg-terminal-red hover:text-terminal-background focus:bg-terminal-red focus:text-terminal-background"
            : "text-terminal-foreground hover:bg-terminal-accent hover:text-terminal-background focus:bg-terminal-accent focus:text-terminal-background",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        {...props}
      >
        {icon && (
          <span
            className="flex h-4 w-4 shrink-0 items-center justify-center"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        <span className="flex-1">{children}</span>
        {shortcut && (
          <span
            className="ml-auto text-xs text-terminal-brightBlack"
            aria-hidden="true"
          >
            {shortcut}
          </span>
        )}
      </button>
    );
  },
);

DropdownItem.displayName = "DropdownItem";

export interface DropdownSeparatorProps
  extends React.HTMLAttributes<HTMLHRElement> {}

export const DropdownSeparator = forwardRef<
  HTMLHRElement,
  DropdownSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <hr
      ref={ref}
      className={cn(
        "my-0.5 border-0 bg-transparent text-terminal-gridLine text-xs px-2 h-3 flex items-center",
        "before:content-['─────────────────'] before:block",
        className,
      )}
      aria-orientation="horizontal"
      {...props}
    />
  );
});

DropdownSeparator.displayName = "DropdownSeparator";

export interface DropdownLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const DropdownLabel = forwardRef<HTMLDivElement, DropdownLabelProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "px-2 py-0.5 text-xs font-mono uppercase tracking-wider text-terminal-brightBlack border-b border-terminal-gridLine/40",
          className,
        )}
        role="presentation"
        {...props}
      >
        {children}
      </div>
    );
  },
);

DropdownLabel.displayName = "DropdownLabel";
