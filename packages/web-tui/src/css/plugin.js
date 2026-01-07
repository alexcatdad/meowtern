/**
 * web-tui Tailwind CSS Plugin
 * Framework-agnostic terminal UI components
 *
 * Usage:
 *   // tailwind.config.js
 *   module.exports = {
 *     plugins: [require('web-tui/plugin')],
 *   }
 */

const plugin = require("tailwindcss/plugin");

const terminalColors = {
  // ANSI 16 colors
  black: "#03040a",
  red: "#ff5c7c",
  green: "#5bff8e",
  yellow: "#ffcb6b",
  blue: "#68d1ff",
  magenta: "#ff8cc1",
  cyan: "#15f1ff",
  white: "#f7f6fb",
  brightBlack: "#2f3247",
  brightRed: "#ff7894",
  brightGreen: "#80ffa9",
  brightYellow: "#ffe08f",
  brightBlue: "#8bdcff",
  brightMagenta: "#ff9fd2",
  brightCyan: "#5cfff5",
  brightWhite: "#ffffff",
  // Semantic colors
  accent: "#15f1ff",
  accentMuted: "#00a5bb",
  success: "#7bff69",
  warning: "#ffcb6b",
  danger: "#ff5c7c",
  info: "#68d1ff",
  // Layout colors
  background: "#03040a",
  foreground: "#f7f6fb",
  panel: "#080b18",
  overlay: "rgba(3,4,10,0.92)",
  gridLine: "rgba(255,255,255,0.08)",
};

