import type React from "react";
import { cn } from "../utils/cn";

export interface PixelatedImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  grayscale?: boolean;
  contrast?: number;
  brightness?: number;
}

export const PixelatedImage: React.FC<PixelatedImageProps> = ({
  className,
  style,
  grayscale = false,
  contrast = 1.2,
  brightness = 1.1,
  ...props
}) => {
  return (
    // biome-ignore lint/a11y/useAltText: Alt is provided via props or fallback
    <img
      className={cn("image-pixelated", className)}
      style={{
        imageRendering: "pixelated",
        filter: `
          ${grayscale ? "grayscale(100%)" : ""} 
          contrast(${contrast}) 
          brightness(${brightness})
        `,
        ...style,
      }}
      alt={props.alt ?? "pixelated content"}
      {...props}
    />
  );
};
