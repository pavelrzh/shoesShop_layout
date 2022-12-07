const cartBtn = document.querySelectorAll('.cart__btns');
const miniCart = document.querySelector('.mini-cart');

cartBtn.forEach(element => {
  element.addEventListener('click', (e) => {
    if (e.target.dataset.toggle == 'modal') {
      e.preventDefault();
    document.querySelector('.mini-cart').classList.add('mini-cart--visible');
    console.log(e.target)
    }

  })
});
  // miniCart.classList.toggle('mini-cart--visible');

document.addEventListener('click', (e) => {
  if(!e.target.closest(".header__cart ")) {
    miniCart.classList.remove('mini-cart--visible')
  }
});
