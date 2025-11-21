export interface AnsiSegment {
  text: string;
  className: string;
}

const colorMap: Record<number, string> = {
  30: "text-terminal-black",
  31: "text-terminal-red",
  32: "text-terminal-green",
  33: "text-terminal-yellow",
  34: "text-terminal-blue",
  35: "text-terminal-magenta",
  36: "text-terminal-cyan",
  37: "text-terminal-white",
  90: "text-terminal-brightBlack",
  91: "text-terminal-brightRed",
  92: "text-terminal-brightGreen",
  93: "text-terminal-brightYellow",
  94: "text-terminal-brightBlue",
  95: "text-terminal-brightMagenta",
  96: "text-terminal-brightCyan",
  97: "text-terminal-brightWhite",
};

export const parseAnsi = (input: string): AnsiSegment[] => {
  const segments: AnsiSegment[] = [];
  // biome-ignore lint/suspicious/noControlCharactersInRegex: ANSI escape detection requires ESC
  const regex = /\u001b\[(\d+)m/g;
  let lastIndex = 0;
  let currentClass = "";
  let match: RegExpExecArray | null = regex.exec(input);
  while (match) {
    if (match.index > lastIndex) {
      segments.push({
        text: input.slice(lastIndex, match.index),
        className: currentClass,
      });
    }

    const code = Number(match[1]);
    if (code === 0) {
      currentClass = "";
    } else if (code === 1) {
      currentClass = `${currentClass} font-bold`.trim();
    } else if (colorMap[code]) {
      currentClass = colorMap[code];
    }

    lastIndex = regex.lastIndex;
    match = regex.exec(input);
  }

  if (lastIndex < input.length) {
    segments.push({
      text: input.slice(lastIndex),
      className: currentClass,
    });
  }

  return segments.filter((segment) => segment.text.length > 0);
};
