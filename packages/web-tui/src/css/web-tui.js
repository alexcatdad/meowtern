/**
 * web-tui - Vanilla JavaScript Utilities
 * Framework-agnostic Terminal UI Components
 *
 * These utilities add interactivity to web-tui components.
 * They are optional - all components work as pure CSS with manual state management.
 *
 * Usage:
 *   import { initTabs, initDialog, initMenu } from 'web-tui/js';
 *   // or
 *   <script src="web-tui.js"></script>
 *   <script>webTui.initTabs(element)</script>
 */

(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? factory(exports)
    : typeof define === "function" && define.amd
      ? define(["exports"], factory)
      : ((global =
          typeof globalThis !== "undefined" ? globalThis : global || self),
        factory((global.webTui = {})));
})(this, function (exports) {
  "use strict";

  /**
   * Initialize tabs component
   * @param {HTMLElement|string} element - Element or selector
   * @param {Object} options - Configuration options
   * @returns {Object} API for controlling tabs
   */
  function initTabs(element, options = {}) {
    const container =
      typeof element === "string" ? document.querySelector(element) : element;

    if (!container) {
      console.warn("web-tui: Tabs container not found");
      return null;
    }

    const tabs = container.querySelectorAll(".tui-tab");
    const panels = container.querySelectorAll(".tui-tab-panel");
    let activeTab = options.defaultTab || null;

    function activate(tabId) {
      tabs.forEach((tab) => {
        const isActive = tab.dataset.tabId === tabId;
        tab.dataset.active = isActive;
        tab.setAttribute("aria-selected", isActive);
        if (isActive) tab.classList.add("active");
        else tab.classList.remove("active");
      });

      panels.forEach((panel) => {
        const isActive = panel.dataset.tabId === tabId;
        panel.dataset.active = isActive;
        if (isActive) panel.classList.add("active");
        else panel.classList.remove("active");
      });

      activeTab = tabId;

      if (options.onChange) {
        options.onChange(tabId);
      }
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const tabId = tab.dataset.tabId;
        if (tabId) activate(tabId);
      });

      // Keyboard navigation
      tab.addEventListener("keydown", (e) => {
        const tabsList = Array.from(tabs);
        const currentIndex = tabsList.indexOf(tab);

        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          const nextTab = tabsList[(currentIndex + 1) % tabsList.length];
          nextTab.focus();
          if (options.activateOnFocus) activate(nextTab.dataset.tabId);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          const prevTab =
            tabsList[(currentIndex - 1 + tabsList.length) % tabsList.length];
          prevTab.focus();
          if (options.activateOnFocus) activate(prevTab.dataset.tabId);
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate(tab.dataset.tabId);
        }
      });
    });

    // Initialize first tab or specified default
    const initialTab =
      activeTab || tabs[0]?.dataset.tabId || panels[0]?.dataset.tabId;
    if (initialTab) activate(initialTab);

    return {
      activate,
      getActive: () => activeTab,
      destroy: () => {
        tabs.forEach((tab) => {
          tab.replaceWith(tab.cloneNode(true));
        });
      },
    };
  }

  /**
   * Initialize dialog component
   * @param {HTMLElement|string} element - Element or selector
   * @param {Object} options - Configuration options
   * @returns {Object} API for controlling dialog
   */
  function initDialog(element, options = {}) {
    const dialog =
      typeof element === "string" ? document.querySelector(element) : element;

    if (!dialog) {
      console.warn("web-tui: Dialog not found");
      return null;
    }

    const closeBtn = dialog.querySelector(".tui-dialog-close");
    const content = dialog.querySelector(".tui-dialog-content");

    function open() {
      dialog.dataset.open = "true";
      dialog.classList.add("open");
      document.body.style.overflow = "hidden";

      if (options.onOpen) options.onOpen();

      // Focus first focusable element
      const focusable = content?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    }

    function close() {
      dialog.dataset.open = "false";
      dialog.classList.remove("open");
      document.body.style.overflow = "";

      if (options.onClose) options.onClose();
    }

    function toggle() {
      if (dialog.dataset.open === "true") close();
      else open();
    }

    // Close button
    if (closeBtn) {
      closeBtn.addEventListener("click", close);
    }

    // Click outside to close
    if (options.closeOnBackdrop !== false) {
      dialog.addEventListener("click", (e) => {
        if (e.target === dialog) close();
      });
    }

    // Escape key to close
    if (options.closeOnEscape !== false) {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && dialog.dataset.open === "true") {
          close();
        }
      });
    }

    return {
      open,
      close,
      toggle,
      isOpen: () => dialog.dataset.open === "true",
      destroy: () => {
        if (closeBtn) closeBtn.replaceWith(closeBtn.cloneNode(true));
      },
    };
  }

  /**
   * Initialize dropdown menu component
   * @param {HTMLElement|string} element - Element or selector
   * @param {Object} options - Configuration options
   * @returns {Object} API for controlling menu
   */
  function initMenu(element, options = {}) {
    const menu =
      typeof element === "string" ? document.querySelector(element) : element;

    if (!menu) {
      console.warn("web-tui: Menu not found");
      return null;
    }

    const trigger = menu.querySelector("[data-menu-trigger]") || menu.children[0];
    const content = menu.querySelector(".tui-menu-content");
    const items = menu.querySelectorAll(".tui-menu-item");
    let focusedIndex = -1;

    function open() {
      menu.dataset.open = "true";
      menu.classList.add("open");
      focusedIndex = -1;

      if (options.onOpen) options.onOpen();
    }

    function close() {
      menu.dataset.open = "false";
      menu.classList.remove("open");
      focusedIndex = -1;

      if (options.onClose) options.onClose();
    }

    function toggle() {
      if (menu.dataset.open === "true") close();
      else open();
    }

    function focusItem(index) {
      const itemsList = Array.from(items).filter((item) => !item.disabled);
      if (itemsList.length === 0) return;

      focusedIndex = Math.max(0, Math.min(index, itemsList.length - 1));
      itemsList[focusedIndex].focus();
    }

    // Trigger click
    if (trigger) {
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        toggle();
      });
    }

    // Item clicks
    items.forEach((item) => {
      item.addEventListener("click", () => {
        if (options.closeOnSelect !== false) close();
        if (options.onSelect) options.onSelect(item);
      });
    });

    // Keyboard navigation
    menu.addEventListener("keydown", (e) => {
      if (menu.dataset.open !== "true") return;

      const itemsList = Array.from(items).filter((item) => !item.disabled);

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          focusItem(focusedIndex + 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          focusItem(focusedIndex - 1);
          break;
        case "Escape":
          e.preventDefault();
          close();
          trigger?.focus();
          break;
        case "Enter":
        case " ":
          if (focusedIndex >= 0) {
            e.preventDefault();
            itemsList[focusedIndex]?.click();
          }
          break;
        case "Home":
          e.preventDefault();
          focusItem(0);
          break;
        case "End":
          e.preventDefault();
          focusItem(itemsList.length - 1);
          break;
      }
    });

    // Click outside to close
    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && menu.dataset.open === "true") {
        close();
      }
    });

    return {
      open,
      close,
      toggle,
      isOpen: () => menu.dataset.open === "true",
      destroy: () => {
        if (trigger) trigger.replaceWith(trigger.cloneNode(true));
        items.forEach((item) => item.replaceWith(item.cloneNode(true)));
      },
    };
  }

  /**
   * Initialize sidebar component
   * @param {HTMLElement|string} element - Element or selector
   * @param {Object} options - Configuration options
   * @returns {Object} API for controlling sidebar
   */
  function initSidebar(element, options = {}) {
    const sidebar =
      typeof element === "string" ? document.querySelector(element) : element;

    if (!sidebar) {
      console.warn("web-tui: Sidebar not found");
      return null;
    }

    const toggle = sidebar.querySelector("[data-sidebar-toggle]");
    let isCollapsed = options.defaultCollapsed || false;

    function collapse() {
      isCollapsed = true;
      sidebar.dataset.collapsed = "true";
      sidebar.classList.add("collapsed");
      if (options.onCollapse) options.onCollapse();
    }

    function expand() {
      isCollapsed = false;
      sidebar.dataset.collapsed = "false";
      sidebar.classList.remove("collapsed");
      if (options.onExpand) options.onExpand();
    }

    function toggleCollapse() {
      if (isCollapsed) expand();
      else collapse();
    }

    if (toggle) {
      toggle.addEventListener("click", toggleCollapse);
    }

    // Initialize state
    if (isCollapsed) collapse();

    return {
      collapse,
      expand,
      toggle: toggleCollapse,
      isCollapsed: () => isCollapsed,
      destroy: () => {
        if (toggle) toggle.replaceWith(toggle.cloneNode(true));
      },
    };
  }

  /**
   * Initialize tooltip component
   * @param {HTMLElement|string} element - Element or selector
   * @param {Object} options - Configuration options
   * @returns {Object} API for controlling tooltip
   */
  function initTooltip(element, options = {}) {
    const tooltip =
      typeof element === "string" ? document.querySelector(element) : element;

    if (!tooltip) {
      console.warn("web-tui: Tooltip not found");
      return null;
    }

    const content = tooltip.querySelector(".tui-tooltip-content");
    const delay = options.delay || 0;
    let timeout = null;

    function show() {
      if (delay > 0) {
        timeout = setTimeout(() => {
          tooltip.dataset.show = "true";
        }, delay);
      } else {
        tooltip.dataset.show = "true";
      }
    }

    function hide() {
      if (timeout) clearTimeout(timeout);
      tooltip.dataset.show = "false";
    }

    tooltip.addEventListener("mouseenter", show);
    tooltip.addEventListener("mouseleave", hide);
    tooltip.addEventListener("focus", show, true);
    tooltip.addEventListener("blur", hide, true);

    return {
      show: () => {
        tooltip.dataset.show = "true";
      },
      hide,
      destroy: () => {
        tooltip.replaceWith(tooltip.cloneNode(true));
      },
    };
  }

  /**
   * Initialize command palette component
   * @param {HTMLElement|string} element - Element or selector
   * @param {Object} options - Configuration options
   * @returns {Object} API for controlling palette
   */
  function initPalette(element, options = {}) {
    const palette =
      typeof element === "string" ? document.querySelector(element) : element;

    if (!palette) {
      console.warn("web-tui: Command palette not found");
      return null;
    }

    const input = palette.querySelector(".tui-palette-input");
    const results = palette.querySelector(".tui-palette-results");
    let items = options.items || [];
    let filteredItems = [];
    let focusedIndex = 0;

    function open() {
      palette.dataset.open = "true";
      palette.classList.add("open");
      document.body.style.overflow = "hidden";
      input?.focus();
      render();
      if (options.onOpen) options.onOpen();
    }

    function close() {
      palette.dataset.open = "false";
      palette.classList.remove("open");
      document.body.style.overflow = "";
      if (input) input.value = "";
      if (options.onClose) options.onClose();
    }

    function toggle() {
      if (palette.dataset.open === "true") close();
      else open();
    }

    function filter(query) {
      if (!query) {
        filteredItems = items;
      } else {
        const lowerQuery = query.toLowerCase();
        filteredItems = items.filter(
          (item) =>
            item.label?.toLowerCase().includes(lowerQuery) ||
            item.keywords?.some((k) => k.toLowerCase().includes(lowerQuery))
        );
      }
      focusedIndex = 0;
      render();
    }

    function render() {
      if (!results) return;

      results.innerHTML = filteredItems
        .map(
          (item, i) => `
        <div class="tui-palette-item${i === focusedIndex ? " active" : ""}"
             data-index="${i}"
             data-action="${item.action || ""}">
          ${item.icon ? `<span class="tui-palette-item-icon">${item.icon}</span>` : ""}
          <span>${item.label}</span>
          ${item.shortcut ? `<span class="tui-palette-item-shortcut">${item.shortcut}</span>` : ""}
        </div>
      `
        )
        .join("");

      // Add click handlers
      results.querySelectorAll(".tui-palette-item").forEach((el) => {
        el.addEventListener("click", () => {
          const index = parseInt(el.dataset.index);
          select(index);
        });
      });
    }

    function select(index) {
      const item = filteredItems[index];
      if (item) {
        if (options.onSelect) options.onSelect(item);
        if (item.onSelect) item.onSelect();
        close();
      }
    }

    function focusItem(index) {
      focusedIndex = Math.max(0, Math.min(index, filteredItems.length - 1));
      render();
    }

    // Input filtering
    if (input) {
      input.addEventListener("input", (e) => {
        filter(e.target.value);
      });
    }

    // Keyboard navigation
    palette.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          focusItem(focusedIndex + 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          focusItem(focusedIndex - 1);
          break;
        case "Enter":
          e.preventDefault();
          select(focusedIndex);
          break;
        case "Escape":
          e.preventDefault();
          close();
          break;
      }
    });

    // Global keyboard shortcut
    if (options.shortcut) {
      document.addEventListener("keydown", (e) => {
        const key = options.shortcut.toLowerCase();
        const ctrlKey = key.includes("ctrl+") || key.includes("cmd+");
        const actualKey = key.replace(/ctrl\+|cmd\+/g, "");

        if ((ctrlKey ? e.ctrlKey || e.metaKey : true) && e.key.toLowerCase() === actualKey) {
          e.preventDefault();
          toggle();
        }
      });
    }

    return {
      open,
      close,
      toggle,
      setItems: (newItems) => {
        items = newItems;
        filter(input?.value || "");
      },
      isOpen: () => palette.dataset.open === "true",
      destroy: () => {
        palette.replaceWith(palette.cloneNode(true));
      },
    };
  }

  /**
   * Initialize theme switcher
   * @param {Object} options - Configuration options
   * @returns {Object} API for controlling theme
   */
  function initTheme(options = {}) {
    const root = options.root || document.documentElement;
    let currentTheme = options.defaultTheme || "dark";

    function setTheme(theme) {
      root.dataset.theme = theme;
      currentTheme = theme;

      if (options.persist !== false) {
        try {
          localStorage.setItem("tui-theme", theme);
        } catch (e) {
          // localStorage not available
        }
      }

      if (options.onChange) options.onChange(theme);
    }

    function getTheme() {
      return currentTheme;
    }

    function toggle() {
      setTheme(currentTheme === "dark" ? "light" : "dark");
    }

    // Load persisted theme
    if (options.persist !== false) {
      try {
        const saved = localStorage.getItem("tui-theme");
        if (saved) currentTheme = saved;
      } catch (e) {
        // localStorage not available
      }
    }

    // Detect system preference
    if (options.detectSystem && !localStorage.getItem("tui-theme")) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      currentTheme = prefersDark ? "dark" : "light";
    }

    // Initialize
    setTheme(currentTheme);

    return {
      setTheme,
      getTheme,
      toggle,
      themes: ["dark", "light", "btop-classic", "polar-night", "retro-amber", "matrix-green", "red-alert"],
    };
  }

  /**
   * Initialize sortable table
   * @param {HTMLElement|string} element - Table element or selector
   * @param {Object} options - Configuration options
   * @returns {Object} API for controlling table
   */
  function initTable(element, options = {}) {
    const table =
      typeof element === "string" ? document.querySelector(element) : element;

    if (!table) {
      console.warn("web-tui: Table not found");
      return null;
    }

    const headers = table.querySelectorAll("th[data-sortable]");
    const tbody = table.querySelector("tbody");
    let sortColumn = null;
    let sortDirection = "asc";

    function sort(column, direction) {
      if (!tbody) return;

      sortColumn = column;
      sortDirection = direction;

      // Update header indicators
      headers.forEach((h) => {
        if (h.dataset.column === column) {
          h.dataset.sort = direction;
        } else {
          delete h.dataset.sort;
        }
      });

      // Sort rows
      const rows = Array.from(tbody.querySelectorAll("tr"));
      const columnIndex = Array.from(headers).findIndex(
        (h) => h.dataset.column === column
      );

      if (columnIndex === -1) return;

      rows.sort((a, b) => {
        const aVal = a.cells[columnIndex]?.textContent?.trim() || "";
        const bVal = b.cells[columnIndex]?.textContent?.trim() || "";

        // Try numeric sort first
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return direction === "asc" ? aNum - bNum : bNum - aNum;
        }

        // Fall back to string sort
        return direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });

      // Re-append sorted rows
      rows.forEach((row) => tbody.appendChild(row));

      if (options.onSort) options.onSort(column, direction);
    }

    // Header click handlers
    headers.forEach((header) => {
      header.addEventListener("click", () => {
        const column = header.dataset.column;
        const newDirection =
          sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
        sort(column, newDirection);
      });
    });

    return {
      sort,
      getSort: () => ({ column: sortColumn, direction: sortDirection }),
      destroy: () => {
        headers.forEach((h) => h.replaceWith(h.cloneNode(true)));
      },
    };
  }

  /**
   * Auto-initialize all components on the page
   * @param {Object} options - Configuration options
   */
  function autoInit(options = {}) {
    // Tabs
    document.querySelectorAll(".tui-tabs[data-auto-init]").forEach((el) => {
      initTabs(el);
    });

    // Dialogs
    document.querySelectorAll(".tui-dialog[data-auto-init]").forEach((el) => {
      initDialog(el);
    });

    // Menus
    document.querySelectorAll(".tui-menu[data-auto-init]").forEach((el) => {
      initMenu(el);
    });

    // Sidebars
    document.querySelectorAll(".tui-sidebar[data-auto-init]").forEach((el) => {
      initSidebar(el);
    });

    // Tooltips
    document.querySelectorAll(".tui-tooltip[data-auto-init]").forEach((el) => {
      initTooltip(el);
    });

    // Tables
    document.querySelectorAll(".tui-table[data-auto-init]").forEach((el) => {
      initTable(el);
    });

    // Theme
    if (options.theme !== false) {
      initTheme(options.themeOptions || {});
    }
  }

  // Run auto-init on DOMContentLoaded if data attribute present
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        if (document.body.dataset.tuiAutoInit !== undefined) {
          autoInit();
        }
      });
    } else {
      if (document.body?.dataset?.tuiAutoInit !== undefined) {
        autoInit();
      }
    }
  }

  // Exports
  exports.initTabs = initTabs;
  exports.initDialog = initDialog;
  exports.initMenu = initMenu;
  exports.initSidebar = initSidebar;
  exports.initTooltip = initTooltip;
  exports.initPalette = initPalette;
  exports.initTheme = initTheme;
  exports.initTable = initTable;
  exports.autoInit = autoInit;

  Object.defineProperty(exports, "__esModule", { value: true });
});
