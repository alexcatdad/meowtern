import type React from "react";
import { cn } from "../../utils/cn";
import { Surface } from "../primitives/Surface";

export interface KeyValueItem {
  key: string;
  value: React.ReactNode;
}

export interface KeyValueListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items: KeyValueItem[];
  columns?: number;
}

export const KeyValueList: React.FC<KeyValueListProps> = ({
  className,
  items,
  columns = 2,
  ...props
}) => {
  return (
    <Surface
      variant="sunken"
      className={cn("font-mono text-xs", className)}
      {...props}
    >
      <dl
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {items.map((item) => (
          <div
            key={item.key}
            className="flex flex-col gap-1 border-l-2 border-terminal-gridLine/60 pl-3"
          >
            <dt className="text-terminal-brightBlack uppercase tracking-wide">
              {item.key}
            </dt>
            <dd className="text-terminal-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>
    </Surface>
  );
};
