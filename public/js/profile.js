const swiper = new Swiper('.swiper-container', {
  slidesPerView: 1,
  spaceBetween: 10,
  slidesPerGroup: 1,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    720: {
      slidesPerView: 2,
      spaceBetween: 5,
      slidesPerGroup: 2,
    },
    960: {
      slidesPerView: 3,
      spaceBetween: 10,
      slidesPerGroup: 3,
    },
  },
});

const avatarImage = $('img.rounded-circle');
let width = avatarImage.width();
avatarImage.css({ height: width + 'px' });

$(window).resize(function () {
  let width = avatarImage.width();
  avatarImage.css({ height: width + 'px' });
});
