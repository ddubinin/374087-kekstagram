'use strict';
(function () {
  // хэштег
  var hashtagInput = document.querySelector('.text__hashtags');
  var textarea = document.querySelector('.text__description');
  var uploadInput = document.querySelector('#upload-file');
  var uploadForm = document.querySelector('.img-upload__overlay');
  var uploadFormEsc = uploadForm.querySelector('.img-upload__cancel');
  var main = document.querySelector('main');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorTempalte = document.querySelector('#error').content.querySelector('.error');
  var form = document.querySelector('.img-upload__form');
  var imgUploadEffectLevel = document.querySelector('.img-upload__effect-level');
  var focusOrBlur = false;

  hashtagInput.addEventListener('focus', function () {
    focusOrBlur = true;
  });
  hashtagInput.addEventListener('blur', function () {
    focusOrBlur = false;
  });

  textarea.addEventListener('change', function (e) {
    var textValue = textarea.value;
    var validationResult = window.validate.descriptionValidate(textValue);
    e.target.setCustomValidity(validationResult);
  });
  

  hashtagInput.addEventListener('change', function (e) {
    var val = hashtagInput.value.trim();
    var tags = val.split(' ').filter(function (tag) {
      return tag !== '';
    });
    var validationResult = window.validate.hashTagsValidate(tags);
    e.target.setCustomValidity(validationResult);
  });


  var uploadFormEscClose = function (evt) {
    if (evt.keyCode === window.data.ESC_KEYCODE && !focusOrBlur) {
      uploadInput.value = '';
      uploadFormClose();
    }
  };

  var uploadFormClose = function () {
    uploadForm.classList.add('hidden');
    uploadInput.value = '';
    textarea.value = '';
    document.removeEventListener('keydown', uploadFormEscClose);
    uploadFormEsc.removeEventListener('click', uploadFormClose);
  };

  var uploadFormOpen = function () {
    uploadForm.classList.remove('hidden');
    imgUploadEffectLevel.classList.add('visually-hidden');
    uploadFormEsc.addEventListener('click', uploadFormClose);
    document.addEventListener('keydown', uploadFormEscClose);
  };

  uploadInput.addEventListener('change', uploadFormOpen);

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
      window.backend.upload(new FormData(form), onSuccess, onError);
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

  var onSuccess = function () {
    uploadFormClose();
    successMsg();
  };

  var onError = function () {
    uploadFormClose();
    errorMsg();
  };

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(form), onSuccess, onError);
  });

})();
