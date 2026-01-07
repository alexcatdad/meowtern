/**
 * web-tui CSS Package
 * Framework-agnostic Terminal UI Components
 *
 * This module exports the Tailwind plugin and vanilla JS utilities.
 *
 * For CSS-only usage:
 *   @import 'web-tui/css/web-tui.css';
 *
 * For Tailwind users:
 *   // tailwind.config.js
 *   plugins: [require('web-tui/plugin')]
 *
 * For interactive components:
 *   import { initTabs, initDialog } from 'web-tui/js';
 */

// Re-export vanilla JS utilities
export * from './web-tui.js';

// Export CSS path for bundlers that support it
export const cssPath = new URL('./web-tui.css', import.meta.url).pathname;
