import Swiper from '../vendor/swiper.min.js';

const catalogList = document.querySelector('.catalog-list');
const catalogMore = document.querySelector('.catalog__more');
const prodModal = document.querySelector('[data-graph-target="prod-modal"] .graph-modal__content');
const prodModalSlider = prodModal.querySelector('.modal-slider .swiper-wrapper');
const prodModalPreview = prodModal.querySelector('.modal-slider .modal-preview');
const prodModalInfo = prodModal.querySelector('.modal-info__wrapper');
const prodModalDescr = prodModal.querySelector('.modal-prod-descr');
const prodModalChars = prodModal.querySelector('.prod-chars');
const prodModalVideo = prodModal.querySelector('.prod-modal__video');

let modal = null;

let prodQuantity = 6;
let dataLength = null;

const normalPrice = (str) => {
  return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
};

const prodSlider = new Swiper('.modal-slider__container', {
  slidesPerView: 1,
  spaceBetween: 20
});

if(catalogList) {
  const loadProducts = (quantity = 6) => {
    fetch('data/data.json')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      dataLength = data.length;
      catalogList.innerHTML = '';


      for(let i = 0; i < dataLength; i++) {
        if(i < quantity) {
          let item = data[i];
          console.log(item);

          catalogList.innerHTML += `
            <li class="catalog-list__item">
              <article class="product">
                <div class="product__image">
                  <img src="${item.mainImage}" alt="${item.title}">
                  <div class="product__btns">
                    <button class="btn-reset product__btn" data-id ="${item.id}" data-graph-path="prod-modal" aria-label="Показать информацию о товаре">
                      <svg>
                        <use xlink:href="img/sprite.svg#eye"></use>
                      </svg>
                    </button>
                    <button class="btn-reset product__btn product__btn--cart" data-id ="${item.id}" aria-label="Добавить товар в корзину">
                      <svg>
                        <use xlink:href="img/sprite.svg#cart"></use>
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 class="product__title">${item.title}</h3>
                <span class="product__price">${normalPrice(item.price)} p</span>
              </article>
          </li>
        `;
        }
      }
    })
    .then(() => {
      const productTitle = document.querySelectorAll('.product__title');  //обрезка названия >22px
        productTitle.forEach(el => {
          $clamp(el, {clamp:'22px'});
        });

        const productsBtns = document.querySelectorAll('.product__btn');

        productsBtns.forEach(el => {
          el.addEventListener('focus', (e) => {
            let parent = e.currentTarget.closest('.product__btns');
            parent.classList.add('product__btns--active');
          }, true);

          el.addEventListener('blur', (e) => {
            let parent = e.currentTarget.closest('.product__btns');
            parent.classList.remove('product__btns--active');
          }, true);
        });

      cartLogic();

      modal = new GraphModal({                                      //открытие модалки
        isOpen: (modal) => {
          if (modal.modalContainer.classList.contains('prod-modal')) {
            const openBtnId = modal.previousActiveElement.dataset.id;

            loadModalData(openBtnId);

            prodSlider.update();
          }
        },
      });
    });
  };

  loadProducts(prodQuantity);

  const loadModalData = (id = 1) => {                  //загрузка данных для модалки
    fetch('data/data.json')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        prodModalSlider.innerHTML = '';
        prodModalPreview.innerHTML ='';
        prodModalInfo.innerHTML = '';
        prodModalDescr.textContent = '';
        prodModalChars.innerHTML = '';
        prodModalVideo.innerHTML = '';

        for(let dataItem of data) {
          if (dataItem.id == id) {
            console.log(dataItem);

            const slides = dataItem.gallery.map((image, idx) => {
              return `
              <div class="swiper-slide" data-index="${idx}">
                <img src="${image}" alt="">
              </div>
              `;
            });
            const preview = dataItem.gallery.map((image, idx) => {
              return `
              <div class="modal-preview__item ${idx==0 ? 'modal-preview__item--active' : ''}" tabindex="0" data-index="${idx}">
                <img src="${image}" alt="">
              </div>
              `;
            });
            const sizes = dataItem.sizes.map((size, idx) => {
              return `
                <li class="modal-sizes__item">
                    <button class="btn-reset modal-sizes__btn">${size}</button>
                </li>
              `;
            });


          prodModalSlider.innerHTML = slides.join('');
          prodModalPreview.innerHTML = preview.join('');
          prodModalInfo.innerHTML = `

          <h3 class="modal-info__title title">${dataItem.title}</h3>
          <div class="modal-info__rate">
            <img src="img/star.svg" alt="Рейтинг 5 из 5">
            <img src="img/star.svg" alt="">
            <img src="img/star.svg" alt="">
            <img src="img/star.svg" alt="">
            <img src="img/star.svg" alt="">
          </div>
          <div class="modal-info__sizes">
            <span class="modal-info__subtitle">Выберите размер</span>
            <ul class="list-reset modal-info__sizes-list modal-sizes">
              ${sizes.join('')}
            </ul>
          </div>
          <div class="modal-info__price">
            <span class="modal-info__current-price">${dataItem.price} p</span>
            <span class="modal-info__old-price">${dataItem.oldPrice ? dataItem.oldPrice + ' p': ''}</span>
          </div>
          `;


          prodModalDescr.textContent = dataItem.description;

          let charsItems = '';
          Object.keys(dataItem.chars).forEach(function eachKey(key) {
            charsItems +=  `<p class="prod-bottom__descr prod-chars__item">${key}: ${dataItem.chars[key]}</p> `
          });

          prodModalChars.innerHTML = charsItems;

          if(dataItem.video) {
            prodModalVideo.style.display = 'block';
            prodModalVideo.innerHTML = `
              <iframe src="${dataItem.video}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `;
            } else {
              prodModalVideo.style.display = 'none';
            }
          }
        }
      })
      .then(() => {
        prodSlider.update();

        prodSlider.on('slideChangeTransitionEnd', function () {
          let idx = document.querySelector('.swiper-slide-active').dataset.index;
          document.querySelectorAll('.modal-preview__item').forEach(el => {el.classList.remove('modal-preview__item--active');});
          document.querySelector(`.modal-preview__item[data-index="${idx}"]`).classList.add('modal-preview__item--active');
        });

        document.querySelectorAll('.modal-preview__item').forEach(el => {
          el.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.dataset.index);
            document.querySelectorAll('.modal-preview__item').forEach(el => {el.classList.remove('modal-preview__item--active');});
            e.currentTarget.classList.add('modal-preview__item--active');

            prodSlider.slideTo(idx);
          });
        });
      });
  };

  catalogMore.addEventListener('click', (e) => {
    prodQuantity = prodQuantity + 3;

    loadProducts(prodQuantity);

    if (prodQuantity >= dataLength) {
      catalogMore.style.display = 'none';
    } else {
      catalogMore.style.display = 'block';
    }
  });
}

