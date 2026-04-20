document.addEventListener("DOMContentLoaded", function () {
  const html = document.querySelector("html");
  const header = document.querySelector(".site-header");
  if (!html || !header) return;
  const trigger = header.querySelector("#header_trigger");
  if (!trigger) return;
  const paths = trigger.querySelectorAll("path");
  if (!paths.length) return;

  const pathClasses = ["opacity-0", "translate-x-full"];
  const initialPathLines = ["M4 8H36", "M4 32H36"];
  const closePathLines = ["M8 8L32 32", "M8 32L32 8"];

  const animationPaths = [paths[0], paths[1]];
  console.log(animationPaths, paths);
  animationPaths.forEach((path) => {
    path.style.strokeDashoffset = 0;
    path.style.strokeDasharray = 32;
  });

  let transitionTimeout;
  trigger.addEventListener("click", () => {
    html.classList.toggle("overflow-hidden");
    header.classList.toggle("mobile-open");

    pathClasses.forEach((className) => paths[2].classList.toggle(className));
    if (search) search.classList.toggle("max-lg:hidden");
    clearTimeout(transitionTimeout);

    if (header.classList.contains("mobile-open")) {
      animationPaths.forEach((path) => {
        path.style.strokeDashoffset = 36;
        path.style.strokeDasharray = 36;

        transitionTimeout = setTimeout(() => {
          paths[0].setAttribute("d", closePathLines[0]);
          paths[1].setAttribute("d", closePathLines[1]);
          path.classList.add("transitioning");
          path.style.strokeDashoffset = 0;
          path.style.strokeDasharray = 36;
          path.addEventListener("transitionend", () => {
            path.classList.remove("transitioning");
          });
        }, 10);
      });
    } else {
      animationPaths.forEach((path) => {
        path.style.strokeDashoffset = 32;
        path.style.strokeDasharray = 32;

        transitionTimeout = setTimeout(() => {
          paths[0].setAttribute("d", initialPathLines[0]);
          paths[1].setAttribute("d", initialPathLines[1]);
          path.classList.add("transitioning");
          path.style.strokeDashoffset = 0;
          path.style.strokeDasharray = 32;
          path.addEventListener("transitionend", () => {
            path.classList.remove("transitioning");
          });
        }, 10);
      });
    }
  });

  const handleResize = () => {
    const lgScreen = 1024;
    if (window.innerWidth >= lgScreen) return;
    html.classList.remove("overflow-hidden");
    header.classList.remove("mobile-open");

    pathClasses.forEach((className) => paths[2].classList.remove(className));

    paths[0].setAttribute("d", initialPathLines[0]);
    paths[1].setAttribute("d", initialPathLines[1]);
    animationPaths.forEach((path) => {
      path.style.strokeDashoffset = 0;
      path.style.strokeDasharray = 32;
    });
  };

  window.addEventListener("resize", handleResize);

  const updateScrolledState = () => {
    if (window.scrollY > 0) {
      header.classList.add("is-sticky");
    } else {
      header.classList.remove("is-sticky");
    }
  };
  window.addEventListener("scroll", updateScrolledState, { passive: true });
  updateScrolledState();
});
