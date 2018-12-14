'use strict';
(function () {
  var resizeMinus = document.querySelector('.scale__control--smaller'); // минус
  var resizePlus = document.querySelector('.scale__control--bigger'); // плюс
  var resizeInput = document.querySelector('.scale__control--value'); // инпут для ресайза
  var uploadPreviewImg = document.querySelector('.img-upload__preview img');

  var effectLevelLine = document.querySelector('.effect-level__line'); // полоска вся
  var effectLevelPin = document.querySelector('.effect-level__pin'); // кружок
  var effectLevelDepth = document.querySelector('.effect-level__depth'); // полоска закращенная
  var effectLevelInput = document.querySelector('.effect-level__value');

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
})();
