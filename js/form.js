'use strict';
(function () {
  // хэштег
  var hashtagInput = document.querySelector('.text__hashtags');
  var uploadInput = document.querySelector('#upload-file');
  var uploadForm = document.querySelector('.img-upload__overlay');
  var main = document.querySelector('main');
  var successTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');
  var errorTempalte = document.querySelector('#error')
      .content
      .querySelector('.error');
  var form = document.querySelector('.img-upload__form');
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

  var uploadFormEscClose = function (evt) {
    if (evt.keyCode === window.data.ESC_KEYCODE && focusOrBlur !== 'focus') {
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

  var createSuccesMsg = function () {
    var successElement = successTemplate.cloneNode(true);
    var successButton = successElement.querySelector('button');
    successButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      closeSuccessMsg(successElement);
    });
    successElement.addEventListener('click', function () {
      closeSuccessMsg(successElement);
    });
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.data.ESC_KEYCODE) {
        closeSuccessMsg(successElement);
      }
    });
    return successElement;
  };
  var successMsg = function () {
    var fragment = document.createDocumentFragment();
    main.appendChild(createSuccesMsg(fragment));
  };

  var createErrorMsg = function () {
    var errorElement = errorTempalte.cloneNode(true);
    var buttons = errorElement.querySelectorAll('.error__button');
    buttons[0].addEventListener('click', function (evt) {
      evt.preventDefault();
      window.backend.upload(new FormData(form), onLoad, onError);
      errorElement.style.display = 'none';
    });
    buttons[1].addEventListener('click', function (evt) {
      evt.preventDefault();
      closeErrorMsg(errorElement);
    });
    errorElement.addEventListener('click', function () {
      closeErrorMsg(errorElement);
    });
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.data.ESC_KEYCODE) {
        closeErrorMsg(errorElement);
      }
    });
    return errorElement;
  };
  var closeSuccessMsg = function (successElement) {
    successElement.style.display = 'none';
  };
  var closeErrorMsg = function (errorElement) {
    errorElement.style.display = 'none';
  };
  var errorMsg = function () {
    var fragment = document.createDocumentFragment();
    main.appendChild(createErrorMsg(fragment));
  };

  var onLoad = function () {
    uploadFormClose();
    successMsg();
  };

  var onError = function () {
    uploadFormClose();
    errorMsg();
  };

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(form), onLoad, onError);
  });

})();
