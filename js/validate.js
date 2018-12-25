'use strict';
(function () {
  var TAG_MAXIMUM = 5;
  var TAG_MAX_LENGTH = 20;
  var TEXT_MAX_LENGTH = 140;

  var descriptionValidate = function (symbols) {
    if (symbols.length > TEXT_MAX_LENGTH) {
      return 'Не должно превышать 140';
    } else {
      return '';
    }
  };

  var hashTagsValidate = function (tags) {

    if (tags.length > TAG_MAXIMUM) {
      return 'Не должно превышать 5';
    }
    if (checkTagRepit(tags)) {
      return 'не должны повторяться';
    }

    var result = tags.map(function (tag) {
      return tagValidate(tag);
    }).filter(function (err) {
      return err !== '';
    });
    return result.length === 0 ? '' : result[0];

  };

  var tagValidate = function (tag) {
    if (tag === '#') {
      return 'не должен состоять только из #';
    }

    if (tag[0] !== '#') {
      return 'должен начинаться с #';
    }

    if (tag.length > TAG_MAX_LENGTH) {
      return 'не должно быть символов больше 20';
    }

    return '';
  };

  var checkTagRepit = function (tags) {
    var double = tags.filter(function (tag, indx, tagsArr) {
      return indx !== tagsArr.indexOf(tag);
    });
    return double.length > 0;
  };

  window.validate = {
    hashTagsValidate: hashTagsValidate,
    descriptionValidate: descriptionValidate
  };
})();
