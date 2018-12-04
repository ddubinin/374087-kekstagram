'use strict';

var elementBody = document.body;
// создаю массив комментов
var comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
// массив описания
var descriptions = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var photos = [];

// функция рандомного числа по мин и максу
var getRandomNum = function (max, min) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// рандомный элемент из массива
var getRandomElement = function (array) {
  // return array[Math.floor(Math.random() * array.length)];
  return array[getRandomNum(array.length, 0)];
};

var getComments = function (allComents) {
  var fncComments = [];
  for (var i = 0; i < getRandomNum(0, 3); i++) {
    fncComments.push(allComents[getRandomNum(0, 5)]);
  }
  return fncComments;
};

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

var pictureListElement = document.querySelector('.pictures'); // ищу элемент с .pictures
var pictureCardTemple = document
  .querySelector('#picture') // ищу #picture
  .content // (?!)
  .querySelector('.picture'); // в нем ищу .picture

var createCardPicture = function (picture) {
  var pictureElement = pictureCardTemple.cloneNode(true); // клонирую .picture в #picture
  pictureElement.querySelector('.picture__img').src = picture.url; // ищу .picture__img и дабавляю src
  pictureElement.querySelector('.picture__likes').textContent = picture.likes; // ищу .picture__likes прописываю лайки
  pictureElement.querySelector('.picture__comments').textContent =
    picture.comments.length; // ищу .picture__comments и прописываю комменты
  pictureElement.addEventListener('click', function () {
  // @oldfox нужно переждать функции какие данные отображать
    // все что нам нужно для отображения находится в объекте picture его и передадим
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

var bigPicture = document.querySelector('.big-picture');
// @oldfox получаем данные для отображения
var renderBigPicture = function (picture) {
  bigPicture.classList.remove('hidden');
  // на body вешаем .modal-open
  // @oldfox вынесем выше - правило - 'определяем/находим и кэшим'  для периспользуемых данных
  // var elementBody = document.body;
  elementBody.classList.add('modal-open');
  // @oldfox каждый раз при клике получаем нужные нам данные из объекта picture переданного замыканием
  var bigPicturePhoto = picture;
  var commentsFragment = document.createDocumentFragment();
  var commentsTemplate = bigPicture.querySelector('.social__comment');

  // собираем комментарии
  bigPicturePhoto.comments.forEach(function (item) {
    var commentElement = commentsTemplate.cloneNode(true);
    commentElement.querySelector('.social__picture').src =
      'img/avatar-' + getRandomNum(6, 1) + '.svg';
    commentElement.querySelector('.social__text').textContent = item;
    commentsFragment.appendChild(commentElement);
  });

  bigPicture.querySelector('.big-picture__img img').src = bigPicturePhoto.url;
  bigPicture.querySelector('.likes-count').textContent = bigPicturePhoto.likes;
  bigPicture.querySelector('.comments-count').textContent =
    bigPicturePhoto.comments.length;
  bigPicture.querySelector('.social__comments').innerHTML = '';
  bigPicture.querySelector('.social__comments').appendChild(commentsFragment);
  bigPicture.querySelector('.social__caption').textContent =
    bigPicturePhoto.description;
};

var socialCommentCount = document.querySelector('.social__comment-count');
socialCommentCount.classList.add('visually-hidden');

var commentsLoader = document.querySelector('.comments-loader');
commentsLoader.classList.add('visually-hidden');

renderPictures();
// renderBigPicture();

var ESC_KEYCODE = 27;

// закрытие большой картинки
var getCloseBigPicture = function () {
  elementBody.classList.remove('modal-open');
  bigPicture.classList.add('hidden');
  var inputFile = document.querySelector('.img-upload__input');
  inputFile.val = '';
};
// закрытие по клику
var CloseBigPicture = document.querySelector('.big-picture__cancel');
CloseBigPicture.addEventListener('click', function () {
  getCloseBigPicture();
});
// закрытие на ESC
document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    getCloseBigPicture();
  }
});
