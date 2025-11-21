import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Prism from "prismjs";
import type { Token } from "prismjs";
import { cn } from "../../utils/cn";
import { LineNumbers } from "./LineNumbers";

import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-diff";

export interface TextEditorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  showHighlight?: boolean;
}

const aliasMap: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  tsx: "tsx",
  jsx: "jsx",
  sh: "bash",
  shell: "bash",
  md: "markdown",
};

const tokenClasses: Record<string, string> = {
  comment: "text-terminal-brightBlack",
  prolog: "text-terminal-brightBlack",
  doctype: "text-terminal-brightBlack",
  cdata: "text-terminal-brightBlack",
  punctuation: "text-terminal-brightBlack",
  property: "text-terminal-green",
  tag: "text-terminal-magenta",
  boolean: "text-terminal-warning",
  number: "text-terminal-warning",
  constant: "text-terminal-warning",
  symbol: "text-terminal-warning",
  deleted: "text-terminal-danger",
  inserted: "text-terminal-success",
  string: "text-terminal-yellow",
  char: "text-terminal-yellow",
  builtin: "text-terminal-cyan",
  operator: "text-terminal-cyan",
  entity: "text-terminal-cyan",
  url: "text-terminal-cyan",
  variable: "text-terminal-magenta",
  atrule: "text-terminal-cyan",
  attrValue: "text-terminal-yellow",
  function: "text-terminal-green",
  className: "text-terminal-blue",
  keyword: "text-terminal-cyan",
  regex: "text-terminal-warning",
  important: "text-terminal-danger",
};

const normalizeLanguage = (language?: string) => {
  if (!language) return "typescript";
  const normalized = language.toLowerCase();
  return aliasMap[normalized] ?? normalized;
};

const ensureTsxLanguage = () => {
  if (Prism.languages.tsx) return;
  const typescript = Prism.languages.typescript;
  const jsx = Prism.languages.jsx;
  if (!typescript || !jsx) {
    return;
  }

  const clonedTypescript = Prism.util.clone(typescript);
  Prism.languages.tsx = Prism.languages.extend("jsx", clonedTypescript);

  const tsxGrammar = Prism.languages
    .tsx as typeof Prism.languages.tsx & Record<string, unknown>;
  delete tsxGrammar.parameter;
  delete tsxGrammar["literal-property"];

  const tagToken = tsxGrammar.tag as
    | (Token & { pattern?: RegExp; lookbehind?: boolean })
    | undefined;
  if (tagToken && tagToken.pattern) {
    tagToken.pattern = new RegExp(
      /(^|[^\w$]|(?=<\/))/.source + "(?:" + tagToken.pattern.source + ")",
      tagToken.pattern.flags,
    );
    tagToken.lookbehind = true;
  }
};

ensureTsxLanguage();

type TokenStream = Array<string | Token>;

