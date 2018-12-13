'use strict';
(function () {
  var elementBody = document.body;
  var ESC_KEYCODE = 27;

  var resizeMinus = document.querySelector('.scale__control--smaller'); // минус
  var resizePlus = document.querySelector('.scale__control--bigger'); // плюс
  var resizeInput = document.querySelector('.scale__control--value'); // инпут для ресайза

  var effectLevelLine = document.querySelector('.effect-level__line'); // полоска вся
  var effectLevelPin = document.querySelector('.effect-level__pin'); // кружок
  var effectLevelDepth = document.querySelector('.effect-level__depth'); // полоска закращенная
  var effectLevelInput = document.querySelector('.effect-level__value');

  var bigPicture = document.querySelector('.big-picture');

  var pictureListElement = document.querySelector('.pictures'); // ищу элемент с .pictures // нигде почему-то дальше не юзается
  var pictureCardTemple = document.querySelector('#picture')
    .content
    .querySelector('.picture'); // в #picture нем ищу .picture
  var commentsTemplate = bigPicture.querySelector('.social__comment');
  var uploadPreviewImg = document.querySelector('.img-upload__preview img');
  var socialCommentCount = document.querySelector('.social__comment-count');
  socialCommentCount.classList.add('visually-hidden');

  var commentsLoader = document.querySelector('.comments-loader');
  commentsLoader.classList.add('visually-hidden');

  var scale = {
    MIN: 25,
    MAX: 100,
    DAFAULT: 100,
    STEP: 25
  };

  var effectValues = {
    HEAT_MAX: 3,
    HEAT_MIN: 1,
    PHOBOS_MAX: 3,
    MARVIN_MAX: 100,
    DEFAULT: 100
  };

  // ресайз
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

  var renderBigPicture = function () {
    bigPicture.classList.remove('hidden');
    elementBody.classList.add('modal-open');

    var commentsFragment = document.createDocumentFragment();
    // собираем комментарии
    window.data.COMMENTS.forEach(function (item) {

      var commentElement = commentsTemplate.cloneNode(true);
      commentElement.querySelector('.social__picture').src =
              'img/avatar-' + window.util.getRandomNum(6, 1) + '.svg';
      commentElement.querySelector('.social__text').textContent = item;
      commentsFragment.appendChild(commentElement);
    });

    bigPicture.querySelector('.big-picture__img img').src = window.picture.picture.url;
    bigPicture.querySelector('.likes-count').textContent = window.picture.picture.likes;
    bigPicture.querySelector('.comments-count').textContent = window.data.COMMENTS.length;
    bigPicture.querySelector('.social__comments').innerHTML = '';
    bigPicture.querySelector('.social__comments').appendChild(commentsFragment);
    bigPicture.querySelector('.social__caption').textContent = window.data.DESCRIPTION;
  };

  var getCloseBigPicture = function () {
    elementBody.classList.remove('modal-open');
    bigPicture.classList.add('hidden');
    var inputFile = document.querySelector('.img-upload__input');
    inputFile.val = '';
  };

  resizeMinus.addEventListener('click', function () {
    resizeImage(-1);
  });
  resizePlus.addEventListener('click', function () {
    resizeImage(1);
  });

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

  window.preview = {
    pictureListElement:pictureListElement,
    pictureCardTemple: pictureCardTemple,
    renderBigPicture: renderBigPicture,
    ESC_KEYCODE: ESC_KEYCODE
  };
})();
