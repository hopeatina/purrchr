'use strict'

angular.module('users').controller('MainFeedController', ['$scope', '$http', 'moment', '$state', 'Authentication', 'Menus', 'MainFeed',
        function ($scope, $http, moment, $state, Authentication, Menus, MainFeed) {
            $scope.$state = $state;
            $scope.authentication = Authentication;
            $scope.sortOptions = ["Frequency","Recent","Dopeness", "Virality", "Number of Tweets", "Fire"];

            // Get the topbar menu
            $scope.menu = Menus.getMenu('topbar');
            $scope.mainFeed = 'HELLO MAIN FEED';

            console.log($scope.tweetsCollapsed, $scope.timelineConfig);
            $scope.goPerUser = function () {
                var feed = MainFeed;
                feed.getHomies().then(function (data) {
                    if (data.data.stream != undefined) {
                        $scope.recentPeeps = data.data.overview;
                        if (data.data.stream != undefined)
                        {$scope.stream = data.data.stream;
                        var toUTC = moment.utc(data.data.stream[data.data.stream.length - 1].created_at + 'UTC').toDate();
                        $scope.dataUpTo = moment(toUTC).format("h:mm, MM/DD");
                        console.log(toUTC);
                        console.log(data);}
                    } else{

                    }
                })
            };

            $scope.go = function (url) {
                $http.get(url).then(function (data) {
                    $scope.recentPeeps = data.data.overview;
                    if (data.data.stream != undefined)
                    {
                    $scope.stream = data.data.stream;
                    var toUTC = moment.utc(data.data.stream[data.data.stream.length - 1].created_at + 'UTC').toDate();
                    $scope.dataUpTo = moment(toUTC).format("h:mm, MM/DD");
                    console.log(toUTC);
                    console.log(data);}
                });
            };
        }
    ])
    .controller('SingleTweetCtrl', ['$scope', '$http', 'moment',
        function ($scope, $http, moment) {
            $scope.timelineConfig = {
                horizontalLayout: true,
                color: "55acee",
                height: 80,
                width: 600,
                showLabels: true,
                labelFormat: "%I:%M"
            };
            $scope.tweetsCollapsed = false;
            $scope.toggleTweets = function () {
                $scope.tweetsCollapsed = $scope.tweetsCollapsed ? false : true;
                $scope.timelineConfig = $scope.tweetsCollapsed ? {
                    horizontalLayout: false,
                    color: "55acee",
                    height: 400,
                    width: 70,
                    showLabels: true,
                    labelFormat: "%I:%M"
                } : {
                    horizontalLayout: true,
                    color: "55acee",
                    height: 60,
                    width: 600,
                    showLabels: true,
                    labelFormat: "%I:%M"
                };
                console.log($scope.timelineConfig, $scope.tweetsCollapsed);
            };
        }])
    .controller('HashtagsController',['$scope', '$http', 'moment', 'Authentication',
        function ($scope, $http, moment, Authentication) {
            $scope.selectedHashtag= "#hashtags";
            $scope.suggestedHashtags = ["RIPTwitter","Purrchrocks","TeamFollowBack","SolidSaturdays"];
            $scope.toggleSettings = function(){
                $scope.isOpen = $scope.isOpen ? false: true;
                console.log($scope.isOpen);
            };
            $scope.switchHash = function (chip) {
                console.log(chip);
                $scope.selectedHashtag = "#"+chip;
                $scope.go('/api/feed/hashtagtimeline');
            };
            $scope.go = function (url) {
                console.log(url);
                $scope.auth = Authentication;
                $http.get(url, { params: {
                    hashtag: $scope.selectedHashtag
                }}).then(function (data) {
                    $scope.recentPeeps = data.data.overview;
                    $scope.stream = data.data.stream;
                    var toUTC = moment.utc(data.data.stream[data.data.stream.length - 1].created_at + 'UTC').toDate();
                    $scope.dataUpTo = moment(toUTC).format("h:mm, MM/DD");
                    console.log(toUTC);
                    console.log(data);
                });
            };

            $scope.sortOptions = ["Recent","Dopeness", "Virality", "Number of Tweets", "Fire"]

        }]);
