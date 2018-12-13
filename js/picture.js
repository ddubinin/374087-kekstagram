'use strict';
(function () {
  var picture = [];
  var generatePicture = function (i) {
    return {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: window.util.getRandomNum(200, 15),
      comments: window.util.getComments(window.data.COMMENTS),
      description: window.util.getRandomElement(window.data.DESCRIPTION)
    };
  };

  var getPictures = function (pictureNum) {
    // var picture = [];
    for (var i = 0; i < pictureNum; i++) {
      picture.push(generatePicture(i));
    }
    return picture;
  };

    window.picture = {
    picture: picture,
    getPictures: getPictures,
    // createCardPicture: createCardPicture
  };
})();
