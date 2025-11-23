import type React from "react";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { cn } from "../../utils/cn";

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("Sidebar components must be used within a Sidebar");
  }
  return context;
};

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  defaultCollapsed?: boolean;
  width?: string;
  collapsedWidth?: string;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      children,
      className,
      collapsed: controlledCollapsed,
      onCollapsedChange,
      defaultCollapsed = false,
      width = "240px",
      collapsedWidth = "56px",
      ...props
    },
    ref,
  ) => {
    const [internalCollapsed, setInternalCollapsed] =
      useState(defaultCollapsed);
    const isControlled = controlledCollapsed !== undefined;
    const collapsed = isControlled ? controlledCollapsed : internalCollapsed;

    const setCollapsed = useCallback(
      (value: boolean) => {
        if (!isControlled) {
          setInternalCollapsed(value);
        }
        onCollapsedChange?.(value);
      },
      [isControlled, onCollapsedChange],
    );

    const contextValue = useMemo(
      () => ({ collapsed, setCollapsed }),
      [collapsed, setCollapsed],
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <nav
          ref={ref}
          aria-label="Sidebar navigation"
          className={cn(
            "flex h-full flex-col border-r-2 border-terminal-gridLine bg-terminal-background font-mono",
            className,
          )}
          style={{ width: collapsed ? collapsedWidth : width }}
          {...props}
        >
          {children}
        </nav>
      </SidebarContext.Provider>
    );
  },
);

Sidebar.displayName = "Sidebar";

export interface SidebarHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ children, className, ...props }, ref) => {
    const { collapsed } = useSidebar();
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center border-b border-terminal-gridLine px-2 py-1.5",
          collapsed && "justify-center",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

SidebarHeader.displayName = "SidebarHeader";

export interface SidebarContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarContent = forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex-1 overflow-y-auto py-1", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

SidebarContent.displayName = "SidebarContent";

export interface SidebarFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "border-t border-terminal-gridLine px-2 py-1.5",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

SidebarFooter.displayName = "SidebarFooter";

export interface SidebarGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ children, className, label, ...props }, ref) => {
    const { collapsed } = useSidebar();
    return (
      <div ref={ref} className={cn("py-1", className)} {...props}>
        {label && !collapsed && (
          <div
            className="px-2 py-0.5 text-xs uppercase tracking-wider text-terminal-brightBlack border-b border-terminal-gridLine/40 mb-0.5"
            aria-hidden="true"
          >
            {label}
          </div>
        )}
        {collapsed && label && (
          <div
            className="mx-auto my-1 text-terminal-gridLine"
            aria-hidden="true"
          >
            ─
          </div>
        )}
        <div className="space-y-0.5">{children}</div>
      </div>
    );
  },
);

SidebarGroup.displayName = "SidebarGroup";

export interface SidebarItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  active?: boolean;
  badge?: React.ReactNode;
  href?: string;
}

export const SidebarItem = forwardRef<HTMLButtonElement, SidebarItemProps>(
  ({ children, className, icon, active = false, badge, ...props }, ref) => {
    const { collapsed } = useSidebar();
    return (
      <button
        ref={ref}
        type="button"
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex w-full items-center gap-2 px-2 py-1 text-sm",
          "text-terminal-foreground hover:bg-terminal-accent hover:text-terminal-background",
          "focus:outline-none focus-visible:ring-1 focus-visible:ring-terminal-accent",
          active &&
            "bg-terminal-accent text-terminal-background border-r-2 border-terminal-accent",
          collapsed && "justify-center",
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
        {!collapsed && <span className="flex-1 text-left">{children}</span>}
        {!collapsed && badge && <span className="ml-auto">{badge}</span>}
      </button>
    );
  },
);

SidebarItem.displayName = "SidebarItem";

export interface SidebarToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SidebarToggle = forwardRef<HTMLButtonElement, SidebarToggleProps>(
  ({ className, ...props }, ref) => {
    const { collapsed, setCollapsed } = useSidebar();
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "flex h-6 w-6 items-center justify-center text-terminal-foreground",
          "hover:bg-terminal-accent hover:text-terminal-background",
          "focus:outline-none focus-visible:ring-1 focus-visible:ring-terminal-accent",
          className,
        )}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        {...props}
      >
        <span className="text-sm" aria-hidden="true">
          {collapsed ? "»" : "«"}
        </span>
      </button>
    );
  },
);

SidebarToggle.displayName = "SidebarToggle";

export { useSidebar };
