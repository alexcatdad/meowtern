import { type RefObject, useCallback, useEffect, useState } from "react";

export const useAutoScroll = (
  ref: RefObject<HTMLElement>,
  options: { stickToBottom?: boolean; threshold?: number } = {},
) => {
  const { stickToBottom = true, threshold = 4 } = options;
  const [isPinned, setIsPinned] = useState(true);

  const scrollToBottom = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [ref]);

  useEffect(() => {
    if (!stickToBottom) return;
    const node = ref.current;
    if (!node) return;

    const handleScroll = () => {
      const distance = node.scrollHeight - node.scrollTop - node.clientHeight;
      setIsPinned(distance <= threshold);
    };

    node.addEventListener("scroll", handleScroll, { passive: true });
    return () => node.removeEventListener("scroll", handleScroll);
  }, [ref, stickToBottom, threshold]);

  useEffect(() => {
    if (!stickToBottom) return;
    const node = ref.current;
    if (!node) return;
    const observer = new MutationObserver(() => {
      if (isPinned) scrollToBottom();
    });
    observer.observe(node, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [isPinned, ref, scrollToBottom, stickToBottom]);

  useEffect(() => {
    if (stickToBottom) {
      scrollToBottom();
    }
  }, [scrollToBottom, stickToBottom]);

  return {
    isPinned,
    scrollToBottom,
    pinToBottom: () => setIsPinned(true),
  };
};
