import { useEffect, useRef } from "react";

type Callback = (delta: number) => void;

export const useAnimationFrame = (
  callback: Callback,
  options: { enabled?: boolean } = {},
) => {
  const { enabled = true } = options;
  const frameRef = useRef<number | undefined>(undefined);
  const prevTimeRef = useRef<number | undefined>(undefined);
  const callbackRef = useRef<Callback>(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;

    const tick = (time: number) => {
      const prev = prevTimeRef.current ?? time;
      callbackRef.current(time - prev);
      prevTimeRef.current = time;
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      prevTimeRef.current = undefined;
    };
  }, [enabled]);
};
