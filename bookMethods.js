/**
 * Created by hnatina on 11/4/15.
 */
var mongoose = require('mongoose');
var Book = require('./app/src/users/bookModel');
var User = require('./app/src/users/userModel');
/**
 * Create a Book
 */
exports.create = function(req, res) {
    var book = new Book(req.body);

    book.save(function(err) {
        if (err) return res.status(500).json(err);
        res.json(book);
    });
};

/**
 * Find todo by id and store it in the request
 */
exports.book = function(req, next) {
     next();

};

/**
 * List of books
 */
exports.query = function(req, res) {
    Book.find().sort('-createdAt').exec(function(err, book) {
        if (err) return res.status(500).json(err);
        res.json(book);
    });
};

/**
 * Show a book
 */
exports.show = function(req, res) {
    res.json(req.body);
};

/**
 * Update a Book
 */
exports.update = function(req, res) {
    Book.update({ _id: req.body._id }, req.body, { }, function(err, updatedBook) {
        if (err) return res.status(500).json(err);
        res.json(updatedBook);
    });
};

/**
 * Delete a Book
 */
exports.delete = function(req, res) {
    var bookid = req.params.booksId;
    console.log(bookid);
    Book.remove({ _id: bookid}, function(err,book) {
        if (err) {return res.status(500).json(err)}
        else {res.json(book);}

    });
};

/**
 * List of Book
 */
exports.list = function(req, res) {

};

/**
 * Upvote a Book
 */
exports.upvote = function(req, res) {
    var id = req.params.booksId;
    //console.log("booksId: = " + id);

    Book.findOne({ _id: id}, function(err,booker) {
        //console.log(booker.title);
        var book = new Book(booker);
        var user = new User(req.user);
       // console.log('USER: '+ user + "  BOOK: " + book ); // " BOOKER: " + booker
        book.letsvote(user, 'upvote', function(doc) {
               // /if (err) {console.log('Found error %s', err) } //
                console.log('Delivered upvote to book : %s', doc);
            if (doc) {res.json(doc);}
            else {return res.status(500);}
                Book.findOneAndUpdate(
                    { _id: id},
                    doc,
                    function(err, results) {
                        //console.log(results + err);
                    });
                //console.log(result());
            });
    });

};

exports.downvote = function(req, res) {
    var id = req.params.booksId;
    //console.log("booksId: = " + id);

    Book.findOne({ _id: id}, function(err,booker) {
        console.log(booker.title);
        var book = new Book(booker);
        var user = new User(req.user);
        //console.log('USER: '+ user + "  BOOK: " + book ); // " BOOKER: " + booker
        book.letsvote(user, 'downvote', function(doc) {
            // /if (err) {console.log('Found error %s', err) } //
            console.log('Delivered downvote to book : %s', doc);
            if (doc) {res.json(doc);}
            else {return res.status(500);}

            Book.findOneAndUpdate(
                { _id: id},
                doc,
                function(err, results) {
                    console.log(results + err);
                });
        });

    });

};