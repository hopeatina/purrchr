/**
 * Created by Hope on 2/8/2016.
 */
'use strict';

var Twitter = require('twitter'),
    path = require('path'),
    passport = require('passport'),
    http = require('http'),
    OAuth = require('oauth'),
    config = require(path.resolve('./config/config'));

var R = require("request");


var OAuth2 = OAuth.OAuth2;

var oauth2 = new OAuth2(process.env.TWITTER_PURRCH_KEY,
    process.env.TWITTER_SECRET,
    'https://api.twitter.com/',
    'oauth/authorize',
    'oauth2/token',
    {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'});

exports.reRoute = function (req, res, next) {
    //console.log("reroute", req);
    if (req.user != undefined)
        return next();

    return res.redirect('/');
};

exports.getTweets = function (req, res) {
    //console.log(process.env.TWITTER_PURRCH_KEY,process.env.TWITTER_SECRET,
    //    process.env.TWITTER_ACCESS_TOKEN_KEY, process.env.TWITTER_ACCESS_TOKEN_SECRET);
    //var oauth = new OAuth.OAuth(
    //    'https://api.twitter.com/oauth/request_token',
    //    'https://api.twitter.com/oauth/access_token',
    //    process.env.TWITTER_PURRCH_KEY,
    //    process.env.TWITTER_SECRET,
    //    //twitterkey,
    //    //twittersecret,
    //    '1.0A',
    //    null,
    //    'HMAC-SHA1'
    //);
    //oauth.get(
    //    'https://api.twitter.com/1.1/trends/place.json?id=23424977',
    //    process.env.TWITTER_ACCESS_TOKEN_KEY, //test user token
    //    process.env.TWITTER_ACCESS_TOKEN_SECRET, //test user secret
    //    //accesskey,
    //    //accesstokensecret,
    //    function (e, data, res){
    //        if (e) console.error(e);
    //        console.log(data);
    //    });

    oauth2.getOAuthAccessToken(
        '',
        {'grant_type': 'client_credentials'},
        function (e, access_token, refresh_token, results) {
            //console.log('bearer: ', access_token, refresh_token, results);
            //var bearer = access_token;

            //console.log(e,access_token);

        });

};

exports.getTweetsCallback = function () {

};
function getHomies(url, options, res, client, source) {
    //APP ONLY AUTHENTICATION WORKS!!!!

    if (source) {
        R({
            url: url,
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + process.env.TWITTER_BEARER_TOKEN
            }
        }, function (error, tweet, response) {
            if (error) {
                console.log("ERROR", error, url);
            }
            else {
                //console.log(typeof(tweet.body), tweet.body, url);
                var parsedTweets = checkTweets(JSON.parse(tweet.body).statuses);
                res.json({stream: tweet, overview: parsedTweets});
                //console.log("TWEET: ", parsedTweets.length, tweet.length);  // Tweet body.
                //console.log("RESPONSE: ", response);  // Raw response object.
            }

        });
    }
    else {
        client.get(url,options, function (error, tweet, response) {
            if (error) {
                console.log(error);
            }
            else {
                //console.log("TWEET:", tweet);
                var parsedTweets = checkTweets(tweet);
                res.json({stream: tweet, overview: parsedTweets});
                //console.log("TWEET: ", parsedTweets.length, tweet.length);  // Tweet body.
                //console.log("RESPONSE: ", response);  // Raw response object.
            }
        });
    }

}
function checkTweets(tweets) {
    var Userray = [];
    tweets.forEach(function (tweet, key, tweets) {
        var inArray = false;
        for (var i = 0; i < Userray.length; i++) {
            if (tweet.user.id === Userray[i].user.id || Userray === []) {
                inArray = true;
                Userray[i].tweets.push({name: tweet.text, date: tweet.created_at});
            }
        }
        if (!inArray) {
            Userray.push({user: tweet.user, tweets: [{name: tweet.text, date: tweet.created_at}]});
            //console.log(tweet);
        }

    });
    return Userray;
}

exports.getHomeTweetByCount = function (req, res) {

    var options = {count: "200"};
    //console.log(req.user);
    if (req.user != undefined) {
        if (req.user.providerData !== undefined && req.user.provider == 'twitter') {
            var usermodel = req.user.providerData;
        }
        else if (req.user.additionalProvidersData !== undefined) {
            var usermodel = req.user.additionalProvidersData.twitter;
        } else {
            var usermodel = {token: '', tokenSecret: ''};
        }
        console.log("SERVER CONTROLLER USER", req.user);
        var client = new Twitter({
            consumer_key: process.env.TWITTER_PURRCH_KEY, // should be url encoded. skipping for now
            consumer_secret: process.env.TWITTER_SECRET,
            access_token_key: usermodel.token,
            access_token_secret: usermodel.tokenSecret
        });

    }


    if (client != undefined) {
        /**
         * Stream statuses filtered by keyword
         * number of tweets per second depends on topic popularity
         **/
        //client.stream('user',  function(stream){
        //    stream.on('data', function(tweet) {;
        //        console.log(tweet.text);
        //    });
        //
        //    stream.on('error', function(error) {
        //        console.log(error);
        //    });
        //});
        getHomies('/statuses/home_timeline.json', options, res, client,false);
    } else {

    }
};

exports.getHashtagTweets = function (req, res) {

    //console.log(req);
    if (req.user != undefined) {
        if (req.user.providerData !== undefined && req.user.providerData.provider == 'twitter') {
            var usermodel = req.user.providerData;
        }
        else if (req.user.additionalProvidersData !== undefined) {
            var usermodel = req.user.additionalProvidersData.twitter;
        } else {
            var usermodel = {token: '', tokenSecret: ''};
        }

        var client = new Twitter({
            consumer_key: process.env.TWITTER_PURRCH_KEY, // should be url encoded. skipping for now
            consumer_secret: process.env.TWITTER_SECRET,
            access_token_key: usermodel.token,
            access_token_secret: usermodel.tokenSecret
        });

    }
    var options = {};
    var hashtag= req.query.hashtag || "RIPTwitter";
    hashtag = hashtag.replace('#','');
    if (client != undefined) {
        //https://api.twitter.com/1.1/search/tweets.json?q=%23RIPTwitter
        client = {};
        getHomies('https://api.twitter.com/1.1/search/tweets.json?q=%23'+hashtag+'&result_type=recent&count=100', options, res, client,true);
    } else {

    }
};
exports.countToRequest = function (req, res, next, count) {
    req.count = count;
    next();
};
