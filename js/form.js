'use strict';
// хэштег
var hashtagInput = document.querySelector('.text__hashtags');
var uploadInput = document.querySelector('#upload-file');
var uploadForm = document.querySelector('.img-upload__overlay');

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

// загрзузка своей картинки
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