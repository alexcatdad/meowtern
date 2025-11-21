# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React component library for building terminal-like UIs in the browser. This is a **monorepo** using Bun workspaces with two packages:
- `packages/lib`: The core library package (`web-tui`)
- `packages/demo`: A Vite-based demo application showcasing the library

## Development Commands

### Core Commands
```bash
bun install          # Install dependencies
bun run dev          # Run demo app in development mode
bun run build        # Build all packages (lib + demo)
bun test             # Run all tests using Bun's test runner
bun run lint         # Lint code with Biome
bun run format       # Format code with Biome
```

### Package-Specific Commands
```bash
# From packages/lib/
bun test             # Run library tests only

# From packages/demo/
bun run dev          # Run Vite dev server
bun run build        # Build demo (runs TypeScript check + Vite build)
bun run preview      # Preview production build
```

## Architecture

### Monorepo Structure
- Uses Bun workspaces defined in root `package.json`
- `packages/lib` exports components via `src/index.ts`
- `packages/demo` references the library via `workspace:*`
- Both packages have their own Tailwind configs and process CSS independently

### Context & Theming
The library uses React Context for global terminal state:
- `TerminalProvider` must wrap the application root
- Provides `useTerminal()` hook for theme access (`dark` | `light`)
- Automatically applies the `dark` class to `document.documentElement` for Tailwind's dark mode
- Theme colors are defined in `packages/lib/tailwind.config.js` under the `terminal.*` namespace

### Component Design Pattern
All components follow this pattern:
- Extend base HTML element props (e.g., `React.HTMLAttributes<HTMLDivElement>`)
- Accept a `className` prop that gets merged via the `cn()` utility
- Support an optional `as` prop for polymorphic rendering (e.g., render a `Box` as a different element)
- Use the `cn()` utility (from `Text.tsx`) which combines `clsx` and `tailwind-merge` for conditional class merging

### Key Components
- `TerminalWindow`: Main container with title bar and window controls
- `Box`: Flexible container with optional border, flexbox props, and title
- `Input`: Terminal input with prefix, enter handler, and bell sound on backspace
- `Text`: Styled text with variants (default, dim, bold, error, success, warning, info)
- `Header`/`Footer`: Layout components for terminal window structure
- `Button`: Styled button with size and variant props
- `PixelatedImage`: Image component with CSS for pixelated rendering

### Hooks
- `useTerminal()`: Access theme state (must be inside `TerminalProvider`)
- `useKeyboard(handlers)`: Register keyboard shortcuts with combo support (e.g., `"ctrl+c"`, `"ctrl+l"`)

### Testing
- Uses Bun's built-in test runner
- Testing setup in `packages/lib/bunfig.toml` preloads `setupTests.ts`
- Uses `@happy-dom/global-registrator` for DOM simulation
- `@testing-library/react` and `@testing-library/jest-dom` for component testing

### Styling with Tailwind
- Custom terminal color palette (16 ANSI colors + background/foreground)
- Colors follow the pattern: `terminal-{color}` (e.g., `terminal-green`, `terminal-brightBlack`)
- All components use monospace fonts via Tailwind's `font-mono` class
- Dark mode is class-based (controlled by `TerminalProvider`)

### Code Quality
- **Linter**: Biome (not ESLint/Prettier)
- **Formatter**: Biome with 2-space indents, double quotes
- Run `bun run lint` before committing
- Biome config at root: `biome.json`

## Important Notes

- All components are **client-side only** (React 18+ with hooks)
- The library has **peer dependencies** on `react` and `react-dom` (not bundled)
- Audio bell uses Web Audio API (`playBell()` in `Input.tsx`)
- TypeScript is configured with strict mode and ESNext target
- Do not emit compiled files (`noEmit: true` in tsconfig)
