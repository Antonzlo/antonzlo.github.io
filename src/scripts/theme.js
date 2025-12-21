/**
 * Theme toggle module
 * Manages light/dark theme switching with localStorage persistence
 * and respects OS preferences
 */

const ThemeManager = (() => {
  const STORAGE_KEY = "site-theme";
  const root = document.documentElement;
  const prefersDark = globalThis.matchMedia?.("(prefers-color-scheme: dark)");

  /**
   * Get current theme preference
   * Priority: localStorage > OS preference > default (light)
   */
  function getCurrentPref() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    return prefersDark?.matches ? "dark" : "light";
  }

  /**
   * Apply theme to document
   */
  function apply(theme) {
    if (theme === "dark") {
      root.dataset.theme = "dark";
    } else {
      root.dataset.theme = "light";
    }
  }

  /**
   * Toggle between light and dark themes
   */
  function toggle() {
    const current = getCurrentPref();
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    apply(next);
  }

  /**
   * Initialize theme manager
   */
  function init() {
    // Apply saved or OS preference on page load
    apply(getCurrentPref());

    // Attach toggle button
    const toggleBtn = document.getElementById("theme-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", toggle);
    }

    // Follow OS changes if no explicit preference set
    if (prefersDark) {
      prefersDark.addEventListener("change", (e) => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== "light" && saved !== "dark") {
          apply(e.matches ? "dark" : "light");
        }
      });
    }
  }

  return {
    init,
    toggle,
    getCurrentPref,
  };
})();

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ThemeManager.init);
} else {
  ThemeManager.init();
}
