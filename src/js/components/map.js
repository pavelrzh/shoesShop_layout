ymaps.ready(init);
  function init(){
      // Создание карты.
      const myMap = new ymaps.Map("map", {
          center: [59.93, 30.36],
          // Уровень масштабирования. Допустимые значения:
          // от 0 (весь мир) до 19.
          zoom: 12
      });
      myPlacemark = new ymaps.Placemark([59.93881324988926,30.42935656559991], {}, {  // Координаты метки объекта
        iconLayout: "default#image",
        iconImageHref: "../../img/Exclude-1.svg", // Ссылка на изображение
        iconImageSize: [25, 35], // Размер изображения
        iconImageOffset: [-3, -42] // Положение изображения
      });
      myPlacemark2 = new ymaps.Placemark([59.92839473388033,30.358905787021758], {}, {  // Координаты метки объекта
        iconLayout: "default#image",
        iconImageHref: "../../img/Exclude-2.svg", // Ссылка на изображение
        iconImageSize: [25, 35], // Размер изображения
        iconImageOffset: [-3, -42] // Положение изображения
      });
      myPlacemark3 = new ymaps.Placemark([59.95160179506928,30.323613157396778], {}, {  // Координаты метки объекта
        iconLayout: "default#image",
        iconImageHref: "../../img/Exclude-2.svg", // Ссылка на изображение
        iconImageSize: [25, 35], // Размер изображения
        iconImageOffset: [-3, -42] // Положение изображения
      });

      myMap.geoObjects.add(myPlacemark);
      myMap.geoObjects.add(myPlacemark2);
      myMap.geoObjects.add(myPlacemark3);
    }


