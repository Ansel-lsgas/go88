document.addEventListener("DOMContentLoaded", function () {
  const html = document.querySelector("html");
  const header = document.querySelector(".site-header");
  const container = document.querySelector(".site-header__container");
  const nav = document.querySelector("#header_nav");
  const search = document.querySelector('#header_search')
  const nestedDropdownTriggers = nav.querySelectorAll(".dropdown__item.btn--dropdown .dropdown__trigger")
  if (!html || !header || !container || !nav) return;
  const trigger = header.querySelector("#header_trigger");
  if (!trigger) return;
  const paths = trigger.querySelectorAll("path");
  if (!paths.length) return;

  const headerClasses = ["fixed", "h-screen", "bg-white"];
  const containerClasses = ["items-start", "h-fit"];
  const navClasses = ["flex-col", "max-lg:hidden"];
  const pathClasses = ["opacity-0", "translate-x-full"];
  const initialPathLines = ["M4 8H36", "M4 32H36"];
  const closePathLines = ["M8 8L32 32", "M8 32L32 8"];
  const nestedDropdownTriggerClasses = ["!text-primary", "bg-alpha/10"]

  const animationPaths = [paths[0], paths[1]];
  animationPaths.forEach((path) => {
    path.style.strokeDashoffset = 0;
    path.style.strokeDasharray = 32;
  });

  let transitionTimeout;
  trigger.addEventListener("click", () => {
    html.classList.toggle("overflow-hidden");
    headerClasses.forEach((className) => header.classList.toggle(className));
    containerClasses.forEach((className) =>
      container.classList.toggle(className),
    );
    navClasses.forEach((className) => nav.classList.toggle(className));
    pathClasses.forEach((className) => paths[2].classList.toggle(className));
    if(search) search.classList.toggle("max-lg:hidden")
    clearTimeout(transitionTimeout);

    if (header.classList.contains("fixed")) {
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
    headerClasses.forEach((className) => header.classList.remove(className));
    containerClasses.forEach((className) =>
      container.classList.remove(className),
    );
    navClasses.forEach((className) => nav.classList.remove(className));
    pathClasses.forEach((className) => paths[2].classList.remove(className));
    nestedDropdownTriggerClasses.forEach((className) => nestedDropdownTriggers.forEach(trigger => trigger.classList.remove(className)));
    nav.classList.add("max-lg:hidden");
    if(search) search.classList.add("max-lg:hidden")

    paths[0].setAttribute("d", initialPathLines[0]);
    paths[1].setAttribute("d", initialPathLines[1]);
    animationPaths.forEach((path) => {
      path.style.strokeDashoffset = 0;
      path.style.strokeDasharray = 32;
    });
  };

  window.addEventListener("resize", handleResize);
});