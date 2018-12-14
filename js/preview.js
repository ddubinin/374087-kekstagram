'use strict';
(function () {
  var elementBody = document.body;

  var bigPicture = document.querySelector('.big-picture');
  var commentsTemplate = bigPicture.querySelector('.social__comment');
  var socialCommentCount = document.querySelector('.social__comment-count');
  socialCommentCount.classList.add('visually-hidden');
  var commentsLoader = document.querySelector('.comments-loader');
  commentsLoader.classList.add('visually-hidden');

  var renderBigPicture = function (picture) {
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

    bigPicture.querySelector('.big-picture__img img').src = picture.url;
    bigPicture.querySelector('.likes-count').textContent = picture.likes;
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

  // закрытие по клику
  var CloseBigPicture = document.querySelector('.big-picture__cancel');
  CloseBigPicture.addEventListener('click', function () {
    getCloseBigPicture();
  });
  // закрытие на ESC
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.data.ESC_KEYCODE) {
      getCloseBigPicture();
    }
  });

  window.preview = {
    renderBigPicture: renderBigPicture
  };
})();
