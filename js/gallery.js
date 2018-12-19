'use strict';
(function () {
  var NEW_POSTS_COUNT = 10;
  var imgFiltres = document.querySelector('.img-filters');
  imgFiltres.classList.remove('img-filters--inactive');
  var imgFiltresBtns = document.querySelectorAll('.img-filters__button');
  var imgFiltresBtnActive = 'img-filters__button--active';


  var toggleClass = function(element, allElements, className){
    allElements.forEach (function (button) {
      button.classList.remove(className);
    }); 
      element.classList.add(className);
  };

  var getFiltres = function (item){
    if (item.tagName === 'BUTTON') {
      toggleClass(item, imgFiltresBtns, imgFiltresBtnActive);
    }
    cleanCardPicture();

    if (item.id === 'filter-popular') {
      renderPictures();
    } else if (item.id === 'filter-new') {
      newRandomPosts();
    } else if (item.id === 'filter-discussed') {
      console.log("try to sort ", window.data.PHOTOS[0].comments);
      sortByComments(window.data.PHOTOS);
    }
  };

  imgFiltresBtns.forEach( function (item) {
    item.addEventListener('click',function() {
      getFiltres(item);
    });
  });
  // чистит фотки
  var cleanCardPicture = function () {
    var posts = document.querySelectorAll('.picture');
    for (var i = 0; i < posts.length; i++) {
      posts[i].parentNode.removeChild(posts[i]);
    }
  };
  // соритирую по комментам
  var sortByComments = function (pictures) {
    console.log('pictures in sort', pictures.length, pictures[0]);    
    var newPictures = pictures.slice(0);    
    return newPictures.sort(function (first, second) {      
      return second.comments.length - first.comments.length;
    });
  };
  // var newRandomPosts = function (pictures) {
  //   var mixedPictures = window.utils.shuffleArray(pictures);
  //   return mixedPictures.slice(0, NEW_POSTS_COUNT);
  // };



  var pictureListElement = document.querySelector('.pictures');
  var pictureCardTemple = document.querySelector('#picture')
    .content
    .querySelector('.picture'); // в #picture нем ищу .picture

  var createCardPicture = function (image) {
    var pictureElement = pictureCardTemple.cloneNode(true); // клонирую .picture в #picture
    pictureElement.querySelector('.picture__img').src = image.url; // ищу .picture__img и дабавляю src
    pictureElement.querySelector('.picture__likes').textContent = image.likes; // ищу .picture__likes прописываю лайки
    pictureElement.querySelector('.picture__comments').textContent = window.data.COMMENTS.length; // ищу .picture__comments и прописываю комменты
    pictureElement.addEventListener('click', function () {
      window.preview.renderBigPicture(image);
    });
    return pictureElement;
  };
  var renderPictures = function () {
    console.log('call renderPictures');
    var fragment = document.createDocumentFragment();
    window.data.PHOTOS = window.picture.getPictures(25);
    console.log("render ", window.data.PHOTOS);
    for (var i = 0; i < window.data.PHOTOS.length; i++) {
      fragment.appendChild(createCardPicture(window.data.PHOTOS[i]));
    }
    pictureListElement.appendChild(fragment);
  };

  renderPictures();
})();
