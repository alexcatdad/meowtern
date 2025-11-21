import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface TerminalContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(
  undefined,
);

export const TerminalProvider: React.FC<{
  children: React.ReactNode;
  defaultTheme?: Theme;
}> = ({ children, defaultTheme = "dark" }) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    // Apply theme class to body or root element if needed,
    // but primarily this context drives component styles.
    // For Tailwind dark mode, we might need to add 'dark' class to html/body
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <TerminalContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div
        className={`web-tui-root ${theme} min-h-screen bg-terminal-background text-terminal-foreground font-mono selection:bg-terminal-brightBlack selection:text-terminal-white`}
      >
        {children}
      </div>
    </TerminalContext.Provider>
  );
};

export const useTerminal = () => {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error("useTerminal must be used within a TerminalProvider");
  }
  return context;
};