module.exports = plugin(
  function ({ addBase, addComponents, addUtilities, theme }) {
    // Add CSS custom properties for theming
    addBase({
      ":root, [data-theme='dark']": {
        "--tui-black": terminalColors.black,
        "--tui-red": terminalColors.red,
        "--tui-green": terminalColors.green,
        "--tui-yellow": terminalColors.yellow,
        "--tui-blue": terminalColors.blue,
        "--tui-magenta": terminalColors.magenta,
        "--tui-cyan": terminalColors.cyan,
        "--tui-white": terminalColors.white,
        "--tui-bright-black": terminalColors.brightBlack,
        "--tui-bright-red": terminalColors.brightRed,
        "--tui-bright-green": terminalColors.brightGreen,
        "--tui-bright-yellow": terminalColors.brightYellow,
        "--tui-bright-blue": terminalColors.brightBlue,
        "--tui-bright-magenta": terminalColors.brightMagenta,
        "--tui-bright-cyan": terminalColors.brightCyan,
        "--tui-bright-white": terminalColors.brightWhite,
        "--tui-accent": terminalColors.accent,
        "--tui-accent-muted": terminalColors.accentMuted,
        "--tui-success": terminalColors.success,
        "--tui-warning": terminalColors.warning,
        "--tui-danger": terminalColors.danger,
        "--tui-info": terminalColors.info,
        "--tui-bg": terminalColors.background,
        "--tui-fg": terminalColors.foreground,
        "--tui-panel": terminalColors.panel,
        "--tui-overlay": terminalColors.overlay,
        "--tui-grid-line": terminalColors.gridLine,
        "--tui-radius": "4px",
        "--tui-font-mono":
          'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      },
      "[data-theme='light']": {
        "--tui-black": "#ffffff",
        "--tui-white": "#1a1a2e",
        "--tui-bg": "#f5f5f7",
        "--tui-fg": "#1a1a2e",
        "--tui-panel": "#e8e8ec",
        "--tui-bright-black": "#c0c0c8",
        "--tui-grid-line": "rgba(0,0,0,0.08)",
        "--tui-overlay": "rgba(245,245,247,0.92)",
      },
    });

    // Base component styles
    addComponents({
      // ============================================
      // TEXT COMPONENTS
      // ============================================
      ".tui-text": {
        fontFamily: "var(--tui-font-mono)",
        color: "var(--tui-fg)",
      },
      ".tui-text-dim": {
        color: "var(--tui-bright-black)",
      },
      ".tui-text-bold": {
        fontWeight: "700",
        color: "var(--tui-bright-white)",
      },
      ".tui-text-error": {
        color: "var(--tui-red)",
      },
      ".tui-text-success": {
        color: "var(--tui-green)",
      },
      ".tui-text-warning": {
        color: "var(--tui-yellow)",
      },
      ".tui-text-info": {
        color: "var(--tui-blue)",
      },

      // ============================================
      // BOX / CONTAINER COMPONENTS
      // ============================================
      ".tui-box": {
        fontFamily: "var(--tui-font-mono)",
        backgroundColor: "var(--tui-bg)",
        color: "var(--tui-fg)",
        borderRadius: "var(--tui-radius)",
      },
      ".tui-box-bordered": {
        border: "1px solid var(--tui-grid-line)",
      },
      ".tui-box-titled": {
        position: "relative",
        paddingTop: "1.5rem",
      },
      ".tui-box-title": {
        position: "absolute",
        top: "-0.5rem",
        left: "0.75rem",
        backgroundColor: "var(--tui-bg)",
        padding: "0 0.5rem",
        fontSize: "0.75rem",
        color: "var(--tui-accent)",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      },

      // ============================================
      // SURFACE COMPONENTS
      // ============================================
      ".tui-surface": {
        position: "relative",
        overflow: "hidden",
        borderRadius: "var(--tui-radius)",
        border: "1px solid rgba(255,255,255,0.04)",
        color: "var(--tui-fg)",
        transition: "all 200ms",
        background: "linear-gradient(to bottom right, #0f1933, #070c18, #05060f)",
      },
      ".tui-surface-sunken": {
        background: "linear-gradient(to bottom, #080e1c, #050810, #05060c)",
        boxShadow: "inset 0 0 25px rgba(0,0,0,0.6)",
      },
      ".tui-surface-raised": {
        background: "linear-gradient(to bottom, #12213e, #081021, #05070f)",
        boxShadow: "0 18px 45px rgba(21,241,255,0.15)",
      },
      ".tui-surface-crt": {
        background: "linear-gradient(to bottom, #0a0f1a, #050810, #030408)",
        boxShadow:
          "inset 0 0 30px rgba(0,0,0,0.8), 0 0 8px rgba(22,198,12,0.2), inset 0 0 20px rgba(22,198,12,0.05)",
      },
      ".tui-surface-crt::before": {
        content: '""',
        position: "absolute",
        inset: "0",
        pointerEvents: "none",
        zIndex: "10",
        background:
          "repeating-linear-gradient(0deg,rgba(0,0,0,0.15),rgba(0,0,0,0.15) 1px,transparent 1px,transparent 2px)",
        opacity: "0.6",
      },
      ".tui-surface-crt::after": {
        content: '""',
        position: "absolute",
        inset: "0",
        pointerEvents: "none",
        zIndex: "0",
        background:
          "radial-gradient(ellipse at center, rgba(22,198,12,0.08), transparent 70%)",
        mixBlendMode: "screen",
      },
      ".tui-surface-padded": {
        padding: "0.75rem",
      },
      "@media (min-width: 640px)": {
        ".tui-surface-padded": {
          padding: "1rem",
        },
      },
      ".tui-surface-interactive": {
        cursor: "pointer",
      },
      ".tui-surface-interactive:hover": {
        boxShadow: "0 0 35px rgba(21,241,255,0.32)",
      },

      // ============================================
      // BUTTON COMPONENTS
      // ============================================
      ".tui-btn": {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        fontFamily: "var(--tui-font-mono)",
        fontSize: "0.875rem",
        fontWeight: "500",
        borderRadius: "var(--tui-radius)",
        border: "1px solid transparent",
        padding: "0.5rem 1rem",
        cursor: "pointer",
        transition: "all 150ms",
        textDecoration: "none",
        backgroundColor: "var(--tui-bright-black)",
        color: "var(--tui-fg)",
      },
      ".tui-btn:hover": {
        opacity: "0.9",
      },
      ".tui-btn:disabled, .tui-btn[disabled]": {
        opacity: "0.5",
        cursor: "not-allowed",
      },
      ".tui-btn-primary": {
        backgroundColor: "var(--tui-accent)",
        color: "var(--tui-black)",
      },
      ".tui-btn-secondary": {
        backgroundColor: "transparent",
        border: "1px solid var(--tui-bright-black)",
        color: "var(--tui-fg)",
      },
      ".tui-btn-secondary:hover": {
        borderColor: "var(--tui-accent)",
        color: "var(--tui-accent)",
      },
      ".tui-btn-danger": {
        backgroundColor: "var(--tui-danger)",
        color: "var(--tui-black)",
      },
      ".tui-btn-success": {
        backgroundColor: "var(--tui-success)",
        color: "var(--tui-black)",
      },
      ".tui-btn-ghost": {
        backgroundColor: "transparent",
        color: "var(--tui-fg)",
      },
      ".tui-btn-ghost:hover": {
        backgroundColor: "var(--tui-bright-black)",
      },
      ".tui-btn-sm": {
        fontSize: "0.75rem",
        padding: "0.25rem 0.5rem",
      },
      ".tui-btn-lg": {
        fontSize: "1rem",
        padding: "0.75rem 1.5rem",
      },

      // ============================================
      // INPUT COMPONENTS
      // ============================================
      ".tui-input": {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        width: "100%",
        fontFamily: "var(--tui-font-mono)",
        fontSize: "0.875rem",
        backgroundColor: "var(--tui-bg)",
        color: "var(--tui-fg)",
        border: "1px solid var(--tui-bright-black)",
        borderRadius: "var(--tui-radius)",
        padding: "0.5rem 0.75rem",
        outline: "none",
        transition: "border-color 150ms, box-shadow 150ms",
      },
      ".tui-input:focus, .tui-input:focus-within": {
        borderColor: "var(--tui-accent)",
        boxShadow: "0 0 0 2px rgba(21,241,255,0.2)",
      },
      ".tui-input::placeholder": {
        color: "var(--tui-bright-black)",
      },
      ".tui-input-prefix": {
        color: "var(--tui-accent)",
        userSelect: "none",
      },
      ".tui-input-field": {
        flex: "1",
        backgroundColor: "transparent",
        border: "none",
        outline: "none",
        color: "inherit",
        fontFamily: "inherit",
        fontSize: "inherit",
      },

      // ============================================
      // BADGE COMPONENTS
      // ============================================
      ".tui-badge": {
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "var(--tui-font-mono)",
        fontSize: "0.75rem",
        fontWeight: "500",
        padding: "0.125rem 0.5rem",
        borderRadius: "9999px",
        backgroundColor: "var(--tui-bright-black)",
        color: "var(--tui-fg)",
      },
      ".tui-badge-success": {
        backgroundColor: "rgba(91,255,142,0.2)",
        color: "var(--tui-success)",
      },
      ".tui-badge-warning": {
        backgroundColor: "rgba(255,203,107,0.2)",
        color: "var(--tui-warning)",
      },
      ".tui-badge-danger": {
        backgroundColor: "rgba(255,92,124,0.2)",
        color: "var(--tui-danger)",
      },
      ".tui-badge-info": {
        backgroundColor: "rgba(104,209,255,0.2)",
        color: "var(--tui-info)",
      },
      ".tui-badge-accent": {
        backgroundColor: "rgba(21,241,255,0.2)",
        color: "var(--tui-accent)",
      },

      // ============================================
      // SEPARATOR
      // ============================================
      ".tui-separator": {
        border: "none",
        borderTop: "1px solid var(--tui-grid-line)",
        margin: "0.5rem 0",
      },
      ".tui-separator-vertical": {
        borderTop: "none",
        borderLeft: "1px solid var(--tui-grid-line)",
        height: "100%",
        margin: "0 0.5rem",
      },

      // ============================================
      // TERMINAL WINDOW
      // ============================================
      ".tui-window": {
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--tui-font-mono)",
        backgroundColor: "var(--tui-bg)",
        color: "var(--tui-fg)",
        borderRadius: "var(--tui-radius)",
        border: "1px solid var(--tui-grid-line)",
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      },
      ".tui-window-header": {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.75rem 1rem",
        backgroundColor: "var(--tui-panel)",
        borderBottom: "1px solid var(--tui-grid-line)",
      },
      ".tui-window-controls": {
        display: "flex",
        gap: "0.5rem",
      },
      ".tui-window-control": {
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        backgroundColor: "var(--tui-bright-black)",
      },
      ".tui-window-control-close": {
        backgroundColor: "var(--tui-red)",
      },
      ".tui-window-control-minimize": {
        backgroundColor: "var(--tui-yellow)",
      },
      ".tui-window-control-maximize": {
        backgroundColor: "var(--tui-green)",
      },
      ".tui-window-title": {
        flex: "1",
        textAlign: "center",
        fontSize: "0.875rem",
        color: "var(--tui-bright-black)",
      },
      ".tui-window-body": {
        flex: "1",
        padding: "1rem",
        overflow: "auto",
      },

      // ============================================
      // TABS
      // ============================================
      ".tui-tabs": {
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--tui-font-mono)",
      },
      ".tui-tabs-list": {
        display: "flex",
        borderBottom: "1px solid var(--tui-grid-line)",
        gap: "0.25rem",
      },
      ".tui-tab": {
        padding: "0.5rem 1rem",
        fontSize: "0.875rem",
        color: "var(--tui-bright-black)",
        backgroundColor: "transparent",
        border: "none",
        borderBottom: "2px solid transparent",
        cursor: "pointer",
        transition: "all 150ms",
      },
      ".tui-tab:hover": {
        color: "var(--tui-fg)",
      },
      ".tui-tab[data-active='true'], .tui-tab.active, .tui-tab[aria-selected='true']":
        {
          color: "var(--tui-accent)",
          borderBottomColor: "var(--tui-accent)",
        },
      ".tui-tab-panel": {
        display: "none",
        padding: "1rem 0",
      },
      ".tui-tab-panel[data-active='true'], .tui-tab-panel.active": {
        display: "block",
      },

      // ============================================
      // PROGRESS BAR
      // ============================================
      ".tui-progress": {
        position: "relative",
        width: "100%",
        height: "0.5rem",
        backgroundColor: "var(--tui-bright-black)",
        borderRadius: "var(--tui-radius)",
        overflow: "hidden",
      },
      ".tui-progress-bar": {
        height: "100%",
        backgroundColor: "var(--tui-accent)",
        transition: "width 300ms ease-out",
        borderRadius: "var(--tui-radius)",
      },
      ".tui-progress-bar-success": {
        backgroundColor: "var(--tui-success)",
      },
      ".tui-progress-bar-warning": {
        backgroundColor: "var(--tui-warning)",
      },
      ".tui-progress-bar-danger": {
        backgroundColor: "var(--tui-danger)",
      },
      ".tui-progress-label": {
        position: "absolute",
        right: "0.5rem",
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: "0.625rem",
        color: "var(--tui-fg)",
      },
      ".tui-progress-lg": {
        height: "1rem",
      },
      ".tui-progress-sm": {
        height: "0.25rem",
      },
      ".tui-progress-pixelated .tui-progress-bar": {
        imageRendering: "pixelated",
        background:
          "repeating-linear-gradient(90deg, var(--tui-accent) 0px, var(--tui-accent) 8px, var(--tui-accent-muted) 8px, var(--tui-accent-muted) 10px)",
      },

      // ============================================
      // DATA TABLE
      // ============================================
      ".tui-table": {
        width: "100%",
        fontFamily: "var(--tui-font-mono)",
        fontSize: "0.875rem",
        borderCollapse: "collapse",
        color: "var(--tui-fg)",
      },
      ".tui-table th": {
        textAlign: "left",
        padding: "0.5rem 0.75rem",
        borderBottom: "1px solid var(--tui-grid-line)",
        color: "var(--tui-bright-black)",
        fontWeight: "500",
        textTransform: "uppercase",
        fontSize: "0.75rem",
        letterSpacing: "0.05em",
      },
      ".tui-table td": {
        padding: "0.5rem 0.75rem",
        borderBottom: "1px solid var(--tui-grid-line)",
      },
      ".tui-table tr:hover td": {
        backgroundColor: "rgba(255,255,255,0.02)",
      },
      ".tui-table-striped tr:nth-child(even) td": {
        backgroundColor: "rgba(255,255,255,0.02)",
      },
      ".tui-table th[data-sortable]": {
        cursor: "pointer",
      },
      ".tui-table th[data-sortable]:hover": {
        color: "var(--tui-accent)",
      },

      // ============================================
      // TOOLTIP
      // ============================================
      ".tui-tooltip": {
        position: "relative",
        display: "inline-block",
      },
      ".tui-tooltip-content": {
        position: "absolute",
        zIndex: "50",
        padding: "0.375rem 0.625rem",
        fontSize: "0.75rem",
        fontFamily: "var(--tui-font-mono)",
        backgroundColor: "var(--tui-panel)",
        color: "var(--tui-fg)",
        borderRadius: "var(--tui-radius)",
        border: "1px solid var(--tui-grid-line)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        whiteSpace: "nowrap",
        opacity: "0",
        visibility: "hidden",
        transition: "opacity 150ms, visibility 150ms",
        bottom: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        marginBottom: "0.5rem",
      },
      ".tui-tooltip:hover .tui-tooltip-content, .tui-tooltip[data-show] .tui-tooltip-content":
        {
          opacity: "1",
          visibility: "visible",
        },

      // ============================================
      // DIALOG / MODAL
      // ============================================
      ".tui-dialog": {
        position: "fixed",
        inset: "0",
        zIndex: "100",
        display: "none",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--tui-overlay)",
      },
      ".tui-dialog[open], .tui-dialog[data-open='true'], .tui-dialog.open": {
        display: "flex",
      },
      ".tui-dialog-content": {
        position: "relative",
        maxWidth: "32rem",
        width: "100%",
        margin: "1rem",
        backgroundColor: "var(--tui-panel)",
        borderRadius: "var(--tui-radius)",
        border: "1px solid var(--tui-grid-line)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      },
      ".tui-dialog-header": {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem",
        borderBottom: "1px solid var(--tui-grid-line)",
      },
      ".tui-dialog-title": {
        fontFamily: "var(--tui-font-mono)",
        fontSize: "1rem",
        fontWeight: "600",
        color: "var(--tui-fg)",
      },
      ".tui-dialog-close": {
        backgroundColor: "transparent",
        border: "none",
        color: "var(--tui-bright-black)",
        cursor: "pointer",
        padding: "0.25rem",
      },
      ".tui-dialog-close:hover": {
        color: "var(--tui-fg)",
      },
      ".tui-dialog-body": {
        padding: "1rem",
        fontFamily: "var(--tui-font-mono)",
        fontSize: "0.875rem",
        color: "var(--tui-fg)",
      },
      ".tui-dialog-footer": {
        display: "flex",
        justifyContent: "flex-end",
        gap: "0.5rem",
        padding: "1rem",
        borderTop: "1px solid var(--tui-grid-line)",
      },

      // ============================================
      // BREADCRUMB
      // ============================================
      ".tui-breadcrumb": {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontFamily: "var(--tui-font-mono)",
        fontSize: "0.875rem",
      },
      ".tui-breadcrumb-item": {
        color: "var(--tui-bright-black)",
        textDecoration: "none",
      },
      ".tui-breadcrumb-item:hover": {
        color: "var(--tui-accent)",
      },
      ".tui-breadcrumb-item[data-current='true'], .tui-breadcrumb-item.current":
        {
          color: "var(--tui-fg)",
        },
      ".tui-breadcrumb-separator": {
        color: "var(--tui-bright-black)",
      },

      // ============================================
      // STAT CARD
      // ============================================
      ".tui-stat": {
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        fontFamily: "var(--tui-font-mono)",
      },
      ".tui-stat-label": {
        fontSize: "0.75rem",
        color: "var(--tui-bright-black)",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      },
      ".tui-stat-value": {
        fontSize: "1.5rem",
        fontWeight: "700",
        color: "var(--tui-fg)",
      },
      ".tui-stat-value-success": {
        color: "var(--tui-success)",
      },
      ".tui-stat-value-warning": {
        color: "var(--tui-warning)",
      },
      ".tui-stat-value-danger": {
        color: "var(--tui-danger)",
      },
      ".tui-stat-change": {
        fontSize: "0.75rem",
      },
      ".tui-stat-change-positive": {
        color: "var(--tui-success)",
      },
      ".tui-stat-change-negative": {
        color: "var(--tui-danger)",
      },

      // ============================================
      // KEY-VALUE LIST
      // ============================================
      ".tui-kv": {
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        fontFamily: "var(--tui-font-mono)",
        fontSize: "0.875rem",
      },
      ".tui-kv-row": {
        display: "flex",
        alignItems: "baseline",
        gap: "0.5rem",
      },
      ".tui-kv-key": {
        color: "var(--tui-bright-black)",
        minWidth: "8rem",
      },
      ".tui-kv-value": {
        color: "var(--tui-fg)",
      },
      ".tui-kv-separator": {
        flex: "1",
        borderBottom: "1px dotted var(--tui-grid-line)",
        marginBottom: "0.25rem",
      },

      // ============================================
      // MENU / DROPDOWN
      // ============================================
      ".tui-menu": {
        position: "relative",
        display: "inline-block",
      },
      ".tui-menu-content": {
        position: "absolute",
        top: "100%",
        left: "0",
        zIndex: "50",
        minWidth: "12rem",
        marginTop: "0.25rem",
        backgroundColor: "var(--tui-panel)",
        borderRadius: "var(--tui-radius)",
        border: "1px solid var(--tui-grid-line)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        opacity: "0",
        visibility: "hidden",
        transform: "translateY(-0.5rem)",
        transition: "opacity 150ms, visibility 150ms, transform 150ms",
      },
      ".tui-menu[data-open='true'] .tui-menu-content, .tui-menu.open .tui-menu-content":
        {
          opacity: "1",
          visibility: "visible",
          transform: "translateY(0)",
        },
      ".tui-menu-item": {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        width: "100%",
        padding: "0.5rem 0.75rem",
        fontFamily: "var(--tui-font-mono)",
        fontSize: "0.875rem",
        color: "var(--tui-fg)",
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        textDecoration: "none",
      },
      ".tui-menu-item:hover": {
        backgroundColor: "rgba(255,255,255,0.05)",
      },
      ".tui-menu-item[data-active='true'], .tui-menu-item.active": {
        backgroundColor: "rgba(21,241,255,0.1)",
        color: "var(--tui-accent)",
      },
      ".tui-menu-item:disabled, .tui-menu-item[disabled]": {
        opacity: "0.5",
        cursor: "not-allowed",
      },
      ".tui-menu-separator": {
        height: "1px",
        backgroundColor: "var(--tui-grid-line)",
        margin: "0.25rem 0",
      },

      // ============================================
      // SIDEBAR
      // ============================================
      ".tui-sidebar": {
        display: "flex",
        flexDirection: "column",
        width: "16rem",
        height: "100%",
        backgroundColor: "var(--tui-panel)",
        borderRight: "1px solid var(--tui-grid-line)",
        transition: "width 200ms",
      },
      ".tui-sidebar[data-collapsed='true'], .tui-sidebar.collapsed": {
        width: "4rem",
      },
      ".tui-sidebar-header": {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem",
        borderBottom: "1px solid var(--tui-grid-line)",
      },
      ".tui-sidebar-content": {
        flex: "1",
        overflow: "auto",
        padding: "0.5rem",
      },
      ".tui-sidebar-footer": {
        padding: "1rem",
        borderTop: "1px solid var(--tui-grid-line)",
      },
      ".tui-sidebar-item": {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        width: "100%",
        padding: "0.625rem 0.75rem",
        fontFamily: "var(--tui-font-mono)",
        fontSize: "0.875rem",
        color: "var(--tui-bright-black)",
        backgroundColor: "transparent",
        border: "none",
        borderRadius: "var(--tui-radius)",
        cursor: "pointer",
        textAlign: "left",
        textDecoration: "none",
      },
      ".tui-sidebar-item:hover": {
        backgroundColor: "rgba(255,255,255,0.05)",
        color: "var(--tui-fg)",
      },
      ".tui-sidebar-item[data-active='true'], .tui-sidebar-item.active": {
        backgroundColor: "rgba(21,241,255,0.1)",
        color: "var(--tui-accent)",
      },

      // ============================================
      // AVATAR
      // ============================================
      ".tui-avatar": {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "2.5rem",
        height: "2.5rem",
        borderRadius: "50%",
        backgroundColor: "var(--tui-bright-black)",
        color: "var(--tui-fg)",
        fontFamily: "var(--tui-font-mono)",
        fontSize: "1rem",
        fontWeight: "600",
        overflow: "hidden",
      },
      ".tui-avatar img": {
        width: "100%",
        height: "100%",
        objectFit: "cover",
      },
      ".tui-avatar-sm": {
        width: "1.5rem",
        height: "1.5rem",
        fontSize: "0.625rem",
      },
      ".tui-avatar-lg": {
        width: "4rem",
        height: "4rem",
        fontSize: "1.5rem",
      },
      ".tui-avatar-square": {
        borderRadius: "var(--tui-radius)",
      },

      // ============================================
      // PAGINATION
      // ============================================
      ".tui-pagination": {
        display: "flex",
        alignItems: "center",
        gap: "0.25rem",
        fontFamily: "var(--tui-font-mono)",
      },
      ".tui-pagination-btn": {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "2rem",
        height: "2rem",
        padding: "0 0.5rem",
        fontSize: "0.875rem",
        color: "var(--tui-bright-black)",
        backgroundColor: "transparent",
        border: "1px solid var(--tui-grid-line)",
        borderRadius: "var(--tui-radius)",
        cursor: "pointer",
      },
      ".tui-pagination-btn:hover": {
        color: "var(--tui-fg)",
        borderColor: "var(--tui-bright-black)",
      },
      ".tui-pagination-btn[data-active='true'], .tui-pagination-btn.active": {
        backgroundColor: "var(--tui-accent)",
        borderColor: "var(--tui-accent)",
        color: "var(--tui-black)",
      },
      ".tui-pagination-btn:disabled, .tui-pagination-btn[disabled]": {
        opacity: "0.5",
        cursor: "not-allowed",
      },

      // ============================================
      // FUNCTION KEY BAR
      // ============================================
      ".tui-fnbar": {
        display: "flex",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.5rem",
        backgroundColor: "var(--tui-panel)",
        borderTop: "1px solid var(--tui-grid-line)",
        fontFamily: "var(--tui-font-mono)",
        fontSize: "0.75rem",
      },
      ".tui-fnbar-item": {
        display: "inline-flex",
        alignItems: "center",
      },
      ".tui-fnbar-key": {
        padding: "0.125rem 0.375rem",
        backgroundColor: "var(--tui-bright-black)",
        color: "var(--tui-fg)",
        borderRadius: "2px",
      },
      ".tui-fnbar-label": {
        padding: "0.125rem 0.375rem",
        color: "var(--tui-bright-black)",
      },

      // ============================================
      // STATUS BAR
      // ============================================
      ".tui-statusbar": {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.25rem 0.75rem",
        backgroundColor: "var(--tui-panel)",
        borderTop: "1px solid var(--tui-grid-line)",
        fontFamily: "var(--tui-font-mono)",
        fontSize: "0.75rem",
        color: "var(--tui-bright-black)",
      },
      ".tui-statusbar-left": {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      },
      ".tui-statusbar-right": {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      },
      ".tui-statusbar-item": {
        display: "flex",
        alignItems: "center",
        gap: "0.25rem",
      },

      // ============================================
      // SCROLLABLE AREA
      // ============================================
      ".tui-scroll": {
        overflow: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "var(--tui-bright-black) transparent",
      },
      ".tui-scroll::-webkit-scrollbar": {
        width: "8px",
        height: "8px",
      },
      ".tui-scroll::-webkit-scrollbar-track": {
        backgroundColor: "transparent",
      },
      ".tui-scroll::-webkit-scrollbar-thumb": {
        backgroundColor: "var(--tui-bright-black)",
        borderRadius: "4px",
      },
      ".tui-scroll::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "var(--tui-accent-muted)",
      },

      // ============================================
      // GRID LAYOUTS
      // ============================================
      ".tui-grid": {
        display: "grid",
        gap: "1rem",
      },
      ".tui-grid-2": {
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      },
      ".tui-grid-3": {
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      },
      ".tui-grid-4": {
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      },
      ".tui-grid-fluid": {
        gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
      },

      // ============================================
      // LOADING / SPINNER
      // ============================================
      ".tui-spinner": {
        display: "inline-block",
        width: "1rem",
        height: "1rem",
        border: "2px solid var(--tui-bright-black)",
        borderTopColor: "var(--tui-accent)",
        borderRadius: "50%",
        animation: "tui-spin 0.6s linear infinite",
      },
      ".tui-spinner-sm": {
        width: "0.75rem",
        height: "0.75rem",
      },
      ".tui-spinner-lg": {
        width: "1.5rem",
        height: "1.5rem",
      },

      // ============================================
      // CODE / PRE
      // ============================================
      ".tui-code": {
        fontFamily: "var(--tui-font-mono)",
        fontSize: "0.875rem",
        padding: "0.125rem 0.375rem",
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: "var(--tui-radius)",
        color: "var(--tui-accent)",
      },
      ".tui-pre": {
        fontFamily: "var(--tui-font-mono)",
        fontSize: "0.875rem",
        padding: "1rem",
        backgroundColor: "var(--tui-panel)",
        borderRadius: "var(--tui-radius)",
        border: "1px solid var(--tui-grid-line)",
        overflow: "auto",
        whiteSpace: "pre",
        color: "var(--tui-fg)",
      },
    });

    // Add animations
    addBase({
      "@keyframes tui-spin": {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
      "@keyframes tui-pulse": {
        "0%, 100%": { opacity: "1" },
        "50%": { opacity: "0.5" },
      },
      "@keyframes tui-glow": {
        "0%": { opacity: "0.4" },
        "100%": { opacity: "1" },
      },
    });

    // Add utility classes
    addUtilities({
      ".tui-glow": {
        boxShadow: "0 0 8px rgba(21,241,255,0.45)",
      },
      ".tui-glow-lg": {
        boxShadow: "0 0 20px rgba(21,241,255,0.5)",
      },
      ".tui-animate-glow": {
        animation: "tui-glow 1.5s ease-in-out infinite alternate",
      },
      ".tui-animate-pulse": {
        animation: "tui-pulse 2s ease-in-out infinite",
      },
      ".tui-pixelated": {
        imageRendering: "pixelated",
      },
    });
  },
  {
    // Extend theme
    theme: {
      extend: {
        colors: {
          terminal: terminalColors,
        },
        fontFamily: {
          mono: [
            "Menlo",
            "Monaco",
            "Consolas",
            '"Liberation Mono"',
            '"Courier New"',
            "monospace",
          ],
        },
        boxShadow: {
          "terminal-window": "0 0 0 1px rgba(255,255,255,0.05)",
          glow: "0 0 8px rgba(97,214,214,0.45)",
        },
        borderRadius: {
          terminal: "4px",
        },
      },
    },
  }
);