export const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  language = "ts",
  showHighlight = true,
  className,
  ...props
}) => {
  const [cursor, setCursor] = useState({ line: 1, column: 1 });
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  const lines = useMemo(() => value.split("\n").length, [value]);

  const tokens = useMemo<TokenStream>(() => {
    if (!showHighlight) return [value];
    const normalized = normalizeLanguage(language);
    const grammar =
      Prism.languages[normalized] ??
      Prism.languages.typescript ??
      Prism.languages.javascript;
    if (!grammar) return [value];
    return Prism.tokenize(value, grammar);
  }, [value, language, showHighlight]);

  // Update cursor position
  const updateCursor = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(editorRef.current!);
    preCaretRange.setEnd(range.endContainer, range.endOffset);

    const textBefore = preCaretRange.toString();
    const line = textBefore.split("\n").length;
    const column = textBefore.length - textBefore.lastIndexOf("\n");
    setCursor({ line, column });
  };

  // Get plain text from contentEditable
  const getPlainText = (element: HTMLElement): string => {
    return element.innerText || element.textContent || "";
  };

  // Handle input events
  const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
    if (isUpdatingRef.current) return;

    const element = event.currentTarget;
    const newValue = getPlainText(element);
    onChange(newValue);
    updateCursor();
  };

  // Handle paste to strip formatting
  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);

    const element = event.currentTarget;
    const newValue = getPlainText(element);
    onChange(newValue);
    updateCursor();
  };

  // Handle key events to prevent unwanted behaviors
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Allow Tab to insert tab character instead of losing focus
    if (event.key === "Tab") {
      event.preventDefault();
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      const tabNode = document.createTextNode("  "); // 2 spaces for tab
      range.insertNode(tabNode);
      range.setStartAfter(tabNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      const element = event.currentTarget;
      const newValue = getPlainText(element);
      onChange(newValue);
      updateCursor();
    }
  };

  // Render token to DOM element
  const renderTokenToElement = (
    token: string | Token,
    container: HTMLElement,
  ): void => {
    if (typeof token === "string") {
      const textNode = document.createTextNode(token);
      container.appendChild(textNode);
      return;
    }

    const aliases = token.alias
      ? Array.isArray(token.alias)
        ? token.alias
        : [token.alias]
      : [];

    const classNames = [
      tokenClasses[token.type] ?? "text-terminal-foreground",
      ...aliases
        .map((alias: string) => tokenClasses[alias] ?? "")
        .filter((value: string) => value.length > 0),
    ];

    const span = document.createElement("span");
    span.className = classNames.join(" ");

    if (Array.isArray(token.content)) {
      token.content.forEach((item) => renderTokenToElement(item, span));
    } else if (typeof token.content === "string") {
      span.textContent = token.content;
    } else {
      renderTokenToElement(token.content, span);
    }

    container.appendChild(span);
  };

  // Update contentEditable when value changes externally
  useEffect(() => {
    if (!editorRef.current) return;
    const currentText = getPlainText(editorRef.current);
    if (currentText !== value) {
      isUpdatingRef.current = true;
      const selection = window.getSelection();
      const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;
      const cursorOffset = range
        ? getCursorOffset(editorRef.current, range)
        : value.length;

      // Update the content
      editorRef.current.innerHTML = "";
      if (showHighlight) {
        tokens.forEach((token) => {
          renderTokenToElement(token, editorRef.current!);
        });
      } else {
        editorRef.current.textContent = value;
      }

      // Restore cursor position
      restoreCursorPosition(editorRef.current, cursorOffset);
      isUpdatingRef.current = false;
      updateCursor();
    }
  }, [value, tokens, showHighlight]);

  // Get cursor offset as character count
  const getCursorOffset = (
    element: HTMLElement,
    range: Range,
  ): number => {
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
  };

  // Restore cursor position
  const restoreCursorPosition = (
    element: HTMLElement,
    offset: number,
  ): void => {
    const selection = window.getSelection();
    if (!selection) return;

    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
    );
    let charCount = 0;
    let targetNode: Node | null = null;
    let targetOffset = 0;

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const nodeLength = node.textContent?.length ?? 0;
      if (charCount + nodeLength >= offset) {
        targetNode = node;
        targetOffset = offset - charCount;
        break;
      }
      charCount += nodeLength;
    }

    if (targetNode) {
      const newRange = document.createRange();
      newRange.setStart(
        targetNode,
        Math.min(targetOffset, targetNode.textContent?.length ?? 0),
      );
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      // Fallback: place cursor at end
      const newRange = document.createRange();
      newRange.selectNodeContents(element);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  };

  // Handle selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      if (isUpdatingRef.current) return;
      updateCursor();
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  return (
    <div
      className={cn(
        "flex rounded-terminal border border-terminal-gridLine/60 bg-terminal-panel font-mono text-sm text-terminal-foreground",
        className,
      )}
      {...props}
    >
      <LineNumbers
        lineCount={lines}
        currentLine={cursor.line}
        className="min-w-[3rem]"
      />
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onSelect={updateCursor}
        className="flex-1 overflow-auto px-3 py-2 font-mono text-sm leading-6 antialiased outline-none caret-terminal-foreground selection:bg-terminal-cyan/20"
        style={{ fontVariantLigatures: "none" }}
        spellCheck={false}
        suppressContentEditableWarning
      />
    </div>
  );
};