/// Корзина

let price = 0;
const miniCart = document.querySelector('.mini-cart');
const miniCartList = document.querySelector('.mini-cart__list');
const fullPrice = document.querySelector('.mini-cart__sum');
const cartCount = document.querySelector('.cart__count');

const priceWithoutSpaces = (str) => {
  return str.replace(/\s/g, '');
};


const plusFullPrice = (currentPrice) => {
  return price += currentPrice;
};

const minusFullPrice = (currentPrice) => {
  return price -= currentPrice;
};

const printFullPrice = () => {
  fullPrice.textContent = `${normalPrice(price)} р`;
};

const printQuantity = (num) => {
  cartCount.textContent = num;
}

const loadCartData = (id = 1) => {                  //загрузка данных для корзины
  fetch('data/data.json')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      for(let dataItem of data) {
        if (dataItem.id == id) {
          miniCartList.insertAdjacentHTML('afterbegin', `

          <li class="mini-cart__item" data-id="${dataItem.id}">
          <article class="mini-cart__product mini-product">
            <div class="mini-product__image">
              <img src="${dataItem.mainImage}" alt="${dataItem.title}">
            </div>
            <div class="mini-product__content">
              <div class="mini-product__text">
                <h3 class="mini-product__title">${dataItem.title}</h3>
                <span class="mini-product__price" data-id="${dataItem.id}">${normalPrice(dataItem.price)} р</span>
              </div>
              <button class="btn-reset mini-product__delete" aria-lebel="Удалить товар"> Удалить
                <svg>
                  <use xlink:href="img/sprite.svg#trash"></use>
                </svg>
              </button>
            </div>
          </article>
        </li>

          `);
          return dataItem;
        }
      }
    })
    .then((item) => {
      plusFullPrice(item.price);
      printFullPrice();

      let num = document.querySelectorAll('.mini-cart__list .mini-cart__item').length;
      if (num > 0) {
        cartCount.classList.add('cart__count--visible');
      }
      printQuantity(num);
    })

};

