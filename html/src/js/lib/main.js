document.addEventListener("DOMContentLoaded", function () {
  const scrollTopBtn = document.querySelector(".btn--scroll-window--top");
  if (!scrollTopBtn) return;
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  const displayBtnHandler = () => {
    const quarterScreenHeight = window.innerHeight * 0.25;
    if (window.scrollY < quarterScreenHeight) {
      scrollTopBtn.classList.add("hidden");
    } else {
      scrollTopBtn.classList.remove("hidden");
    }
  };
  displayBtnHandler()
  window.addEventListener("scroll", displayBtnHandler);
});
