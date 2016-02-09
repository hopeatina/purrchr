/**
 * Created by Hope on 2/8/2016.
 */
'use strict';

var Twitter = require('twitter'),
  path = require('path'),
  passport = require('passport'),
  http = require('http'),
  OAuth= require('oauth'),
  config = require(path.resolve('./config/config'));

var OAuth2 = OAuth.OAuth2;

var oauth2 = new OAuth2(process.env.TWITTER_PURRCH_KEY,
    process.env.TWITTER_SECRET,
    'https://api.twitter.com/',
    null,
    'oauth2/token',
    null);

var client = new Twitter( {
    consumer_key: process.env.TWITTER_PURRCH_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    //bearer_token: '281729725-Mzbh27YOq3pjatPwNH2NcifZngJd7LdWTgewMbMF'
    //Base64.encode(process.env.TWITTER_CONSUMER_KEY+":"+process.env.TWITTER_CONSUMER_SECRET)
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
} );

exports.getTweets = function(req,res){
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
        {'grant_type':'client_credentials'},
        function (e, access_token, refresh_token, results) {
            //console.log('bearer: ', access_token, refresh_token, results);
            //var bearer = access_token;


            client.get('/statuses/user_timeline.json', {count: "2",user_id: "281729725"}, function(error, tweet, response){
                if(error) console.log(error);
                res.json(tweet);
                //console.log("TWEET: " , tweet);  // Tweet body.
                //console.log("RESPONSE: ", response);  // Raw response object.
            });
        });

};

exports.getTweetsCallback = function() {

};

function getHomies(url, options, res) {
    //console.log(url, options, client, res);

    client.get(url, options, function(error, tweet, response){
        if(error) {console.log(error);}
        else{

            var parsedTweets = checkTweets(tweet);
            res.json({ stream: tweet, overview: parsedTweets});
            console.log("TWEET: " , parsedTweets.length);  // Tweet body.
            //console.log("RESPONSE: ", response);  // Raw response object.
        }
    });

}
function checkTweets(tweets){
    var Userray =[];
    tweets.forEach(function(tweet,key,tweets){
        var inArray = false;
        for (var i =0; i < Userray.length; i ++){
            if (tweet.user.id === Userray[i].user.id || Userray === [] ) {
                inArray = true;
                Userray[i].tweets.push(tweet);
            }
        }
        if(!inArray) {
            Userray.push({user: tweet.user, tweets: [tweet]});
        }
    });
    return Userray;
}
exports.getHomeTweetByCount = function(req,res){
    var options = {count: "500"};
    getHomies('/statuses/home_timeline.json',options,res);

};

exports.countToRequest = function(req, res, next, count) {
    req.count = count;
    next();
};