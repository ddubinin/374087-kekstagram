'use strict';
(function () {
  var picture = [];
  var generatePicture = function (i) {
    return {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: window.util.getRandomNum(200, 15),
      comments: window.util.getComments(window.data.COMMENTS),
      description: window.util.getRandomElement(window.data.DESCRIPTION)
    };
  };

  var getPictures = function (pictureNum) {

    for (var i = 0; i < pictureNum; i++) {
      picture.push(generatePicture(i));
    }
    return picture;
  };

  var createCardPicture = function (picture) {
    var picturetElement = window.preview.pictureCardTemple.cloneNode(true); // клонирую .picture в #picture
    picturetElement.querySelector('.picture__img').src = picture.url; // ищу .picture__img и дабавляю src
    picturetElement.querySelector('.picture__likes').textContent = picture.likes; // ищу .picture__likes прописываю лайки
    picturetElement.querySelector('.picture__comments').textContent = window.data.COMMENTS.length; // ищу .picture__comments и прописываю комменты
    picturetElement.addEventListener('click', function () {
      window.preview.renderBigPicture(picture);
    });
    return picturetElement;
  };
  var renderPictures = function () {
    var fragment = document.createDocumentFragment();
    window.data.PHOTOS = getPictures(25);
    for (var i = 0; i < window.data.PHOTOS.length; i++) {
      fragment.appendChild(createCardPicture(window.data.PHOTOS[i]));
    }
    window.preview.pictureListElement.appendChild(fragment);
  };

  window.picture = {
    renderPictures: renderPictures
  };

  renderPictures();
})();
