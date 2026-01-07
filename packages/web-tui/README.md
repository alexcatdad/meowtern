# web-tui

A framework-agnostic terminal UI component library. Build terminal-like interfaces with pure CSS classes, similar to DaisyUI.

## Installation

```bash
npm install web-tui
# or
bun add web-tui
```

## Usage Options

### Option 1: Pure CSS (No Framework)

Import the CSS file directly:

```html
<link rel="stylesheet" href="node_modules/web-tui/src/css/web-tui.css">
```

Or in your CSS/JS:

```css
@import 'web-tui/css';
```

Then use the classes in your HTML:

```html
<div class="tui-window">
  <div class="tui-window-header">
    <div class="tui-window-controls">
      <button class="tui-window-control tui-window-control-close"></button>
      <button class="tui-window-control tui-window-control-minimize"></button>
      <button class="tui-window-control tui-window-control-maximize"></button>
    </div>
    <span class="tui-window-title">Terminal</span>
  </div>
  <div class="tui-window-body">
    <p class="tui-text">Hello, World!</p>
  </div>
</div>
```

### Option 2: Tailwind Plugin

Add the plugin to your `tailwind.config.js`:

```js
module.exports = {
  plugins: [
    require('web-tui/plugin')
  ]
}
```

This gives you:
- All `.tui-*` component classes
- `terminal-*` color utilities (e.g., `text-terminal-cyan`, `bg-terminal-panel`)
- CSS custom properties for theming
- Extended theme with terminal-specific values

### Option 3: React Components

```jsx
import { TerminalWindow, Box, Text, Button } from 'web-tui/react';

function App() {
  return (
    <TerminalWindow title="My App">
      <Box bordered title="Welcome">
        <Text variant="success">Hello, World!</Text>
        <Button variant="primary">Click Me</Button>
      </Box>
    </TerminalWindow>
  );
}
```

### Option 4: Vanilla JS Utilities

For interactive components, import the minimal JS utilities:

```js
import { initTabs, initDialog, initMenu, initTheme } from 'web-tui/js';

// Initialize tabs
const tabs = initTabs('.my-tabs');
tabs.activate('tab-2');

// Initialize dialog
const dialog = initDialog('.my-dialog');
document.querySelector('#open-btn').onclick = () => dialog.open();

// Initialize theme
const theme = initTheme({ defaultTheme: 'dark' });
theme.setTheme('matrix-green');
```

Or use auto-initialization:

```html
<body data-tui-auto-init>
  <div class="tui-tabs" data-auto-init>
    <!-- tabs content -->
  </div>
</body>
```

## Component Classes

### Layout

| Class | Description |
|-------|-------------|
| `.tui-window` | Terminal window container |
| `.tui-window-header` | Window title bar |
| `.tui-window-body` | Window content area |
| `.tui-box` | Basic container |
| `.tui-box-bordered` | Container with border |
| `.tui-surface` | Styled surface with gradient |
| `.tui-surface-sunken` | Inset surface |
| `.tui-surface-raised` | Elevated surface |
| `.tui-surface-crt` | CRT monitor effect |
| `.tui-grid` | Grid container |
| `.tui-grid-2` / `.tui-grid-3` / `.tui-grid-4` | Column grids |
| `.tui-sidebar` | Sidebar navigation |

### Text & Typography

| Class | Description |
|-------|-------------|
| `.tui-text` | Base text style |
| `.tui-text-dim` | Dimmed text |
| `.tui-text-bold` | Bold text |
| `.tui-text-error` | Error (red) text |
| `.tui-text-success` | Success (green) text |
| `.tui-text-warning` | Warning (yellow) text |
| `.tui-text-info` | Info (blue) text |
| `.tui-code` | Inline code |
| `.tui-pre` | Code block |

### Buttons

