const { default: heroSlider } = require("../fragments/_hero_slider");
const { default: productionSlider } = require("../fragments/_production_slider");



document.addEventListener("DOMContentLoaded", function () {
  heroSlider()
  productionSlider()
});
