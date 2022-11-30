const catalogList = document.querySelector('.catalog-list');
const catalogMore = document.querySelector('.catalog__more');

let prodQuantity = 5;
let dataLength = null;

const normalPrice = (str) => {
  return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
};

if(catalogList) {
  const loadProducts = (quantity = 5) => {
    fetch('../data/data.json')
    .then((response) => {
      return response.json();
    })
    .then((data) => {

      dataLength = data.length;

      catalogList.innerHTML = '';

      for(i = 0; i < dataLength; i++) {
        if(i < quantity) {
          let item = data[i];
          console.log(item);

          catalogList.innerHTML += `
            <li class="catalog-list__item">
              <article class="product">
                <div class="product__image">
                  <img src="${item.mainImage}" alt="${item.title}">
                  <div class="product__btns">
                    <button class="btn-reset product__btn" data-id ="${item.id}" aria-label="Показать информацию о товаре">
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
      const productTitle = document.querySelectorAll('.product__title');
        productTitle.forEach(el => {
          $clamp(el, {clamp:'22px'});
        });
    });
  };

  loadProducts(prodQuantity);
}
