'use strict';

angular.module('users').controller('MainFeedController', ['$scope', '$http',
    function ($scope, $http) {
      $scope.mainFeed = 'HELLO MAIN FEED';
      //var feed = new MainFeed();
      //$scope.tweets = feed();
      //console.log($scope, $http);
      //$http({
      //  method: 'GET',
      //  url: 'https://api.twitter.com/1.1/statuses/home_timeline.json?count=3&exclude_replies=true'
      //})
      //.then(function(data){
      //  $scope.tweets = data.data;
      //  console.log($scope.tweets);
      //});
      $scope.go = function (url){
        $http.get(url).then(function(data){
            $scope.recentPeeps = data.data.overview;
            $scope.stream = data.data.stream;
          console.log(data);
        });
      };
    }
]);