| Class | Description |
|-------|-------------|
| `.tui-btn` | Base button |
| `.tui-btn-primary` | Primary button (accent color) |
| `.tui-btn-secondary` | Secondary button (outlined) |
| `.tui-btn-danger` | Danger button (red) |
| `.tui-btn-success` | Success button (green) |
| `.tui-btn-ghost` | Ghost button (transparent) |
| `.tui-btn-sm` / `.tui-btn-lg` | Size variants |

### Forms

| Class | Description |
|-------|-------------|
| `.tui-input` | Input container |
| `.tui-input-field` | Input field |
| `.tui-input-prefix` | Input prefix (e.g., `$`) |

### Data Display

| Class | Description |
|-------|-------------|
| `.tui-table` | Data table |
| `.tui-table-striped` | Striped rows |
| `.tui-badge` | Badge/tag |
| `.tui-badge-success` / `-warning` / `-danger` / `-info` | Badge variants |
| `.tui-progress` | Progress bar container |
| `.tui-progress-bar` | Progress bar fill |
| `.tui-stat` | Stat card |
| `.tui-kv` | Key-value list |

### Navigation

| Class | Description |
|-------|-------------|
| `.tui-tabs` | Tabs container |
| `.tui-tabs-list` | Tab buttons container |
| `.tui-tab` | Tab button |
| `.tui-tab-panel` | Tab content panel |
| `.tui-breadcrumb` | Breadcrumb navigation |
| `.tui-menu` | Dropdown menu |
| `.tui-pagination` | Pagination controls |
| `.tui-fnbar` | Function key bar |
| `.tui-statusbar` | Status bar |

### Overlays

| Class | Description |
|-------|-------------|
| `.tui-dialog` | Dialog/modal backdrop |
| `.tui-dialog-content` | Dialog content |
| `.tui-tooltip` | Tooltip wrapper |
| `.tui-palette` | Command palette |

### Utilities

| Class | Description |
|-------|-------------|
| `.tui-scroll` | Styled scrollbar |
| `.tui-separator` | Horizontal separator |
| `.tui-separator-vertical` | Vertical separator |
| `.tui-spinner` | Loading spinner |
| `.tui-avatar` | Avatar circle |
| `.tui-glow` | Glow effect |
| `.tui-pixelated` | Pixelated rendering |

## Theming

### Using Data Attributes

Set the theme on any parent element:

```html
<body data-theme="dark">
  <!-- dark theme -->
</body>

<body data-theme="matrix-green">
  <!-- matrix green theme -->
</body>
```

### Available Themes

- `dark` (default)
- `light`
- `btop-classic`
- `polar-night`
- `retro-amber`
- `matrix-green`
- `red-alert`

### Custom Themes

Override CSS custom properties:

```css
[data-theme="my-theme"] {
  --tui-bg: #1a1a2e;
  --tui-fg: #eaeaea;
  --tui-accent: #00ff88;
  --tui-panel: #16213e;
  --tui-grid-line: rgba(255, 255, 255, 0.1);
  /* ... other variables */
}
```

### CSS Custom Properties

| Variable | Description |
|----------|-------------|
| `--tui-bg` | Background color |
| `--tui-fg` | Foreground/text color |
| `--tui-accent` | Accent color (cyan by default) |
| `--tui-panel` | Panel/card background |
| `--tui-grid-line` | Border/grid line color |
| `--tui-success` | Success color (green) |
| `--tui-warning` | Warning color (yellow) |
| `--tui-danger` | Danger color (red) |
| `--tui-info` | Info color (blue) |
| `--tui-radius` | Border radius |
| `--tui-font-mono` | Monospace font stack |

## Interactive States

Use data attributes for interactive states:

```html
<!-- Active tab -->
<button class="tui-tab" data-active="true">Active</button>

<!-- Open dialog -->
<div class="tui-dialog" data-open="true">...</div>

<!-- Open menu -->
<div class="tui-menu" data-open="true">...</div>

<!-- Collapsed sidebar -->
<div class="tui-sidebar" data-collapsed="true">...</div>
```

Or use the `.active`, `.open`, `.collapsed` classes.

## Browser Support

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

## License

MIT
