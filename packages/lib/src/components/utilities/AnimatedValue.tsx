import type React from "react";
import { useEffect, useRef, useState } from "react";

export interface AnimatedValueProps {
  value: number;
  duration?: number;
  format?: (value: number) => string;
}

export const AnimatedValue: React.FC<AnimatedValueProps> = ({
  value,
  duration = 400,
  format = (input) => input.toFixed(0),
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const startRef = useRef<number | undefined>(undefined);
  const initialRef = useRef(value);
  const latestDisplayRef = useRef(value);

  useEffect(() => {
    latestDisplayRef.current = displayValue;
  }, [displayValue]);

  /* c8 ignore start */
  useEffect(() => {
    initialRef.current = latestDisplayRef.current;
    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - (startRef.current ?? now);
      const progress = Math.min(elapsed / duration, 1);
      const next = initialRef.current + (value - initialRef.current) * progress;
      setDisplayValue(next);
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [duration, value]);
  /* c8 ignore end */

  return <span>{format(displayValue)}</span>;
};
