'use strict';

// Authentication service for user variables
angular.module('users').factory('MainFeed', ['$http',
    function ($http) {
      var Feed = { setBaseline: null,getFavs: null };
      Feed.setBaseline = function (count) {
          count = count || 100;
          $http.get('api/feed/hometimeline/' + count)
              .then(function (data) {
                  var tweets = data.data;
                  console.log(tweets);
              });
      };

      return Feed;
    }
]);
