'use strict';
(function () {
  // @oldfox window.data.PHOTOS
  // var pictures = [];
  var generatePicture = function (i) {
    return {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: window.util.getRandomNum(200, 15),
      comments: window.util.getComments(window.data.COMMENTS),
      description: window.util.getRandomElement(window.data.DESCRIPTION)
    };
  };

  var getPictures = function (pictureNum) {
    var pictures = [];
    for (var i = 0; i < pictureNum; i++) {
      pictures.push(generatePicture(i));
    }
    return pictures;
  };

  window.picture = {
    // @oldfox window.data.PHOTOS
    // pictures: pictures,
    getPictures: getPictures,
  };
})();
