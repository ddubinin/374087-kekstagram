'use strict';
(function () {
  var PIN_LEFT_MAX = '453px';
  var PERCENT_MAX = 100;
  var WIDTH_SLIDER = 453;
  var FILTER_BLUR_MAX = 3;
  var FILTER_BRIGHTNESS_MAX = 3;
  var FILTER_BRIGHTNESS_MIN = 1;
  var imgUploadPreview = document.querySelector('.img-upload__preview img');
  var imgUploadEffectLevel = document.querySelector('.img-upload__effect-level');
  var effectLevelDepth = document.querySelector('.effect-level__depth');
  var effectsItem = document.querySelectorAll('.effects__item');
  var effectLevelPin = document.querySelector('.effect-level__pin');
  var effectLevelValue = document.querySelector('.effect-level__value');
  var positionPin;
  var positionPinPercents;
  var EffectMap = {
    chrome: 'grayscale(1)',
    sepia: 'sepia(1)',
    marvin: 'invert(100%)',
    phobos: 'blur(3px)',
    heat: 'brightness(3)',
    none: 'none'
  };
  var Scale = {
    MIN: 25,
    MAX: 100,
    DAFAULT: 100,
    STEP: 25
  };
  var resizeMinus = document.querySelector('.scale__control--smaller'); // минус
  var resizePlus = document.querySelector('.scale__control--bigger'); // плюс
  var resizeInput = document.querySelector('.scale__control--value'); // инпут для ресайза
  resizeInput.value = '100%';

  var defaultPicture = function () {
    imgUploadPreview.style.transform = 'scale(1)';
    resizeInput.value = '100%';
    imgUploadPreview.style.filter = 'none';
  };

  var setNoneFilter = function () {
    if (imgUploadPreview.className !== '') {
      imgUploadPreview.classList.remove(imgUploadPreview.className);
      imgUploadPreview.style.filter = 'none';
    }
  };

  var setImageEffect = function (effectName) {
    imgUploadPreview.classList.add('effects__preview--' + effectName);

    if (effectName !== 'none') {
      effectLevelPin.style.left = PIN_LEFT_MAX;
      effectLevelDepth.style.width = '100%';
      imgUploadEffectLevel.classList.remove('visually-hidden');
    } else {
      imgUploadEffectLevel.classList.add('visually-hidden');
    }

    imgUploadPreview.style.filter = EffectMap[effectName];
  };

  effectsItem.forEach(function (li) {
    li.addEventListener('click', function (e) {
      setNoneFilter();
      setImageEffect(e.currentTarget.children[0].value);
    });
  });

  effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
      };

      startCoords = {
        x: moveEvt.clientX,
      };

      positionPin = effectLevelPin.offsetLeft - shift.x;
      effectLevelPin.style.left = (positionPin) + 'px';
      positionPinPercents = Math.round(positionPin * PERCENT_MAX / WIDTH_SLIDER);
      effectLevelValue.value = positionPinPercents;
      document.querySelector('.effect-level__depth').style.width = effectLevelValue.value + '%';

      if (imgUploadPreview.className === 'effects__preview--chrome') {
        imgUploadPreview.style.filter = 'grayscale(' + (positionPinPercents / PERCENT_MAX) + ')';
      }
      if (imgUploadPreview.className === 'effects__preview--sepia') {
        imgUploadPreview.style.filter = 'sepia(' + (positionPinPercents / PERCENT_MAX) + ')';
      }
      if (imgUploadPreview.className === 'effects__preview--marvin') {
        imgUploadPreview.style.filter = 'invert(' + positionPinPercents + '%)';
      }
      if (imgUploadPreview.className === 'effects__preview--phobos') {
        imgUploadPreview.style.filter = 'blur(' + (positionPinPercents * FILTER_BLUR_MAX / PERCENT_MAX) + 'px)';
      }
      if (imgUploadPreview.className === 'effects__preview--heat') {
        imgUploadPreview.style.filter = 'brightness(' + (positionPinPercents * (FILTER_BRIGHTNESS_MAX - FILTER_BRIGHTNESS_MIN) / PERCENT_MAX + FILTER_BRIGHTNESS_MIN) + ')';
      }
      if (imgUploadPreview.className === 'effects__preview--none') {
        imgUploadPreview.style.filter = 'none';
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // ресайз
  var resizeImage = function (sign) {
    var value = resizeInput.value;
    value = parseInt(value, 10) + Scale.STEP * sign;
    if (value > Scale.MAX) {
      value = Scale.MAX;
    } else if (value < Scale.MIN) {
      value = Scale.MIN;
    }
    imgUploadPreview.style.transform = 'scale(' + value / 100 + ')';
    resizeInput.value = value + '%';
  };

  resizeMinus.addEventListener('click', function () {
    resizeImage(-1);
  });
  resizePlus.addEventListener('click', function () {
    resizeImage(1);
  });

  window.effects = {
    defaultPicture: defaultPicture // пойдет в form.js на закрытие или отправку
  }
})();
