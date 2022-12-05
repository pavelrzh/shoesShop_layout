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
    fetch('../data/data.json')
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
                    <button class="btn-reset product__btn" aria-label="Добавить товар в корзину">
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
      const modal = new GraphModal({                      //открытие модалки
        isOpen: (modal) => {
          const openBtnId = modal.previousActiveElement.dataset.id;

          // t = (window.innerWidth - document.body.offsetWidth)+"px";
          // document.body.style.paddingRight = t;

          loadModalData(openBtnId);

          prodSlider.update();
        },
        isClose: () => {
          console.log('closed');
        }
      });
    });
  };

  loadProducts(prodQuantity);

  const loadModalData = (id = 1) => {                  //загрузка данных для модалки
    fetch('../data/data.json')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        prodModalSlider.innerHTML = '';
        prodModalPreview.innerHTML ='';
        prodModalInfo.innerHTML = '';
        prodModalDescr.innerHTML = '';
        prodModalChars.innerHTML = '';
        prodModalVideo.innerHTML = '';



        for(let dataItem of data) {
          if (dataItem.id == id) {
            console.log(dataItem);

            const slides = dataItem.gallery.map(image => {
              return `
              <div class="swiper-slide">
                <img src="${image}" alt="">
              </div>
              `;
            });
            const preview = dataItem.gallery.map((image, idx) => {
              return `
              <div class="modal-preview__item" data-index="${idx}">
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


          }
        }
      })
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


