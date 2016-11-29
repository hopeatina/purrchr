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
var twittertxt = require('twitter-text');
//console.log(twittertxt);
// var nlp = require('nlp-toolkit');



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
                var parsedTweets = checkTweets(JSON.parse(tweet.body).statuses, client);

                res.json({
                    stream: tweet,
                    overview: parsedTweets.Userray,
                    linkers: parsedTweets.Linksray,
                    tweets: parsedTweets.Tweets,
                    tweetstorms: parsedTweets.Tweetstorms
                });
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
                console.log("EXAMINING TWEET CONSTRUCT", url);

                if (tweet != undefined) {
                    var parsedTweets = checkTweets(tweet, client);

                    //var parsedTweets = checkTweets(JSON.parse(tweet.body).statuses);
                    var tempresponse = response;
                    var tempmaxid = parsedTweets.maxid;
                    var number = parseInt(tempresponse.headers["x-rate-limit-remaining"]);
                    console.log(number);
                    //for (var x = number; x > 10; x--) {
                    //    console.log("OUTSID GET INSIDE FOR" ,  options);
                    //    getMoreTweets(parsedTweets, tempmaxid, tempresponse, x, function (results, y) {
                    //        parsedTweets.Linksray = parsedTweets.Linksray.concat(results.parsedTweets.Linksray);
                    //        parsedTweets.Userray = parsedTweets.Userray.concat(results.parsedTweets.Userray);
                    //        console.log("HERE ARE THE TEMPPARSEDTWEETS links ", parsedTweets.Linksray.length,results.Linksray.length);
                    //        console.log("HERE ARE THE TEMPPARSEDTWEETS userray ", parsedTweets.Userray.length,results.Userray.length);
                    //        tempmaxid = results.maxid;
                    //        options.max_id = tempmaxid;
                    //        tempresponse = results.response;
                    //        //console.log(results);
                    //        number = parseInt(tempresponse.headers["x-rate-limit-remaining"]);
                    //        console.log("GETS LEFT", y, number, tempmaxid, options, parsedTweets.Linksray.length, parsedTweets.Userray.length);
                    //
                    //        (function (e) {
                    //            if (e == 11) {
                    //                res.json({
                    //                    stream: tweet,
                    //                    overview: parsedTweets,
                    //                    linkers: parsedTweets.Linksray,
                    //                    rawresponse: response
                    //                });
                    //            }
                    //        })(number);
                    //        //.headers["x-rate-limit-remaining"]
                    //    });
                    //
                    //    //res.json({
                    //    //    stream: tweet,
                    //    //    overview: parsedTweets,
                    //    //    linkers: parsedTweets.Linksray,
                    //    //    rawresponse: response
                    //    //});
                    //}
                        res.json({
                            stream: tweet,
                            overview: parsedTweets,
                            linkers: parsedTweets.Linksray,
                            rawresponse: response
                        });
                }
            }
        });
    }
    function setParams(tempTweets, parsedTweets, tempmaxid, tempresponse) {
        parsedTweets.Linksray = parsedTweets.Linksray.concat(tempTweets.Linksray);
        parsedTweets.Userray = parsedTweets.Userray.concat(tempTweets.Userray);
        tempmaxid = tempTweets.maxid;
        console.log("HERE ARE THE TEMPPARSEDTWEETS links ", parsedTweets.Linksray.length,tempTweets.Linksray.length);
        console.log("HERE ARE THE TEMPPARSEDTWEETS userray ", parsedTweets.Userray.length,tempTweets.Userray.length);
        return {parsedTweets: parsedTweets, maxid: tempmaxid, response: tempresponse};
    }

    function getMoreTweets(parsedTweets, maxid, response, x,callback) {
        var tempparsedTweets;
        console.log(options);
        client.get(url, options, function (error, tweet, response) {
            if (error){
                console.log(error);
            }
            else {
            tempparsedTweets = checkTweets(tweet, client);
            callback(setParams(tempparsedTweets, parsedTweets, tempparsedTweets.maxid, response),x);
            console.log("PARAMS BACK", maxid);
            }
        });
    }

}
function linkUp(tweet) {
    if (tweet.text != undefined)
        tweet.text = twittertxt.autoLink(tweet.text, [tweet.entities]);
    //console.log("Linking text" , tweet.text, tweet.entities);
    return tweet.text;
}


