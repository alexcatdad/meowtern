import React, { forwardRef, useMemo, useState } from "react";
import { cn } from "../../utils/cn";
import {
  type ComponentSize,
  type StatusType,
  avatarColors,
  sizeClasses,
  statusColors,
  statusIndicatorSizes,
  statusLabels,
} from "../../styles/sizeClasses";

type AvatarSize = ComponentSize;
type AvatarStatus = StatusType;

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  square?: boolean;
}

const getInitials = (name: string): string => {
  if (!name || name.trim().length === 0) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getColorFromName = (name: string): string => {
  if (!name) return "bg-terminal-brightBlack";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      size = "md",
      status,
      square = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [imgError, setImgError] = useState(false);
    const showFallback = !src || imgError;
    const initials = name ? getInitials(name) : "?";
    const bgColor = useMemo(
      () => (name ? getColorFromName(name) : "bg-terminal-brightBlack"),
      [name],
    );

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex shrink-0", className)}
        {...props}
      >
        <div
          className={cn(
            "flex items-center justify-center overflow-hidden font-mono font-bold",
            "border border-terminal-gridLine",
            square ? "rounded-sm" : "rounded-full",
            sizeClasses[size],
            showFallback && bgColor,
            showFallback && "text-terminal-background",
          )}
          role="img"
          aria-label={alt || name || "Avatar"}
        >
          {src && !imgError ? (
            <img
              src={src}
              alt={alt || name || "Avatar"}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span aria-hidden="true">{initials}</span>
          )}
        </div>
        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 rounded-full ring-2 ring-terminal-background",
              statusColors[status],
              statusIndicatorSizes[size],
            )}
            role="status"
            aria-label={statusLabels[status]}
          />
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: AvatarSize;
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ children, max = 4, size = "md", className, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const effectiveMax = Math.max(1, max);
    const visibleChildren = childArray.slice(0, effectiveMax);
    const remainingCount = Math.max(0, childArray.length - effectiveMax);

    return (
      <div ref={ref} className={cn("flex -space-x-2", className)} {...props}>
        {visibleChildren.map((child, index) => (
          <div
            key={index}
            className="rounded-full ring-2 ring-terminal-background"
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
            role="img"
            aria-label={`${remainingCount} more`}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    );
  },
);

AvatarGroup.displayName = "AvatarGroup";
