/**
 * Created by Hope on 2/8/2016.
 */
'use strict';

var passport = require('passport');
var feed = require('../controllers/users/feed.tweets.server.controller.js');

module.exports = function (app) {

    //Get Tweets
    app.route('/api/auth/twitter/recent').get(feed.getTweets);
    app.route('/api/auth/twitter/recent/callback').get(feed.getTweetsCallback);

    app.route('/api/feed/hometimeline').get(feed.reRoute, feed.getHomeTweetByCount);
    app.route('/currentUserTimeline').get(feed.reRoute, feed.getHomeTweetByCount);
    app.route('/currentUserTimeline').post(feed.reRoute, feed.getHomeTweetByCount);
    app.route('/api/feed/hashtagtimeline').get(feed.reRoute, feed.getHashtagTweets);
    app.route('/api/maitre').post(feed.handleMaitre);

    //app.param('count', feed.countToRequest);
};
