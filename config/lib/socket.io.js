'use strict';

// Load the module dependencies
var config = require('../config'),
    path = require('path'),
    fs = require('fs'),
    http = require('http'),
    https = require('https'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    socketio = require('socket.io'),
    session = require('express-session'),
    Twitter = require('twitter'),
    MongoStore = require('connect-mongo')(session);

var client = new Twitter({
        consumer_key: process.env.TWITTER_PURRCH_KEY, // should be url encoded. skipping for now
        consumer_secret: process.env.TWITTER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    })
    , users = [],
    streams = null;
// Define the Socket.io configuration method
module.exports = function (app, db) {
    var server;
    if (config.secure && config.secure.ssl === true) {
        // Load SSL key and certificate
        var privateKey = fs.readFileSync(path.resolve(config.secure.privateKey), 'utf8');
        var certificate = fs.readFileSync(path.resolve(config.secure.certificate), 'utf8');
        var options = {
            key: privateKey,
            cert: certificate,
            //  requestCert : true,
            //  rejectUnauthorized : true,
            secureProtocol: 'TLSv1_method',
            ciphers: [
                'ECDHE-RSA-AES128-GCM-SHA256',
                'ECDHE-ECDSA-AES128-GCM-SHA256',
                'ECDHE-RSA-AES256-GCM-SHA384',
                'ECDHE-ECDSA-AES256-GCM-SHA384',
                'DHE-RSA-AES128-GCM-SHA256',
                'ECDHE-RSA-AES128-SHA256',
                'DHE-RSA-AES128-SHA256',
                'ECDHE-RSA-AES256-SHA384',
                'DHE-RSA-AES256-SHA384',
                'ECDHE-RSA-AES256-SHA256',
                'DHE-RSA-AES256-SHA256',
                'HIGH',
                '!aNULL',
                '!eNULL',
                '!EXPORT',
                '!DES',
                '!RC4',
                '!MD5',
                '!PSK',
                '!SRP',
                '!CAMELLIA'
            ].join(':'),
            honorCipherOrder: true
        };

        // Create new HTTPS Server
        server = https.createServer(options, app);
    } else {
        // Create a new HTTP server
        server = http.createServer(app);
    }
    // Create a new Socket.io server
    var io = socketio.listen(server);

    // Create a MongoDB storage object
    var mongoStore = new MongoStore({
        mongooseConnection: db.connection,
        collection: config.sessionCollection
    });

    // Intercept Socket.io's handshake request
    io.use(function (socket, next) {
        // Use the 'cookie-parser' module to parse the request cookies
        cookieParser(config.sessionSecret)(socket.request, {}, function (err) {
            // Get the session id from the request cookies
            var sessionId = socket.request.signedCookies ? socket.request.signedCookies[config.sessionKey] : undefined;

            if (!sessionId) return next(new Error('sessionId was not found in socket.request'), false);

            // Use the mongoStorage instance to get the Express session information
            mongoStore.get(sessionId, function (err, session) {
                if (err) return next(err, false);
                if (!session) return next(new Error('session was not found for ' + sessionId), false);

                // Set the Socket.io session information
                socket.request.session = session;

                // Use Passport to populate the user details
                passport.initialize()(socket.request, {}, function () {
                    passport.session()(socket.request, {}, function () {
                        if (socket.request.user) {
                            next(null, true);
                        } else {
                            next(new Error('User is not authenticated'), false);
                        }
                    });
                });
            });
        });
    });

    // Add an event listener to the 'connection' event
    io.on('connection', function (socket) {
        console.log('Connected via sockets');
        if (users.indexOf(socket.id) === -1) {
            users.push(socket.id);
        }
        //socket.emit("new tweet", {
        //    tweet: "THIS IS A NEW TWEET"
        //});

        socket.on("start stream", function () {
            console.log("stream started");
            if (client != undefined) {
                /**
                 * Stream statuses filtered by keyword
                 * number of tweets per second depends on topic popularity
                 **/
                if (streams === null) {
                    client.stream('user', function (stream) {
                        streams = stream;
                        console.log(stream, client);
                        stream.on('data', function (tweet) {
                            // only broadcast when users are online
                            if(users.length > 0) {
                                // This emits the signal to all users but the one
                                // that started the stream
                                //socket.broadcast.emit("new tweet", data);
                                // This emits the signal to the user that started
                                // the stream
                                socket.emit("new tweet", tweet);
                            }
                            else {
                                // If there are no users connected we destroy the stream.
                                // Why would we keep it running for nobody?
                                streams.destroy();
                                streams = null;
                            }
                            console.log(tweet.text);
                        });

                        stream.on('error', function (error) {
                            console.log(error);
                        });
                    });
                }
            }
        });

        // This handles when a user is disconnected
        socket.on("disconnect", function(o) {
            // find the user in the array
            var index = users.indexOf(socket.id);
            if(index != -1) {
                // Eliminates the user from the array
                users.splice(index, 1);
            }
            logConnectedUsers();
        });


        config.files.server.sockets.forEach(function (socketConfiguration) {
            require(path.resolve(socketConfiguration))(io, socket);
            console.log(socketConfiguration);
        });
        socket.emit("connected", {
            tracking: "Tracking nothing"
        });
    });


    return server;
};

// A log function for debugging purposes
function logConnectedUsers() {
    console.log("============= CONNECTED USERS ==============");
    console.log("==  ::  " + users.length);
    console.log("============================================");
}
