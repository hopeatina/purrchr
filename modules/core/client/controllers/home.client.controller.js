'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication','$state','$window',
  function ($scope, Authentication, $state,$window) {
    $window.Maitre = { uuid: "MF3af70aaa3f" };
    console.log($window);

    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.callOauthProvider = function (url) {
      console.log( "CALLOAUTHPROVIDER", url, encodeURIComponent($state.previous.href).toString());
      if ($state.previous != undefined && $state.previous.href != undefined) {
        url += '?redirect_to=' + '/feed';
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);
