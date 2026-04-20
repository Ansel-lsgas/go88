import Swiper from "swiper";
import { Autoplay, Pagination } from "swiper/modules";

Swiper.use([Autoplay, Pagination]);

const heroSlider = () => {
  const swiperElement = document.querySelector("#hero_slider");
  if (!swiperElement) return;

  const swiper = new Swiper(swiperElement, {
    direction: "horizontal",
    slidesPerView: "auto",
    spaceBetween: 0,
    centeredSlides: false,
    preventClicks: false,
    preventClicksPropagation: false,
    loop: true,
    speed: 2000,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    grabCursor: true,
    mousewheel: false,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: function (index, className) {
      return `
        <span class="${className}">
          <span class="child"></span>
        </span>
      `;
    },
    },
  });
};

export default heroSlider;
