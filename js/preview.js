'use strict';
(function () {
  var MAX_START_COMMENT = 5;
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var elementBody = document.body;

  var bigPicture = document.querySelector('.big-picture');
  var bigPictureImg = bigPicture.querySelector('.big-picture__img img');
  var bigPictureLikes = bigPicture.querySelector('.likes-count');
  var bigPictureCommentsCount = bigPicture.querySelector('.comments-count');
  var bigPictureComments = bigPicture.querySelector('.social__comments');
  var bigPictureCaption = bigPicture.querySelector('.social__caption');
  var commentsTemplate = bigPicture.querySelector('.social__comment');
  var bigPictureCancel = document.querySelector('.big-picture__cancel');

  // var socialCommentCount = bigPicture.querySelector('.social__comment-count');
  // socialCommentCount.classList.add('visually-hidden');

  var commentsLoader = bigPicture.querySelector('.comments-loader');

  var step = 0;
  var comments = [];

  commentsLoader.addEventListener('click', function () {
    step = step + 5;
    renderComments(step);
  });

  var renderComments = function (steps) {
    bigPictureComments.innerHTML = '';
    var addedComments = comments.slice(0, MAX_START_COMMENT + steps);
    var commentsFragment = document.createDocumentFragment();
    addedComments.forEach(function (comment) {
      var commentElement = commentsTemplate.cloneNode(true);
      commentElement.querySelector('.social__picture').src = comment.avatar;
      commentElement.querySelector('.social__text').textContent = comment.message;
      commentsFragment.appendChild(commentElement);
    });

    if (addedComments.length < MAX_START_COMMENT + steps) {
      commentsLoader.classList.add('visually-hidden');
    } else {
      commentsLoader.classList.remove('visually-hidden');
    }

    bigPictureComments.appendChild(commentsFragment);
  };

  var renderBigPicture = function (picture) {
    bigPicture.classList.remove('hidden');
    elementBody.classList.add('modal-open');
    bigPicture.focus();

    step = 0;
    comments = picture.comments;
    renderComments(step);

    bigPictureCancel.addEventListener('click', onCancelClick);
    bigPictureCancel.addEventListener('keydown', onCancelKeydown);
    document.addEventListener('keydown', onEscKeydown);

    bigPictureImg.src = picture.url;
    bigPictureLikes.textContent = picture.likes;
    bigPictureCommentsCount.textContent = picture.comments.length;
    // bigPictureComments.innerHTML = ';
    bigPictureCaption.textContent = picture.description;
  };

  var onEscKeydown = function (e) {
    if (e.keyCode === ESC_KEYCODE) {
      closeBigPicture();
    }
  };

  var onCancelKeydown = function (e) {
    if (e.keyCode === ENTER_KEYCODE) {
      closeBigPicture();
    }
  };

  var onCancelClick = function () {
    closeBigPicture();
  };

  var closeBigPicture = function () {
    bigPictureCancel.removeEventListener('click', onCancelClick);
    bigPictureCancel.removeEventListener('keydown', onCancelKeydown);
    document.removeEventListener('keydown', onEscKeydown);
    elementBody.classList.remove('modal-open');
    bigPicture.classList.add('hidden');
    bigPictureComments.innerHTML = '';
  };

  window.preview = {
    renderBigPicture: renderBigPicture
  };
})();
