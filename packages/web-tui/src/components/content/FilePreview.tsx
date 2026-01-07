import type React from "react";
import { cn } from "../../utils/cn";
import { Surface } from "../primitives/Surface";

export interface FilePreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  path?: string;
  language?: string;
  content?: string;
  metadata?: Record<string, string>;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  className,
  name,
  path,
  language,
  content,
  metadata = {},
  ...props
}) => {
  return (
    <Surface
      variant="sunken"
      className={cn("flex h-full flex-col gap-3", className)}
      {...props}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-wide text-terminal-brightBlack">
        <div>
          <span className="text-terminal-foreground">{name}</span>
          {path && (
            <span className="ml-2 text-terminal-brightBlack">({path})</span>
          )}
        </div>
        {language && <span>{language}</span>}
      </div>
      {Object.keys(metadata).length > 0 && (
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          {Object.entries(metadata).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-terminal-brightBlack">{key}</span>
              <span className="text-terminal-foreground">{value}</span>
            </div>
          ))}
        </div>
      )}
      <pre className="flex-1 overflow-auto rounded-terminal border border-terminal-gridLine/50 bg-terminal-black/80 p-3 text-xs text-terminal-foreground">
        {content ?? "// Select a file to preview"}
      </pre>
    </Surface>
  );
};
