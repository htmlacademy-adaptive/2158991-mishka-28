let navMain = document.querySelector('.main-nav');
let navToggle = document.querySelector('.main-nav__toggle');

navMain.classList.remove('main-nav--nojs');

navToggle.addEventListener('click', function () {
  if (navMain.classList.contains('main-nav--closed')) {
    navMain.classList.remove('main-nav--closed');
    navMain.classList.add('main-nav--opened');
  } else {
    navMain.classList.add('main-nav--closed');
    navMain.classList.remove('main-nav--opened');
  }
});

let button=document.querySelector(".week-product__button");
let modal=document.querySelector(".modal");

button.addEventListener("click",function () {
  modal.classList.add("modal--open");
  })

window.onclick = function(o){
  o.target == modal && (modal.classList.remove("modal--open"),document.body.style.overflow="")
};
