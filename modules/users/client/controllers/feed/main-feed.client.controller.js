'use strict'

angular.module('users').controller('MainFeedController', ['$scope', '$http', 'moment', '$state', 'Authentication',
        'Menus', 'MainFeed', '$interval', 'Socket', '$sce',
        function ($scope, $http, moment, $state, Authentication, Menus, MainFeed, $interval, Socket, $sce) {
            $scope.pos = {
                x : 0,
                y : 0
            };
            $scope.usersHidden = true;
            $scope.showHideUsers = function () {
                $scope.usersHidden = !$scope.usersHidden;
            };

            $scope.counter = 0;
            $scope.getHtml = function (html) {
                return $sce.trustAsHtml(html);
            };

            $scope.count = function() {
                $scope.counter += 1;
            };
            $scope.$state = $state;
            $scope.authentication = Authentication;
            $scope.sortOptions = [
                {name: "Activity", value: "-tweets.length"},
                {name: "Inactivity", value: "tweets.length"},
                {name: "Recent", value: ""}
                //{name: "Dopeness", value: ""},
                //{name: "Virality", value: ""},
                //{name: "Tweet Count", value: ""},
                //{name: "Fire", value: ""}
             ];
            $scope.timeSort = [
                {name: "Past 1 hr" , value: "60"},
                {name: "Past 3 hrs" , value: "240"},
                {name: "Past day" , value: "1440"},
                {name: "Past week" , value: "week"}
            ];

            $scope.updateTimePeriod= function(timeValue){
                MainFeed.getTimeHomies(timeValue).then(function (data) {
                    parseReturnedTweets(data);
                });
            };
            var originatorEv;
            $scope.openMenu = function($mdOpenMenu, ev) {
                originatorEv = ev;
                $mdOpenMenu(ev);
                console.log("Menu should open");
            };
            var self = this, j = 0, counter = 0;
            var temptweet = [];
            $scope.modes = [];
            $scope.activated = true;
            $scope.determinateValue = 30;
            $scope.hovered = 0;
            /**
             * Turn off or on the 5 themed loaders
             */
            $scope.toggleActivation = function () {
                if (!$scope.activated) $scope.modes = [];
                if ($scope.activated) j = counter = 0;
            };
            // Iterate every 100ms, non-stop
            $interval(function () {
                // Increment the Determinate loader
                $scope.determinateValue += 1;
                if ($scope.determinateValue > 100) {
                    $scope.determinateValue = 30;
                }
                // Incrementally start animation the five (5) Indeterminate,
                // themed progress circular bars
                if ((j < 5) && !$scope.modes[j] && $scope.activated) {
                    $scope.modes[j] = 'indeterminate';
                }
                if (counter++ % 4 == 0) j++;
            }, 100, 0, true);
            // Get the topbar menu
            $scope.menu = Menus.getMenu('topbar');
            $scope.mainFeed = 'HELLO MAIN FEED';

            $scope.socket = Socket;
            $scope.updateFeed = function () {
                //console.log(temptweet);
                //checkTweets(temptweet);
                $scope.goPerUser();
                temptweet = [];
                $scope.QueueCount = 0;

                //console.log($scope.recentPeeps)
            };

            function checkTweets(tweets) {


                tweets.forEach(function (tweet, key, tweets) {
                    var inArray = false;
                    //console.log(tweet.user.screen_name,tweet.text);
                    if (tweet.user) {
                        for (var i = 0; i < $scope.recentPeeps.length; i++) {
                            if (tweet.user.id === $scope.recentPeeps[i].user.id || $scope.recentPeeps === []) {
                                inArray = true;
                                $scope.recentPeeps[i].tweets.push({name: tweet.text, date: tweet.created_at});
                            }
                        }
                        if (!inArray) {
                            $scope.recentPeeps.unshift({
                                user: tweet.user,
                                tweets: [{name: tweet.text, date: tweet.created_at}]
                            });
                            //console.log(tweet);
                        }
                    }
                })
            }
            function parseReturnedTweets (data){
                if (data.data.stream != undefined) {
                    $scope.recentPeeps = data.data.overview.Userray;
                    if ($scope.recentPeeps != undefined) {
                        $scope.currentTweets = $scope.recentPeeps.slice(0, 30);
                    }
                    $scope.currentLinks = data.data.linkers;
                    if (data.data.stream != undefined) {
                        $scope.stream = data.data.stream;
                        //console.log(data.data.stream.length);
                        //data.data.stream.forEach(function (user) {
                        //    console.log(user.id, user.user.name);
                        //});
                        var toUTC = moment.utc(data.data.stream[data.data.stream.length - 1].created_at + 'UTC').toDate();
                        $scope.dataUpTo = moment(toUTC).format("h:mm, MM/DD");
                    }
                    //console.log(toUTC);
                    console.log(data);
                } else {

                }
            }

            $scope.goPerUser = function () {
                MainFeed.getHomies().then(function (data) {
                    parseReturnedTweets(data);
                });
            };

            $scope.socket.on("new tweet", function (data) {
                if (data.user) {
                    temptweet.push(data);
                    $scope.QueueCount = temptweet.length;
                    //console.log($scope.QueueCount);
                }
            });
            $scope.socket.on('connected', function (data) {
                emitMsj("start stream");
                console.log("THIS ACTUALLY WORKED SOCKETS: ");

            });
            //$scope.go = function (url) {
            //    $http.get(url).then(function (data) {
            //        $scope.recentPeeps = data.data.overview;
            //        if (data.data.stream != undefined)
            //        {
            //        $scope.stream = data.data.stream;
            //        var toUTC = moment.utc(data.data.stream[data.data.stream.length - 1].created_at + 'UTC').toDate();
            //        $scope.dataUpTo = moment(toUTC).format("h:mm, MM/DD");}
            //        //console.log(toUTC);
            //        //console.log(data);}
            //    });
            //};
            function emitMsj(signal, o) {
                if ($scope.socket) {
                    $scope.socket.emit(signal, o);
                }
                else {
                    console.log("Shit! Socket.io didn't start!");
                }
            }

            $scope.goPerUser();
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
                labelFormat: "%I:%M",
                specials: "inline"
            };
            $scope.tweetsCollapsed = false;
            $scope.expandarrow = $scope.tweetsCollapsed ? "expand_less": "expand_more";
            $scope.toggleTweets = function () {
                $scope.tweetsCollapsed = $scope.tweetsCollapsed ? false : true;
                $scope.expandarrow = $scope.tweetsCollapsed ? "expand_less": "expand_more";
                $scope.timelineConfig = $scope.tweetsCollapsed ? {
                    horizontalLayout: false,
                    color: "55acee",
                    height: 400,
                    width: 70,
                    showLabels: true,
                    labelFormat: "%I:%M",
                    specials: ""
                } : {
                    horizontalLayout: true,
                    color: "55acee",
                    height: 60,
                    width: 600,
                    showLabels: true,
                    labelFormat: "%I:%M",
                    specials: "inline"
                };
            };
            if ($scope.person != undefined) {
                $scope.timeflex = $scope.person.tweets.length == 1 ? 20 : 0;
            }//console.log($scope);


        }])
    .controller('HashtagsController', ['$scope', '$http', 'moment', 'Authentication', '$sce',
        function ($scope, $http, moment, Authentication, $sce) {
            $scope.selectedHashtag = "#hashtags";
            $scope.suggestedHashtags = ["RIPTwitter", "Purrchrocks", "TeamFollowBack", "SolidSaturdays"];
            $scope.toggleSettings = function () {
                $scope.isOpen = $scope.isOpen ? false : true;
            };
            $scope.switchHash = function (chip) {
                //console.log(chip);
                $scope.selectedHashtag = "#" + chip;
                $scope.go('/api/feed/hashtagtimeline');
            };
            $scope.getHtml = function (html) {
                return $sce.trustAsHtml(html);
            };
            $scope.go = function (url) {
                //console.log(url);
                $scope.auth = Authentication;
                $http.get(url, {
                    params: {
                        hashtag: $scope.selectedHashtag
                    }
                }).then(function (data) {
                    $scope.recentPeeps = data.data.overview;
                    if (data.data.stream != undefined) {
                        $scope.stream = data.data.stream;
                        //var toUTC = moment.utc(data.data.stream[data.data.stream.length - 1].created_at + 'UTC').toDate();
                        //$scope.dataUpTo = moment(toUTC).format("h:mm, MM/DD");
                        //console.log(toUTC);
                        console.log(data);
                    }
                });
            };
            $scope.specials = "inline";

            $scope.sortOptions = ["Recent", "Dopeness", "Virality", "Number of Tweets", "Fire"]
            $scope.go('api/feed/hashtagtimeline');

        }]);
    //.config(function($mdIconProvider) {
    //    $mdIconProvider
    //        .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
    //        .defaultIconSet('img/icons/sets/core-icons.svg', 24);
    //});