function checkTweets(tweets, client) {
    client = client || null;
    var Userray = [];
    var Userhash = {};
    var Linksray = [];
    var Tweetstorms = ["Poop"];
    var Stormray = [];
    var keyword = [];
    var maxid;
    var tweettext = "";
    console.log(tweets.length);
    tweets.forEach(function (tweet, key, tweets) {
        // console.log(key, tweet);
        tweettext = tweettext + " <" + key + "> " + tweet.text;

        if (tweet.entities.urls != undefined) {
            tweet.entities.urls.forEach(function (url, urlkey, urls) {

                if (Linksray.indexOf({url: url.expanded_url, users: [tweet.user]}) > -1) {
                    Linksray[Linksray.indexOf({
                        url: url.expanded_url,
                        users: [tweet.user.name]
                    })].userObj.user.push(tweet.user);
                    //if (Linksray[url.expanded_url].indexOf(tweet.user.name) > -1 || Linksray === [] )
                    //{
                    //    Linksray[url.expanded_url].push(tweet.user.name);
                    //    console.log('ALREADY IN ARRAY ADDED', urlkey, Linksray[url.expanded_url].indexOf(tweet.user.name), Linksray.length);
                    //}
                } else {
                    Linksray.push({url: url.expanded_url, userObj: [{values: {retweets: tweet.retweet_count, faves: tweet.favorite_count }, user: tweet.user}] });
                    // console.log('NEW TWEET IN ARRAY', urlkey, Linksray.length, tweet);
                }
            });
        }
        var inArray = false;
        var inStormray = false;
        if (Userhash[tweet.user.id]) {
            Userhash[tweet.user.id].tweets.push({name: linkUp(tweet), date: tweet.created_at, tweetid: tweet.id_str, tweetuser: tweet.screen_name});
            if (tweet.user.id == tweet.in_reply_to_user_id) {
                var recentsequence = checkSequence(tweet,client);
                Userhash[tweet.user.id].storms.push[recentsequence];
            }
        } else {
            Userhash[tweet.user.id] = {tweets: [{name: linkUp(tweet), date: tweet.created_at, tweetid: tweet.id_str, tweetuser: tweet.screen_name}],
                storms: [], user: tweet.user
            };
        }

        console.log(tweet.user.id, Userhash[tweet.user.id].storms.length);

        function checkSequence(tweet, client) {
            var url = 'statuses/user_timeline';
            var options = {max_id: tweet.id};
            var tweets;
            client.get(url,options, function (error, replies, response) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log(replies.length);
                    var chain = [];
                    var currentweetid = replies.id;
                    chain.push(currentweetid);
                    replies.forEach(function(reply){
                        if (reply.id != currentweetid) {
                            if(reply.in_reply_to_status_id == currentweetid) {
                                currentweetid = reply.in_reply_to_status_id;
                                chain.push(currentweetid);
                            }
                        }

                    });
                    return chain
                }
            });
        }
        // for (var i = 0; i < Userray.length; i++) {
        //     // console.log(tweet.user.id, Userray[i].user.id);
        //     if (tweet.user.id === Userray[i].user.id || Userray === []) {
        //         inArray = true;
        //         //var mentions = twittertxt.extractMentions(tweet.text);
        //         //
        //         //console.log(mentions);
        //         Userray[i].tweets.push({name: linkUp(tweet), date: tweet.created_at, tweetid: tweet.id_str, tweetuser: tweet.screen_name});
        //         break;
        //     }
        // }
        // if (!inArray) {
        //     Userray.push({user: tweet.user, tweets: [{name: linkUp(tweet), date: tweet.created_at}]});
        //     //console.log(tweet);
        // }



        if (tweets.length - 1 == key) {
            maxid = tweet.id;
            //console.log(key, tweet.id);
        }
    });
    // fs.createReadStream('./pride_prejudice.txt')
    //     .pipe(es.split())
    //     .pipe(nlp.tokenizer())
    //     .pipe(nlp.stopwords())
    //     .pipe(nlp.stemmer())
    //     .pipe(nlp.frequency())
    //     .on('data', function (freqDist) {
    //         console.log(freqDist.slice(0, 10));
    //     })
    //     .on('error', function (err) {
    //         console.error(err);
    //     });
    console.log("frequencydist");
    function getFrequency2(string, cutOff) {
        var cleanString = string.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,""),
            words = cleanString.split(' '),
            frequencies = {},
            word, frequency, i;

        for( i=0; i<words.length; i++ ) {
            word = words[i];
            frequencies[word] = frequencies[word] || 0;
            frequencies[word]++;
        }

        words = Object.keys( frequencies );

        console.log();
        var top = words.sort(function (a,b) { return frequencies[b] -frequencies[a];}).slice(0,cutOff);
        var topobj = {};
        top.forEach(function(word){
            topobj[word] = frequencies[word];
        });
        // words.sort(function (a,b) { return frequencies[b] -frequencies[a];}).slice(0,cutOff).toString()

        return topobj;
    }
    console.log(getFrequency2(tweettext, 50));
    return {Userray: Userray, maxid: maxid, Linksray: Linksray, Tweets: tweets, Tweetstorms: Userhash, text: tweettext};
}

exports.getHomeTweetByCount = function (req, res) {

    var options = {count: "200"};
    //console.log("REQUEST OBJECT: ", req);
    if (req.body != undefined) {
        var timeperiod = req.body.time;
    }


    if (req.user != undefined) {
        if (req.user.providerData !== undefined && req.user.provider == 'twitter') {
            var usermodel = req.user.providerData;
        }
        else if (req.user.additionalProvidersData !== undefined) {
            var usermodel = req.user.additionalProvidersData.twitter;
        } else {
            var usermodel = {token: '', tokenSecret: ''};
        }
        //console.log("SERVER CONTROLLER USER", req.user);
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
    hashtag = hashtag.replace('#','%23');
    if (client != undefined) {
        //https://api.twitter.com/1.1/search/tweets.json?q=%23RIPTwitter
        client = {};
        getHomies('https://api.twitter.com/1.1/search/tweets.json?q='+hashtag+'&result_type=recent&count=100', options, res, client,true);
    //%23
    } else {

    }
};
exports.countToRequest = function (req, res, next, count) {
    req.count = count;
    next();
};

exports.handleMaitre = function (req,res, next, count) {
    console.log("Some post was made");

};
