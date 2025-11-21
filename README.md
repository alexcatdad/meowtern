# Web TUI Library

An opinionated React component library for building responsive, accessible, terminal-like applications in the browser.

## Features

- **No Runtime Dependencies**: Built with React and Tailwind CSS.
- **Terminal Components**: `TerminalWindow`, `Input`, `Text`, `Box`.
- **Hooks**: `useTerminal`, `useKeyboard`.
- **Theming**: Built-in dark/light mode support.
- **A11y**: Accessible by default.
- **Extras**: Bell sound on error, pixelated image rendering.

## Getting Started

### Installation

This project uses [Bun](https://bun.sh).

```bash
bun install
```

### Development

To run the demo application:

```bash
bun run dev
```

### Building

To build the library and demo:

```bash
bun run build
```

### Testing

```bash
bun test
```

## Deployment

To deploy the demo to GitHub Pages:

1. Build the project: `bun run build`
2. Push the `dist` folder in `packages/demo` to a `gh-pages` branch.

Or use this GitHub Action workflow:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
      - uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: packages/demo/dist
```

## License

MIT
