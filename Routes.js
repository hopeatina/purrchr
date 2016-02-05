/**
 * Created by hnatina on 11/4/15.
 */
'use strict';
var books = require('./bookMethods');
var passport = require('passport');

/**
 * Application routes
 */
module.exports = function(app) {

    // Server API Routes
    //app.param('bookId', books.book);
    app.post('/api/books', books.create);
    app.post('/api/books/upvote:booksId', isLoggedIn,  books.upvote);
    app.post('/api/books/downvote:booksId', isLoggedIn,  books.downvote);
    app.get('/api/books', books.query);
    app.get('/api/books/:booksId', books.show);
    app.put('/api/books/:booksId', books.update);
    app.delete('/api/books/:booksId', books.delete);

    // All other routes to use Angular routing in app/scripts/app.js
    //app.get('/partials/*', index.partials);

    app.get('/', function (req, res) {
        //res.send("WE MADE IT HERE");
        res.sendFile(__dirname + '/app/index.html');
        console.log('problem starts here');
    });

    app.route('/categories')
        .get(function (request, response) {
            response.json([{ name: 'Beverages' }, { name: 'Condiments' }]);
        });

    ///* Handle Login POST */
    //app.post('/login', passport.authenticate('login', {
    //    successRedirect: '/',
    //    failureRedirect: '/categories',
    //    failureFlash : true
    //}));

    ///* GET Registration Page */
    //app.get('/signup', function(req, res){
    //    res.render('register',{message: req.flash('message')});
    //});

    ///* Handle Registration POST */
    //app.post('/signup', passport.authenticate('signup', {
    //    successRedirect: '/',
    //    failureRedirect: '/signup',
    //    failureFlash : true
    //}));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // facebook routes
    // =====================================
    // TWITTER ROUTES ======================
    // =====================================
    // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/',
            failureRedirect : '/auth/twitter'
        }));
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        console.log("YOU ARE ALREADY LOGGED IN BRUH");

        return next();
    }
    console.log("Bruh you're not logged in!");
    // if they aren't redirect them to the home page
    res.redirect('/');

}
