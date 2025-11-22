import type React from "react";
import { createContext, useContext, useState } from "react";
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

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  className,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  defaultCollapsed = false,
  width = "240px",
  collapsedWidth = "56px",
  ...props
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isControlled = controlledCollapsed !== undefined;
  const collapsed = isControlled ? controlledCollapsed : internalCollapsed;

  const setCollapsed = (value: boolean) => {
    if (!isControlled) {
      setInternalCollapsed(value);
    }
    onCollapsedChange?.(value);
  };

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <aside
        className={cn(
          "flex h-full flex-col border-r border-terminal-gridLine bg-terminal-background font-mono transition-all duration-200",
          className,
        )}
        style={{ width: collapsed ? collapsedWidth : width }}
        {...props}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  );
};

export interface SidebarHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  children,
  className,
  ...props
}) => {
  const { collapsed } = useSidebar();
  return (
    <div
      className={cn(
        "flex items-center border-b border-terminal-gridLine px-3 py-3",
        collapsed && "justify-center px-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface SidebarContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("flex-1 overflow-y-auto py-2", className)} {...props}>
      {children}
    </div>
  );
};

export interface SidebarFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  children,
  className,
  ...props
}) => {
  const { collapsed } = useSidebar();
  return (
    <div
      className={cn(
        "border-t border-terminal-gridLine px-3 py-3",
        collapsed && "px-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface SidebarGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export const SidebarGroup: React.FC<SidebarGroupProps> = ({
  children,
  className,
  label,
  ...props
}) => {
  const { collapsed } = useSidebar();
  return (
    <div className={cn("py-2", className)} {...props}>
      {label && !collapsed && (
        <div className="px-3 py-1 text-xs uppercase tracking-wider text-terminal-brightBlack">
          {label}
        </div>
      )}
      {collapsed && label && (
        <div className="mx-auto my-1 h-px w-6 bg-terminal-gridLine" />
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
};

export interface SidebarItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  active?: boolean;
  badge?: React.ReactNode;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  children,
  className,
  icon,
  active = false,
  badge,
  ...props
}) => {
  const { collapsed } = useSidebar();
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors",
        "text-terminal-foreground hover:bg-terminal-brightBlack/20 hover:text-terminal-brightWhite",
        "focus:outline-none focus-visible:ring-1 focus-visible:ring-terminal-accent",
        active &&
          "bg-terminal-accent/10 text-terminal-accent border-r-2 border-terminal-accent",
        collapsed && "justify-center px-2",
        className,
      )}
      {...props}
    >
      {icon && (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
          {icon}
        </span>
      )}
      {!collapsed && <span className="flex-1 text-left">{children}</span>}
      {!collapsed && badge && <span className="ml-auto">{badge}</span>}
    </button>
  );
};

export interface SidebarToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SidebarToggle: React.FC<SidebarToggleProps> = ({
  className,
  ...props
}) => {
  const { collapsed, setCollapsed } = useSidebar();
  return (
    <button
      type="button"
      onClick={() => setCollapsed(!collapsed)}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded text-terminal-foreground",
        "hover:bg-terminal-brightBlack/20 hover:text-terminal-brightWhite",
        "focus:outline-none focus-visible:ring-1 focus-visible:ring-terminal-accent",
        className,
      )}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      {...props}
    >
      <span className="text-sm">{collapsed ? "»" : "«"}</span>
    </button>
  );
};

export { useSidebar };
