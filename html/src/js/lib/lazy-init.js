(function () {
  function initLazyLoad() {
    if (window.lazyLoadInstance) return;
    window.lazyLoadInstance = new LazyLoad({
      elements_selector: ".lazy",
      threshold: 300,
      callback_loaded: el => el.classList.add("loaded"),
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLazyLoad);
  } else {
    initLazyLoad();
  }
})();
