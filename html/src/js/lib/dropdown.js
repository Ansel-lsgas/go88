document.addEventListener("DOMContentLoaded", function () {
  const containers = document.querySelectorAll(".btn--dropdown");
  const header = document.querySelector(".site-header");
  containers.forEach((ctn) => {
    const trigger = ctn.querySelector(".dropdown__trigger");
    const indicator = ctn.querySelector(".dropdown__indicator");
    const dropdown = ctn.querySelector(".dropdown__list");
    if (!trigger || !dropdown) return;
    const items = dropdown.querySelectorAll(".dropdown__item");
    const largeScreen = 1024;

    trigger.addEventListener("click", (e) => {
      if (window.innerWidth >= largeScreen && header.contains(e.target)) return;
      const isClickedAnchor = e.target.closest("a");
      if (isClickedAnchor) return;

      dropdown.classList.toggle("hidden");
      if (indicator) indicator.classList.toggle("rotate-90");
      if (header.contains(e.target) && e.target.closest(".dropdown__item")) {
         trigger.classList.add("!text-primary"); 
         trigger.classList.add("bg-alpha/10") 
        }
    });
    items.forEach((item) => {
      item.addEventListener("click", (e) => {
        if (e.target.closest(".dropdown__indicator")) return;
        dropdown.classList.add("hidden");
        if (indicator) indicator.classList.remove("rotate-90");

        // Form dropdowns: update trigger value + label + dispatch event
        const value = item.dataset.value;
        if (value !== undefined) {
          trigger.dataset.value = value;
          const label = trigger.querySelector(".dropdown__label");
          if (label) label.textContent = item.textContent.trim();
          ctn.dispatchEvent(new CustomEvent("dropdownChange", { detail: { value } }));
        }
      });
    });
  });

  document.addEventListener("click", (event) => {
    containers.forEach((ctn) => {
      const indicator = ctn.querySelector(".dropdown__indicator");
      const dropdown = ctn.querySelector(".dropdown__list");
      if (!dropdown) return;
      if (ctn.contains(event.target)) return;
      dropdown.classList.add("hidden");
      if (!indicator) return;
      indicator.classList.remove("rotate-90");
    });
  });
});
