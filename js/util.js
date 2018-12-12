'use strict';
(function () {
  // // функция рандомного числа по мин и максу
  // var getRandomNum = function (max, min) {
  //   return Math.floor(Math.random() * (max - min)) + min;
  // };

  // // рандомный элемент из массива
  // var getRandomElement = function (array) {
  //   return array[getRandomNum(array.length, 0)];
  // };

  // var getComments = function (allComents) {
  //   var fncComments = [];
  //   for (var i = 0; i < getRandomNum(0, 5); i++) {
  //     fncComments.push(allComents[getRandomNum(0, 5)]);
  //   }
  //   return fncComments;
  // };

  window.util = {
    getRandomNum: function (max, min) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    getRandomElement: function (array) {
      return array[window.util.getRandomNum(array.length, 0)];
    },
    getComments: function (allComents) {
      var fncComments = [];
      for (var i = 0; i < window.util.getRandomNum(0, 5); i++) {
        fncComments.push(allComents[window.util.getRandomNum(0, 5)]);
      }
      return fncComments;
    }
  };
})();
