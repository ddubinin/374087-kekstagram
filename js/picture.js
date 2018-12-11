'use strict';
var generatePicture = function (i) {
  return {
    url: 'photos/' + (i + 1) + '.jpg',
    likes: getRandomNum(200, 15),
    comments: getComments(comments),
    description: getRandomElement(descriptions)
  };
};

var getPictures = function (pictureNum) {
  var picture = [];
  for (var i = 0; i < pictureNum; i++) {
    picture.push(generatePicture(i));
  }
  return picture;
};

var createCardPicture = function (picture) {
  var pictureElement = pictureCardTemple.cloneNode(true); // клонирую .picture в #picture
  pictureElement.querySelector('.picture__img').src = picture.url; // ищу .picture__img и дабавляю src
  pictureElement.querySelector('.picture__likes').textContent = picture.likes; // ищу .picture__likes прописываю лайки

  pictureElement.querySelector('.picture__comments').textContent = picture.comments.length; // ищу .picture__comments и прописываю комменты

  pictureElement.addEventListener('click', function () {
    renderBigPicture(picture);
  });
  return pictureElement;
};

var renderPictures = function () {
  var fragment = document.createDocumentFragment();
  photos = getPictures(25);
  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(createCardPicture(photos[i]));
  }
  pictureListElement.appendChild(fragment);
};