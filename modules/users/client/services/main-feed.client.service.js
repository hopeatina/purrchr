'use strict';

// Authentication service for user variables
angular.module('users').factory('MainFeed', ['$http','$state', 'Authentication', 'Menus',
    function ($http, $state, Authentication, Menus) {
      var auth = Authentication;
      var Feed = { setBaseline: null,getFavs: null,getHomies: null };
      Feed.setBaseline = function (count) {
          count = count || 100;
          $http.get('api/feed/hometimeline/' + count)
              .then(function (data) {
                  var tweets = data.data;
                  console.log(tweets);
              });
      };
        Feed.getHomies =
            function () {
                return $http.get('/currentUserTimeline', auth.user);
            };

      return Feed;
    }
]);
