'use strict';
(function () {
  window.resizeMinus = document.querySelector('.scale__control--smaller'); // минус
  window.resizePlus = document.querySelector('.scale__control--bigger'); // плюс
  window.resizeInput = document.querySelector('.scale__control--value'); // инпут для ресайза
  window.effectLevelLine = document.querySelector('.effect-level__line'); // полоска вся
  window.effectLevelPin = document.querySelector('.effect-level__pin'); // кружок
  window.effectLevelDepth = document.querySelector('.effect-level__depth'); // полоска закращенная
  window.effectLevelInput = document.querySelector('.effect-level__value');
  window.bigPicture = document.querySelector('.big-picture');
  window.elementBody = document.body;
  window.pictureListElement = document.querySelector('.pictures'); // ищу элемент с .pictures
  window.pictureCardTemple = document.querySelector('#picture').content.querySelector('.picture'); // в #picture нем ищу .picture
  window.commentsTemplate = window.bigPicture.querySelector('.social__comment');
  window.uploadPreviewImg = document.querySelector('.img-upload__preview img');
  window.socialCommentCount = document.querySelector('.social__comment-count');
  window.socialCommentCount.classList.add('visually-hidden');
  window.commentsLoader = document.querySelector('.comments-loader');
  window.commentsLoader.classList.add('visually-hidden');
  window.ESC_KEYCODE = 27;

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
  window.preview = {
    resizeImage: function (sign) {
      var value = window.resizeInput.value;
      value = parseInt(value, 10) + scale.STEP * sign;
      if (value > scale.MAX) {
        value = scale.MAX;
      } else if (value < scale.MIN) {
        value = scale.MIN;
      }
      window.uploadPreviewImg.style.transform = 'scale(' + (value / 100) + ')';
      window.resizeInput.value = value + '%';
    },

    getEffectStyle: function (effectClass, proportion) {
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
      window.uploadPreviewImg.style.filter = effect;
    },

    getEffectPicture: function (effect) {
      var uploadImg = document.querySelector('.img-upload__preview img');
      uploadImg.classList = ''; // чистим класс
      uploadImg.style = '';
      uploadImg.classList.add(effect); // навешиваем класс

      if (uploadImg.className === 'effects__preview--none') {
        effectBar.classList.add('hidden');
      } else {
        effectBar.classList.remove('hidden');
      }
    },

    renderBigPicture: function () {
      window.bigPicture.classList.remove('hidden');
      window.elementBody.classList.add('modal-open');

      var commentsFragment = document.createDocumentFragment();
      // собираем комментарии
      window.picture.picture.comments.forEach(function (item) {

        var commentElement = window.commentsTemplate.cloneNode(true);
        commentElement.querySelector('.social__picture').src =
                'img/avatar-' + window.util.getRandomNum(6, 1) + '.svg';
        commentElement.querySelector('.social__text').textContent = item;
        commentsFragment.appendChild(commentElement);
      });

      window.bigPicture.querySelector('.big-picture__img img').src = window.picture.picture.url;
      window.bigPicture.querySelector('.likes-count').textContent = window.picture.picture.likes;
      window.bigPicture.querySelector('.comments-count').textContent = window.picture.picture.comments.length;
      window.bigPicture.querySelector('.social__comments').innerHTML = '';
      window.bigPicture.querySelector('.social__comments').appendChild(commentsFragment);
      window.bigPicture.querySelector('.social__caption').textContent = window.picture.picture.description;
    },

    getCloseBigPicture: function () {
      window.elementBody.classList.remove('modal-open');
      window.bigPicture.classList.add('hidden');
      var inputFile = document.querySelector('.img-upload__input');
      inputFile.val = '';
    },
  };

  // var resizeImage = function (sign) {
  //   var value = resizeInput.value;
  //   value = parseInt(value, 10) + scale.STEP * sign;
  //   if (value > scale.MAX) {
  //     value = scale.MAX;
  //   } else if (value < scale.MIN) {
  //     value = scale.MIN;
  //   }
  //   uploadPreviewImg.style.transform = 'scale(' + (value / 100) + ')';
  //   resizeInput.value = value + '%';
  // };
  window.resizeMinus.addEventListener('click', function () {
    window.preview.resizeImage(-1);
  });
  window.resizePlus.addEventListener('click', function () {
    window.preview.resizeImage(1);
  });

  // навешиваю стили в зависимости от класса

  // var getEffectStyle = function (effectClass, proportion) {
  //   var effect = '';

  //   if (effectClass.className === 'effects__preview--chrome') {
  //     effect = 'grayscale(' + proportion + ')';
  //   } else if (effectClass.className === 'effects__preview--sepia') {
  //     effect = 'sepia(' + proportion + ')';
  //   } else if (effectClass.className === 'effects__preview--marvin') {
  //     effect = 'invert(' + (proportion * effectValues.MARVIN_MAX) + '%)';
  //   } else if (effectClass.className === 'effects__preview--phobos') {
  //     effect = 'blur(' + (proportion * effectValues.PHOBOS_MAX).toFixed(2) + 'px)';
  //   } else if (effectClass.className === 'effects__preview--heat') {
  //     effect = 'brightness(' + ((proportion * (effectValues.HEAT_MAX - effectValues.HEAT_MIN)) + effectValues.HEAT_MIN).toFixed(2) + ')';
  //   }
  //   uploadPreviewImg.style.filter = effect;
  // };

  // ловлю координаты спина
  window.effectLevelPin.addEventListener('mousedown', function (evt) {
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
      if (moveEvt.clientX > window.effectLevelLine.getBoundingClientRect().right) {
        value = window.effectLevelDepth.offsetWidth + 'px';
      } else if (moveEvt.clientX < window.effectLevelLine.getBoundingClientRect().left) {
        value = '0px';
      } else {
        value = (window.effectLevelPin.offsetLeft - shift.x) + 'px';
      }
      window.effectLevelPin.style.left = value;
      window.effectLevelDepth.style.width = value;

      var proportion = (window.effectLevelPin.offsetLeft / window.effectLevelLine.offsetWidth).toFixed(2);
      window.effectLevelInput.value = proportion * 100;
      window.preview.getEffectStyle(window.uploadPreviewImg, proportion);

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
      window.preview.getEffectPicture(allClassEffect[1]);

      window.effectLevelPin.style.left = '100%';
      window.effectLevelDepth.style.width = '100%';
    });
  });

  // var getEffectPicture = function (effect) {
  //   var uploadImg = document.querySelector('.img-upload__preview img');
  //   uploadImg.classList = ''; // чистим класс
  //   uploadImg.style = '';
  //   uploadImg.classList.add(effect); // навешиваем класс

  //   if (uploadImg.className === 'effects__preview--none') {
  //     effectBar.classList.add('hidden');
  //   } else {
  //     effectBar.classList.remove('hidden');
  //   }
  // };


  // var renderBigPicture = function (picture) {
  //   bigPicture.classList.remove('hidden');
  //   elementBody.classList.add('modal-open');

  //   var commentsFragment = document.createDocumentFragment();
  //   // собираем комментарии
  //   picture.comments.forEach(function (item) {

  //     var commentElement = commentsTemplate.cloneNode(true);
  //     commentElement.querySelector('.social__picture').src =
  //             'img/avatar-' + getRandomNum(6, 1) + '.svg';
  //     commentElement.querySelector('.social__text').textContent = item;
  //     commentsFragment.appendChild(commentElement);
  //   });

  //   bigPicture.querySelector('.big-picture__img img').src = picture.url;
  //   bigPicture.querySelector('.likes-count').textContent = picture.likes;
  //   bigPicture.querySelector('.comments-count').textContent =
  //         picture.comments.length;
  //   bigPicture.querySelector('.social__comments').innerHTML = '';
  //   bigPicture.querySelector('.social__comments').appendChild(commentsFragment);
  //   bigPicture.querySelector('.social__caption').textContent =
  //         picture.description;
  // };


  // закрытие по клику
  var CloseBigPicture = document.querySelector('.big-picture__cancel');
  CloseBigPicture.addEventListener('click', function () {
    window.preview.getCloseBigPicture();
  });
  // закрытие на ESC
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.ESC_KEYCODE) {
      window.preview.getCloseBigPicture();
    }
  });

  // закрытие большой картинки
  // var getCloseBigPicture = function () {
  //   elementBody.classList.remove('modal-open');
  //   bigPicture.classList.add('hidden');
  //   var inputFile = document.querySelector('.img-upload__input');
  //   inputFile.val = '';
  // };

})();
