'use strict'

angular.module('users')
    .run(['$anchorScroll', function ($anchorScroll) {
        $anchorScroll.yOffset = 500;   // always scroll by 50 extra pixels
    }])
    .controller('MainFeedController', ['$scope', '$http', 'moment', '$state', 'Authentication',
        'Menus', 'MainFeed', '$interval', 'Socket', '$sce', '$location', '$anchorScroll',
        function ($scope, $http, moment, $state, Authentication, Menus, MainFeed, $interval, Socket, $sce, $location, $anchorScroll) {
            $scope.pos = {
                x: 0,
                y: 0
            };

            $scope.size=true;
            $scope.mdcols = 3;
            $scope.topics = ["TOPIC1","TOPIC2"];

            $scope.usersHidden = true;
            $scope.showHideUsers = function () {
                $scope.usersHidden = !$scope.usersHidden;
            };
            $scope.expanded = false;
            $scope.expand = function (tile,key) {
                // $scope.colorTiles[key];
                if (!$scope.expanded) {
                    $scope.tempcol = $scope.colorTiles[key].colspan;
                    $scope.temprow = $scope.colorTiles[key].rowspan;
                }
                $scope.colorTiles[key].colspan = $scope.colorTiles[key].colspan == $scope.tempcol ? 4 : $scope.tempcol;
                $scope.colorTiles[key].rowspan = $scope.colorTiles[key].rowspan == $scope.temprow ? 4 : $scope.temprow;
                // $scope.$apply();
                $scope.expanded = !$scope.expanded ;
                console.log($scope.colorTiles[key]);

            };

            $scope.counter = 0;
            $scope.getHtml = function (html) {
                return $sce.trustAsHtml(html);
            };

            $scope.gotoAnchor = function (person) {
                // set the location.hash to the id of
                // the element you wish to scroll to.
                $location.hash(person);

                // call $anchorScroll()
                $anchorScroll();
            };
            $scope.count = function () {
                $scope.counter += 1;
            };
            $scope.$state = $state;
            $scope.authentication = Authentication;
            $scope.selectedIndex = 0;
            $scope.sortOptions = [
                {name: "Activity", value: "-tweets.length"},
                {name: "Inactivity", value: "tweets.length"},
                {name: "Recent", value: ""}
                //{name: "Dopeness", value: ""},
                //{name: "Virality", value: ""},
                //{name: "Tweet Count", value: ""},
                //{name: "Fire", value: ""}
            ];
            $scope.updateSortOptions = function () {
                console.log($scope.selectedIndex);
                console.sortOptionSelected;
                $scope.temprecent = ($scope.temprecent !== $scope.recentPeeps) ? $scope.recentPeeps : $scope.temprecent;

                switch ($scope.selectedIndex) {
                    case 0:
                        $scope.sortOptions = [
                            {name: "Activity", value: "-tweets.length"},
                            {name: "Inactivity", value: "tweets.length"},
                            {name: "Recent", value: ""}
                            //{name: "Dopeness", value: ""},
                            //{name: "Virality", value: ""},
                            //{name: "Tweet Count", value: ""},
                            //{name: "Fire", value: ""}
                        ];
                        break;
                    case 1:
                        $scope.sortOptions = [
                            {name: "Retweets +", value: "-userObj[0].values.retweets"},
                            {name: "Retweets -", value: "userObj[0].values.retweets"},
                            {name: "Favorites +", value: "-userObj[0].values.faves"},
                            {name: "Favorites -", value: "userObj[0].values.faves"},
                            {name: "Recent", value: ""},
                            {name: "Old", value: "-"}
                        ];
                        var linkusers = [];
                        //$scope.currentLinks.slice().forEach(user, function(user){
                        //    linkusers.push[user.userObj[0].user];
                        //});
                        //
                        //$scope.recentPeeps =  linkusers;
                        break;
                    case 2:
                        $scope.sortOptions = [
                            {name: "Activity", value: "-tweets.length"},
                            {name: "Inactivity", value: "tweets.length"},
                            {name: "Recent", value: ""}
                            //{name: "Dopeness", value: ""},
                            //{name: "Virality", value: ""},
                            //{name: "Tweet Count", value: ""},
                            //{name: "Fire", value: ""}
                        ];
                        break;
                    default:
                        $scope.sortOptions = [
                            {name: "Activity", value: "-tweets.length"},
                            {name: "Inactivity", value: "tweets.length"},
                            {name: "Recent", value: ""}
                            //{name: "Dopeness", value: ""},
                            //{name: "Virality", value: ""},
                            //{name: "Tweet Count", value: ""},
                            //{name: "Fire", value: ""}
                        ];
                }
            };

            $scope.timeSort = [
                {name: "Past 1 hr", value: "60"},
                {name: "Past 3 hrs", value: "240"},
                {name: "Past day", value: "1440"},
                {name: "Past week", value: "week"}
            ];

            $scope.updateTimePeriod = function (timeValue) {
                MainFeed.getTimeHomies(timeValue).then(function (data) {
                    parseReturnedTweets(data);
                });
            };
            var originatorEv;
            $scope.openMenu = function ($mdOpenMenu, ev) {
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
                var tweettext = "";
                tweets.forEach(function (tweet, key, tweets) {
                    var inArray = false;
                    tweettext = tweettext + " <> " + tweet.text;
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
                });
                return tweettext;
            }
            $scope.updateTile = function(tile) {

                tile.colspan = tile.colspan == 2 ? 4 : 2;
                tile.rowspan = tile.rowspan == 2 ? 4 : 2;
                console.log("we in tis");
                $scope.mdcols = $scope.mdcols == 3 ? 4: 3;
                // $scope.$apply();
            };
            function parseReturnedTweets(data) {
                if (data.data.stream != undefined) {
                    var obj = data.data.overview.Tweetstorms;
                    var arr = Object.keys(obj).map(function (key) {
                        return obj[key];
                    });
                    $scope.recentPeeps = arr;
                    $scope.justTweets = data.data.stream;
                    if ($scope.recentPeeps != undefined) {
                        $scope.currentTweets = $scope.recentPeeps;
                        //$scope.currentTweets = $scope.recentPeeps.slice(0, 30);
                    }
                    $scope.randomint = function getRandomInt(min, max) {
                        min = Math.ceil(min);
                        max = Math.floor(max);
                        return Math.floor(Math.random() * (max - min)) + min;
                    };
                    $scope.colorTiles = (function () {
                        var tiles = [];
                        console.log($scope.currentTweets);
                        if ($scope.recentPeeps != undefined) {
                            for (var i = 0; i < $scope.recentPeeps.length; i++) {
                                tiles.push({
                                    color: randomColor(),
                                    colspan: randomSpan(),
                                    rowspan: randomSpan(),
                                    size: false,
                                    user: $scope.recentPeeps[i].user,
                                    numtweets: $scope.recentPeeps[i].tweets.length,
                                    retweets: $scope.randomint(0,200),
                                    likes: $scope.randomint(0,200)
                                });
                            }
                        }
                        return tiles;
                    })();
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
                    if (data.data.overview.Tweetstorms != undefined) {
                        // data.data.overview.Tweetstorms.forEach(function(user){
                        //     if(user.storms.length > 0 ) {
                        //         $scope.tweetstorms.push(user)
                        //     }
                        // });
                        // $scope.tweetstorms = data.data.overview.Tweetstorms;
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
                    console.log("Socket.io didn't start!");
                }
            }

            $scope.goPerUser();
            var COLORS = ['#ffebee', '#ffcdd2', '#ef9a9a', '#e57373', '#ef5350', '#f44336', '#e53935', '#d32f2f', '#c62828', '#b71c1c', '#ff8a80', '#ff5252', '#ff1744', '#d50000', '#f8bbd0', '#f48fb1', '#f06292', '#ec407a', '#e91e63', '#d81b60', '#c2185b', '#ad1457', '#880e4f', '#ff80ab', '#ff4081', '#f50057', '#c51162', '#e1bee7', '#ce93d8', '#ba68c8', '#ab47bc', '#9c27b0', '#8e24aa', '#7b1fa2', '#4a148c', '#ea80fc', '#e040fb', '#d500f9', '#aa00ff', '#ede7f6', '#d1c4e9', '#b39ddb', '#9575cd', '#7e57c2', '#673ab7', '#5e35b1', '#4527a0', '#311b92', '#b388ff', '#7c4dff', '#651fff', '#6200ea', '#c5cae9', '#9fa8da', '#7986cb', '#5c6bc0', '#3f51b5', '#3949ab', '#303f9f', '#283593', '#1a237e', '#8c9eff', '#536dfe', '#3d5afe', '#304ffe', '#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1', '#82b1ff', '#448aff', '#2979ff', '#2962ff', '#b3e5fc', '#81d4fa', '#4fc3f7', '#29b6f6', '#03a9f4', '#039be5', '#0288d1', '#0277bd', '#01579b', '#80d8ff', '#40c4ff', '#00b0ff', '#0091ea', '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064', '#84ffff', '#18ffff', '#00e5ff', '#00b8d4', '#e0f2f1', '#b2dfdb', '#80cbc4', '#4db6ac', '#26a69a', '#009688', '#00897b', '#00796b', '#00695c', '#a7ffeb', '#64ffda', '#1de9b6', '#00bfa5', '#e8f5e9', '#c8e6c9', '#a5d6a7', '#81c784', '#66bb6a', '#4caf50', '#43a047', '#388e3c', '#2e7d32', '#1b5e20', '#b9f6ca', '#69f0ae', '#00e676', '#00c853', '#f1f8e9', '#dcedc8', '#c5e1a5', '#aed581', '#9ccc65', '#8bc34a', '#7cb342', '#689f38', '#558b2f', '#33691e', '#ccff90', '#b2ff59', '#76ff03', '#64dd17', '#f9fbe7', '#f0f4c3', '#e6ee9c', '#dce775', '#d4e157', '#cddc39', '#c0ca33', '#afb42b', '#9e9d24', '#827717', '#f4ff81', '#eeff41', '#c6ff00', '#aeea00', '#fffde7', '#fff9c4', '#fff59d', '#fff176', '#ffee58', '#ffeb3b', '#fdd835', '#fbc02d', '#f9a825', '#f57f17', '#ffff8d', '#ffff00', '#ffea00', '#ffd600', '#fff8e1', '#ffecb3', '#ffe082', '#ffd54f', '#ffca28', '#ffc107', '#ffb300', '#ffa000', '#ff8f00', '#ff6f00', '#ffe57f', '#ffd740', '#ffc400', '#ffab00', '#fff3e0', '#ffe0b2', '#ffcc80', '#ffb74d', '#ffa726', '#ff9800', '#fb8c00', '#f57c00', '#ef6c00', '#e65100', '#ffd180', '#ffab40', '#ff9100', '#ff6d00', '#fbe9e7', '#ffccbc', '#ffab91', '#ff8a65', '#ff7043', '#ff5722', '#f4511e', '#e64a19', '#d84315', '#bf360c', '#ff9e80', '#ff6e40', '#ff3d00', '#dd2c00', '#d7ccc8', '#bcaaa4', '#795548', '#d7ccc8', '#bcaaa4', '#8d6e63', '#eceff1', '#cfd8dc', '#b0bec5', '#90a4ae', '#78909c', '#607d8b', '#546e7a', '#cfd8dc', '#b0bec5', '#78909c'];

            function randomColor() {
                return COLORS[Math.floor(Math.random() * COLORS.length)];
            }

            function randomSpan() {
                var r = Math.random();
                if (r < 0.5) {
                    return 2;
                } else  {
                    return 2;
                }
            }
        }
    ])
    .controller('SingleTweetCtrl', ['$scope', '$http', 'moment', '$location', '$window',
        function ($scope, $http, moment, $location, $window) {
            $scope.timelineConfig = {
                horizontalLayout: true,
                color: "55acee",
                height: 100,
                width: 600,
                showLabels: true,
                labelFormat: "%I:%M",
                specials: "inline"
            };
            $scope.followed = "UNFOLLOW";
            $scope.follow = function () {
                $scope.followed = $scope.followed == "FOLLOW" ? "UNFOLLOW" : "FOLLOW";
            };
            $scope.tweetsCollapsed = false;
            $scope.expandarrow = $scope.tweetsCollapsed ? "expand_less" : "expand_more";
            $scope.toggleTweets = function () {
                $scope.tweetsCollapsed = $scope.tweetsCollapsed ? false : true;
                $scope.expandarrow = $scope.tweetsCollapsed ? "expand_less" : "expand_more";
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
            $scope.selectedHashtag = "#NoDaysOff";
            $scope.suggestedHashtags = ["RIPTwitter", "SXSW", "OpTrump", "MetGala", "Superman"];
            $scope.toggleSettings = function () {
                $scope.isOpen = $scope.isOpen ? false : true;
            };
            $scope.followed = "FOLLOW";
            $scope.switchHash = function (chip) {
                //console.log(chip);
                $scope.selectedHashtag = chip;
                $scope.go('/api/feed/hashtagtimeline');
                $scope.toggleSettings();
            };
            $scope.usersHidden = true;
            $scope.showHideUsers = function () {
                $scope.usersHidden = !$scope.usersHidden;
                if ($scope.selectedIndex == 1) {
                    $scope.usersHidden = true;
                }

                console.log($scope.usersHidden);
            };
            $scope.lists = [
                {
                    span: {col: 1, row: 1},
                    background: {"background-color": "coral"},
                    title: "#RIPTwitter",
                    keywords: "#RIPTwitter"
                },
                {span: {col: 1, row: 1}, background: {"background-color": "coral"}, title: "#SXSW", keywords: "#SXSW"},
                {
                    span: {col: 1, row: 1},
                    background: {"background-color": "coral"},
                    title: "#OpTrump",
                    keywords: "#OpTrump"
                },
                {
                    span: {col: 1, row: 1},
                    background: {"background-color": "coral"},
                    title: "#RIPTwitter",
                    keywords: "#RIPTwitter"
                }
            ];
            $scope.updateTimePeriod = function (timeValue) {
                MainFeed.getTimeHomies(timeValue).then(function (data) {
                    parseReturnedTweets(data);
                });
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
            $scope.timeSort = [
                {name: "Past 1 hr", value: "60"},
                {name: "Past 3 hrs", value: "240"},
                {name: "Past day", value: "1440"},
                {name: "Past week", value: "week"}
            ];
            $scope.specials = "inline";

            $scope.sortOptions = [
                {name: "Activity", value: "-tweets.length"},
                {name: "Inactivity", value: "tweets.length"},
                {name: "Recent", value: ""},
                {name: "Virality", value: "viral"},
                {name: "Fire", value: "Fire"}
            ];
            $scope.go('api/feed/hashtagtimeline');

        }]);
//.config(function($mdIconProvider) {
//    $mdIconProvider
//        .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
//        .defaultIconSet('img/icons/sets/core-icons.svg', 24);
//});
