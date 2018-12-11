'use strict';

var effectLevelLine = document.querySelector('.effect-level__line'); // полоска вся
var effectLevelPin = document.querySelector('.effect-level__pin'); // кружок
var effectLevelDepth = document.querySelector('.effect-level__depth'); // полоска закрашенная
var effectLevelInput = document.querySelector('.effect-level__value');

var ESC_KEYCODE = 27;

var bigPicture = document.querySelector('.big-picture');
var elementBody = document.body;
var pictureListElement = document.querySelector('.pictures'); // ищу элемент с .pictures
var pictureCardTemple = document
    .querySelector('#picture') // ищу #picture
    .content
    .querySelector('.picture'); // в нем ищу .picture

var commentsTemplate = bigPicture.querySelector('.social__comment');

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
  return array[getRandomNum(array.length, 0)];
};

var getComments = function (allComents) {
  var fncComments = [];
  for (var i = 0; i < getRandomNum(0, 5); i++) {
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

var renderBigPicture = function (picture) {
  bigPicture.classList.remove('hidden');
  elementBody.classList.add('modal-open');

  var commentsFragment = document.createDocumentFragment();
  // собираем комментарии
  picture.comments.forEach(function (item) {

    var commentElement = commentsTemplate.cloneNode(true);
    commentElement.querySelector('.social__picture').src =
            'img/avatar-' + getRandomNum(6, 1) + '.svg';
    commentElement.querySelector('.social__text').textContent = item;
    commentsFragment.appendChild(commentElement);
  });

  bigPicture.querySelector('.big-picture__img img').src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.comments-count').textContent =
        picture.comments.length;
  bigPicture.querySelector('.social__comments').innerHTML = '';
  bigPicture.querySelector('.social__comments').appendChild(commentsFragment);
  bigPicture.querySelector('.social__caption').textContent =
        picture.description;
};

var socialCommentCount = document.querySelector('.social__comment-count');
socialCommentCount.classList.add('visually-hidden');

var commentsLoader = document.querySelector('.comments-loader');
commentsLoader.classList.add('visually-hidden');

renderPictures();

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


// загрзузка своей картинки
var uploadInput = document.querySelector('#upload-file');
var uploadForm = document.querySelector('.img-upload__overlay');

var uploadFormEscClose = function (evt) {
  if (evt.keyCode === ESC_KEYCODE && focusOrBlur !== 'focus') {
    uploadInput.value = '';
    uploadFormClose();
  }
};

var uploadFormClose = function () {
  uploadForm.classList.add('hidden');
  uploadInput.value = '';
  document.removeEventListener('keydown', uploadFormEscClose);
};

var uploadOpen = function () {
  uploadForm.classList.remove('hidden');
  uploadForm
        .querySelector('.img-upload__cancel')
        .addEventListener('click', uploadFormClose);
  document.addEventListener('keydown', uploadFormEscClose);
};

uploadInput.addEventListener('change', uploadOpen);
// ***

// добавляем фильтры

var effectBar = document.querySelector('.img-upload__effect-level');
effectBar.classList.add('hidden');

var effects = document.querySelectorAll('.effects__preview');
effects.forEach(function (element) {
  element.addEventListener('click', function () {
    var allClassEffect = element.classList;
    getEffectPicture(allClassEffect[1]);

    effectLevelPin.style.left = '100%';
    effectLevelDepth.style.width = '100%';

  });
});

var getEffectPicture = function (effect) {
  var uploadImg = document.querySelector('.img-upload__preview img');
  uploadImg.classList = ''; // чистим класс
  uploadImg.style = '';
  uploadImg.classList.add(effect); // навешиваем класс

  if (uploadImg.className === 'effects__preview--none') {
    effectBar.classList.add('hidden');
  } else {
    effectBar.classList.remove('hidden');
  }
};
// хэштег
var hashtagInput = document.querySelector('.text__hashtags');

var focusOrBlur = '';
hashtagInput.addEventListener('focus', function () {
  focusOrBlur = 'focus';
});
hashtagInput.addEventListener('blur', function () {
  focusOrBlur = 'blur';
});

hashtagInput.addEventListener('change', function (e) {
  var val = hashtagInput.value.trim();
  var tags = val.split(' ').filter(function (tag) {
    return tag !== '';
  });
  var validationResult = hashTagsValidate(tags);
  e.target.setCustomValidity(validationResult);
});


// валидация всей строки
var hashTagsValidate = function (tags) {
  if (tags.length > 5) {
    return 'Не должно превышать 5';
  }
  if (checkTagRepit(tags)) {
    return 'не должны повторяться';
  }

  var result = tags.map(function (tag) {
    return tagValidate(tag);
  })
    .filter(function (err) {
      return err !== '';
    });

  return result.length === 0 ? '' : result[0];
};

// валидация отдельного тега
var tagValidate = function (tag) {
  tag = tag.toUpperCase();
  var fl = tag.slice(0, 1);
  if (fl !== '#') {
    return 'должен начинаться с #';
  }
  if (tag.length > 20) {
    return 'не должно быть символов больше 20';
  }

  tag = tag.slice(1);
  if (/#/.test(tag)) {
    return 'должны разделяться пробелами';
  }
  return '';
};

var checkTagRepit = function (tags) {
  var tagsMap = {};
  var validationError = false;
  tags.forEach(function (tag) {
    if (tagsMap.hasOwnProperty(tag)) {
      validationError = true;
    } else {
      tagsMap[tag] = true;
    }
  });
  return validationError;
};


// навешиваю стили в зависимости от класса
var effectValues = {
  HEAT_MAX: 3,
  HEAT_MIN: 1,
  PHOBOS_MAX: 3,
  MARVIN_MAX: 100,
  DEFAULT: 100
};

var uploadPreviewImg = document.querySelector('.img-upload__preview img');

var getEffectStyle = function (effectClass, proportion) {
  var effect = '';

  if (effectClass.className === 'effects__preview--chrome') {
    effect = 'grayscale(' + proportion + ')';
  } else if (effectClass.className === 'effects__preview--sepia') {
    effect = 'sepia(' + proportion + ')';
  } else if (effectClass.className === 'effects__preview--marvin') {
    effect = 'invert(' + (proportion * effectValues.MARVIN_MAX) + '%)';
  } else if (effectClass.className === 'effects__preview--phobos') {
    effect = 'blur(' + (proportion * effectValues.PHOBOS_MAX).toFixed(2) + 'px)';
  } else if (effectClass.className === 'effects__preview--heat') {
    effect = 'brightness(' + ((proportion * (effectValues.HEAT_MAX - effectValues.HEAT_MIN)) + effectValues.HEAT_MIN).toFixed(2) + ')';
  }
  uploadPreviewImg.style.filter = effect;
};


// ловлю координаты спина
effectLevelPin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();
  // начальные координаты
  var startCoords = {
    x: evt.clientX
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();
    // движение координат по нажатию мыши
    var shift = {
      x: startCoords.x - moveEvt.clientX
    };

    startCoords = {
      x: moveEvt.clientX
    };

    var value;
    if (moveEvt.clientX > effectLevelLine.getBoundingClientRect().right) {
      value = effectLevelDepth.offsetWidth + 'px';
    } else if (moveEvt.clientX < effectLevelLine.getBoundingClientRect().left) {
      value = '0px';
    } else {
      value = (effectLevelPin.offsetLeft - shift.x) + 'px';
    }
    effectLevelPin.style.left = value;
    effectLevelDepth.style.width = value;

    var proportion = (effectLevelPin.offsetLeft / effectLevelLine.offsetWidth).toFixed(2);
    effectLevelInput.value = proportion * 100;
    getEffectStyle(uploadPreviewImg, proportion);

  };

  var onMouseUp = function () {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

// ресайз
var resizeMinus = document.querySelector('.scale__control--smaller');
var resizePlus = document.querySelector('.scale__control--bigger');
var resizeInput = document.querySelector('.scale__control--value');
var scale = {
  MIN: 25,
  MAX: 100,
  DAFAULT: 100,
  STEP: 25
};

var resizeImage = function (sign) {
  var value = resizeInput.value;
  value = parseInt(value, 10) + scale.STEP * sign;
  if (value > scale.MAX) {
    value = scale.MAX;
  } else if (value < scale.MIN) {
    value = scale.MIN;
  }
  uploadPreviewImg.style.transform = 'scale(' + (value / 100) + ')';
  resizeInput.value = value + '%';
};
resizeMinus.addEventListener('click', function () {
  resizeImage(-1);
});
resizePlus.addEventListener('click', function () {
  resizeImage(1);
});
