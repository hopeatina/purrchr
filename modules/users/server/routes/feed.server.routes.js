/**
 * Created by Hope on 2/8/2016.
 */
'use strict';

var passport = require('passport');
var feed = require('../controllers/users/feed.tweets.server.controller.js');

module.exports = function (app) {

    //Get Tweets
    app.route('/api/auth/twitter/recent').get(feed.getTweets);
    app.route('/api/auth/twiiter/recent/callback').get(feed.getTweetsCallback);

    app.route('/api/feed/hometimeline').get(feed.getHomeTweetByCount);

    app.param('count', feed.countToRequest);
};