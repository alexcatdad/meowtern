import Prism from "prismjs";
import type { Token } from "prismjs";
import { forwardRef, useMemo } from "react";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-diff";

export interface SyntaxHighlightProps
  extends React.HTMLAttributes<HTMLElement> {
  code: string;
  language?: string;
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

const renderToken = (token: string | Token, key: string): ReactNode => {
  if (typeof token === "string") {
    return (
      <span key={key} className="text-terminal-foreground">
        {token}
      </span>
    );
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

  const content = Array.isArray(token.content)
    ? token.content.map((item: string | Token, index: number) =>
        renderToken(item, `${key}-${token.type}-${index}`),
      )
    : typeof token.content === "string"
      ? token.content
      : renderToken(token.content, `${key}-${token.type}-0`);

  return (
    <span key={key} className={classNames.join(" ")}>
      {content}
    </span>
  );
};

export const SyntaxHighlight = forwardRef<HTMLPreElement, SyntaxHighlightProps>(
  ({ code, className, language = "ts", ...props }, ref) => {
    const tokens = useMemo<TokenStream>(() => {
      const normalized = normalizeLanguage(language);
      const grammar =
        Prism.languages[normalized] ??
        Prism.languages.typescript ??
        Prism.languages.javascript;
      if (!grammar) return [code];
      return Prism.tokenize(code, grammar);
    }, [code, language]);

    return (
      <pre
        ref={ref}
        className={cn(
          "overflow-auto rounded-terminal bg-terminal-black/80 p-3 font-mono text-sm leading-6 text-terminal-foreground antialiased",
          "whitespace-pre-wrap",
          className,
        )}
        data-language={language}
        style={{ fontVariantLigatures: "none" }}
        {...props}
      >
        <code>{tokens.map((token, index) => renderToken(token, `token-${index}`))}</code>
      </pre>
    );
  },
);

SyntaxHighlight.displayName = "SyntaxHighlight";
