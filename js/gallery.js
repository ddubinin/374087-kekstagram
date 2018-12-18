'use strict';
(function () {

  var pictureListElement = document.querySelector('.pictures');
  var pictureCardTemple = document.querySelector('#picture')
    .content
    .querySelector('.picture'); // в #picture нем ищу .picture

  var createCardPicture = function (image) {
    var pictureElement = pictureCardTemple.cloneNode(true); // клонирую .picture в #picture
    pictureElement.querySelector('.picture__img').src = image.url; // ищу .picture__img и дабавляю src
    pictureElement.querySelector('.picture__likes').textContent = image.likes; // ищу .picture__likes прописываю лайки
    pictureElement.querySelector('.picture__comments').textContent = window.data.COMMENTS.length; // ищу .picture__comments и прописываю комменты
    pictureElement.addEventListener('click', function () {
      window.preview.renderBigPicture(image);
    });
    return pictureElement;
  };
  var renderPictures = function () {
    var fragment = document.createDocumentFragment();
    window.data.PHOTOS = window.picture.getPictures(25);
    for (var i = 0; i < window.data.PHOTOS.length; i++) {
      fragment.appendChild(createCardPicture(window.data.PHOTOS[i]));
    }
    pictureListElement.appendChild(fragment);
  };

  renderPictures();
})();
