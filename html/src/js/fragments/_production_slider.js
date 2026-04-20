import Swiper from "swiper";
import { Autoplay, Pagination } from "swiper/modules";

Swiper.use([Autoplay]);

const productionSlider = () => {
  const swiperElement = document.querySelector("#production_slider");
  if (!swiperElement) return;
  const wrapper = swiperElement.querySelector(".swiper-wrapper");
  if (!wrapper) return;

  const slides = wrapper.innerHTML;
  wrapper.innerHTML = slides + slides;

  const swiper = new Swiper(swiperElement, {
    direction: "horizontal",
    slidesPerView: "2",
    spaceBetween: 0,
    centeredSlides: true,
    preventClicks: false,
    preventClicksPropagation: false,
    breakpoints: {
      0: {
        slidesPerView: "1.8",
      },
      480:  {
        slidesPerView: "2",
      },
      640:  {
        slidesPerView: "3",
      },
      1024:  {
        slidesPerView: "2.5",
      },
      1120: {
        slidesPerView: "3",
      }

    },
    loop: true,
    speed: 1000,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    grabCursor: true,
    mousewheel: false,
  });
};

export default productionSlider;
