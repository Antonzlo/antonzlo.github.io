/**
 * Links module
 * Converts project URLs in list items to clickable links
 */

const LinksManager = (() => {
  function init() {
    const projectsList = document.getElementById("projects-list");
    if (!projectsList) {
      return;
    }

    projectsList.querySelectorAll(".project-link").forEach((item) => {
      const url = item.textContent.trim();
      item.innerHTML = `<a href="${url}">${url}</a>`;
    });
  }

  return {
    init,
  };
})();

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", LinksManager.init);
} else {
  LinksManager.init();
}
