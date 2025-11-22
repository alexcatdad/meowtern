import React from "react";
import { cn } from "../../utils/cn";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type AvatarStatus = "online" | "offline" | "away" | "busy";

const sizeClasses: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const statusColors: Record<AvatarStatus, string> = {
  online: "bg-terminal-green",
  offline: "bg-terminal-brightBlack",
  away: "bg-terminal-yellow",
  busy: "bg-terminal-red",
};

const statusSizes: Record<AvatarSize, string> = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
  xl: "h-4 w-4",
};

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  square?: boolean;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getColorFromName = (name: string): string => {
  const colors = [
    "bg-terminal-red",
    "bg-terminal-green",
    "bg-terminal-yellow",
    "bg-terminal-blue",
    "bg-terminal-magenta",
    "bg-terminal-cyan",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = "md",
  status,
  square = false,
  className,
  ...props
}) => {
  const showFallback = !src;
  const initials = name ? getInitials(name) : "?";
  const bgColor = name ? getColorFromName(name) : "bg-terminal-brightBlack";

  return (
    <div className={cn("relative inline-flex shrink-0", className)} {...props}>
      <div
        className={cn(
          "flex items-center justify-center overflow-hidden font-mono font-bold",
          "border border-terminal-gridLine",
          square ? "rounded-sm" : "rounded-full",
          sizeClasses[size],
          showFallback && bgColor,
          showFallback && "text-terminal-background",
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name || "Avatar"}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-2 ring-terminal-background",
            statusColors[status],
            statusSizes[size],
          )}
          aria-label={status}
        />
      )}
    </div>
  );
};

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: AvatarSize;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max = 4,
  size = "md",
  className,
  ...props
}) => {
  const childArray = React.Children.toArray(children);
  const visibleChildren = childArray.slice(0, max);
  const remainingCount = childArray.length - max;

  return (
    <div className={cn("flex -space-x-2", className)} {...props}>
      {visibleChildren.map((child, index) => (
        <div
          key={index}
          className="ring-2 ring-terminal-background rounded-full"
          style={{ zIndex: visibleChildren.length - index }}
        >
          {React.isValidElement<AvatarProps>(child)
            ? React.cloneElement(child, { size })
            : child}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full font-mono font-bold",
            "bg-terminal-brightBlack text-terminal-foreground",
            "border border-terminal-gridLine",
            sizeClasses[size],
          )}
          style={{ zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
