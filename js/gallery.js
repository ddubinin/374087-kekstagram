'use strict';
(function () {
  var NEW_POSTS_COUNT = 10;
  var imgFiltres = document.querySelector('.img-filters');
  imgFiltres.classList.remove('img-filters--inactive');
  var imgFiltresBtns = document.querySelectorAll('.img-filters__button');
  var imgFiltresBtnActive = 'img-filters__button--active';

  var filterPopularButton = document.querySelector('#filter-popular');
  var filterNewButton = document.querySelector('#filter-new');
  var filterDiscussedButton = document.querySelector('#filter-discussed');

  var pictureListElement = document.querySelector('.pictures');
  var pictureCardTemple = document.querySelector('#picture').content.querySelector('.picture');

  var fragment = document.createDocumentFragment();

  var createCardPicture = function (image) {
    var pictureElement = pictureCardTemple.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = image.url;
    pictureElement.querySelector('.picture__likes').textContent = image.likes;
    pictureElement.querySelector('.picture__comments').textContent = image.comments.length;
    pictureElement.addEventListener('click', function () {
      window.preview.renderBigPicture(image);
    });

    return pictureElement;
  };
  var renderPictures = function (data) {
    data.forEach(function (pic) {
      fragment.appendChild(createCardPicture(pic));
    });
    pictureListElement.appendChild(fragment);
  };

  var onSuccess = function (data) {
    window.data.PHOTOS = data;
    renderPictures(window.data.PHOTOS.slice(0));
  };

  var createErrorMsg = function (errorMsg) {
    var main = document.querySelector('main');
    var newDiv = document.createElement('div');
    newDiv.innerHTML = '<p style="text-align:center">' + errorMsg + '</p>';
    main.appendChild(newDiv);
  };

  var onError = function (errorMsg) {
    createErrorMsg(errorMsg);
  };

  var toggleClass = function (element, className) {
    imgFiltresBtns.forEach(function (button) {
      button.classList.remove(className);
    });
    element.classList.add(className);
  };

  window.backend.download(onSuccess, onError);

  filterPopularButton.addEventListener('click', function (e) {
    getFiltres(e.target);
    toggleClass(filterPopularButton, imgFiltresBtnActive);
  });

  filterNewButton.addEventListener('click', function (e) {
    getFiltres(e.target);
    toggleClass(filterNewButton, imgFiltresBtnActive);
  });

  filterDiscussedButton.addEventListener('click', function (e) {
    getFiltres(e.target);
    toggleClass(filterDiscussedButton, imgFiltresBtnActive);
  });

  var getFiltres = function (item) {

    cleanCardPicture();

    if (item.id === 'filter-popular') {
      renderPictures(window.data.PHOTOS);
    } else if (item.id === 'filter-new') {
      renderPictures(newRandomPosts(window.data.PHOTOS));
    } else if (item.id === 'filter-discussed') {
      renderPictures(sortByComments(window.data.PHOTOS));
    }
  };

  // чистит фотки
  var cleanCardPicture = function () {
    var posts = document.querySelectorAll('.picture');
    for (var i = 0; i < posts.length; i++) {
      posts[i].parentNode.removeChild(posts[i]);
    }
  };
  // соритирую по комментам
  var sortByComments = function (pictures) {
    var newPictures = pictures.slice(0);
    return newPictures.sort(function (first, second) {
      return second.comments.length - first.comments.length;
    });
  };
  // рандомит посты
  var newRandomPosts = function (pictures) {
    var mixedPictures = shuffleArray(pictures);
    return mixedPictures.slice(0, NEW_POSTS_COUNT);
  };
  var shuffleArray = function (array) {
    var newArray = array.slice(0);
    return newArray.sort(function () {
      return 0.5 - Math.random();
    });
  };
})();