const cartLogic = () => {

  const productBtn = document.querySelectorAll('.product__btn--cart');

  productBtn.forEach(el => {
    el.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      loadCartData(id);

      document.querySelectorAll('.cart__btns').forEach(e => {                       //запрет клика по пустой корзине
        e.classList.remove('cart__btn--inactive');
      })

      e.currentTarget.classList.add('product__btn--disabled');
    })
  });


  miniCartList.addEventListener('click', (e) => {                        /// Удаление из корзины
    if (e.target.classList.contains('mini-product__delete')) {
      const target = e.target;
      const parent = target.closest('.mini-cart__item');
      const id = parent.dataset.id;
      const price = parseInt(priceWithoutSpaces(parent.querySelector('.mini-product__price').textContent));

      document.querySelector(`.product__btn--cart[data-id="${id}"]`).classList.remove('product__btn--disabled');


      minusFullPrice(price);
      printFullPrice();
      parent.remove();

      let num = document.querySelectorAll('.mini-cart__list .mini-cart__item').length;
      if (num == 0) {
        cartCount.classList.remove('cart__count--visible');
        miniCart.classList.remove('mini-cart--visible');

        document.querySelectorAll('.cart__btns').forEach(e => {                //разрешение клика по НЕ пустой корзине
          e.classList.add('cart__btn--inactive');
        })
      }
      printQuantity(num);
    }
  });


};
// Оформление в корзине

const openOrderModal = document.querySelector('.mini-cart__btn');
const orderModalList = document.querySelector('.cart-modal-order__list');
const orderModalQuantity = document.querySelector('.cart-modal-order__quantity span');
const orderModalSumm = document.querySelector('.cart-modal-order__summ span');
const orderModalShow = document.querySelector('.cart-modal-order__show');


openOrderModal.addEventListener('click', () => {
  const productsHtml = miniCartList.innerHTML;
  orderModalList.innerHTML = productsHtml;

  orderModalQuantity.textContent = `${document.querySelectorAll('.mini-cart__list .mini-cart__item').length} шт`;
  orderModalSumm.textContent = fullPrice.textContent;
});

orderModalShow.addEventListener('click', () => {
  if (orderModalList.classList.contains('cart-modal-order__list--visible')) {
    orderModalList.classList.remove('cart-modal-order__list--visible');
    orderModalShow.classList.remove('cart-modal-order__show--active');
  } else {
    orderModalList.classList.add('cart-modal-order__list--visible');
    orderModalShow.classList.add('cart-modal-order__show--active');
  }

});


orderModalList.addEventListener('click', (e) => {                        /// Удаление из модалки корзины
  if (e.target.classList.contains('mini-product__delete')) {
    const target = e.target;
    const parent = target.closest('.mini-cart__item');
    const id = parent.dataset.id;
    const parentCart = document.querySelector(`.mini-cart__item[data-id="${id}"]`);
    const price = parseInt(priceWithoutSpaces(parent.querySelector('.mini-product__price').textContent));

    document.querySelector(`.product__btn--cart[data-id="${id}"]`).classList.remove('product__btn--disabled');

    minusFullPrice(price);
    printFullPrice();

    parent.remove();
    parentCart.remove();

    orderModalQuantity.textContent = `${document.querySelectorAll('.cart-modal-order__list .mini-cart__item').length} шт`;
    orderModalSumm.textContent = fullPrice.textContent;


    let num = document.querySelectorAll('.cart-modal-order__list .mini-cart__item').length;
    if (num == 0) {
      cartCount.classList.remove('cart__count--visible');
      miniCart.classList.remove('mini-cart--visible');
      modal.close();

      document.querySelectorAll('.cart__btns').forEach(e => {                //разрешение клика по НЕ пустой корзине
        e.classList.add('cart__btn--inactive');
      })
    }
    printQuantity(num);
  }
});
