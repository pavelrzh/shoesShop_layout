const cartBtn = document.querySelectorAll('.cart__btns');
const miniCart = document.querySelector('.mini-cart');


cartBtn.forEach(element => {
  element.addEventListener('click', (e) => {
    e.preventDefault();

    miniCart.classList.toggle('mini-cart--visible');
    console.log(e.target)

  })
});
document.addEventListener('click', (e) => {
  if(!e.target.closest('.mini-cart') && e.target.classList.contains('.mini-cart') && !e.target.classList.contains('cart__btns')) {
    miniCart.classList.remove('mini-cart--visible')
  }
});
// !e.target.closest('.mini-cart') && !e.target.classList.contains('cart__btns')
// !e.target.closest('.mini-cart') && e.target.classList.contains('.mini-cart') && !e.target.classList.contains('cart__btns')
