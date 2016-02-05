/**
 * Created by hnatina on 11/4/15.
 */
require('node-path')(module);

var mongoose = require('mongoose'),
    voting = require('mongoose-voting'),
    Schema = mongoose.Schema,
    User = require('./userModel');
    //var Vote = require('./voteModel').schema;

    var ObjectId = mongoose.Schema.Types.ObjectId;

    var bookSchema = mongoose.Schema({
        title: String,
        author: String,
        pages: Number,
        readtime: Number,
        brfdescrip: String,
        link: String,
        image: String,
        phase: Number,
        id: ObjectId,
        suggested: [String],
        readby: String,
        year: Number,
        score: { type: Number, default: 0 }
    }, {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });

    bookSchema.index({ createdAt: -1 });
    bookSchema.index({ score: -1 });

    bookSchema.set('toObject', { getters: true});
    bookSchema.set('toJSON', { getters: true});

    //
    //bookSchema.post('save', function(comment) {
    //var Element = this.context.charAt(0).toUpperCase() + this.context.slice(1);
    //
    //    try {
    //        Element = this.model(Element);
    //    } catch (err) {
    //        console.log(err);
    //        return;
    //    }
    //
    //    Element.findById(this.reference, function(err, element) {
    //        if (!element.participants) return;
    //        element.participants.addToSet(comment.author);
    //        comment.replies.forEach(function(reply) {
    //            element.participants.addToSet(reply.author);
    //        });
    //
    //        if(element.isModified()) {
    //            element.save(function(err) {
    //                if(err) console.log(err);
    //            });
    //        }
    //    });
    //});
    
    

    bookSchema.methods.speak = function () {
        var greeting = this.title
            ? "Meow name is " + this.title
            : "I don't have a name";
        console.log(greeting);
    };

    /**
     * Get `positive` votes
     *
     * @return {Array} voters
     * @api public
     */

    //bookSchema.virtual('vote.upvotes').get(function() {
    //    console.log("virtual positive: " + this.vote);
    //    return this.vote.filter(function(v) {
    //        return "positive" === v.value;
    //    });
    //});

    /**
     * Get `negative` votes
     *
     * @return {Array} voters
     * @api public
     */

    //bookSchema.virtual('vote.downvotes').get(function() {
    //    console.log("virtual negative: " + this.vote);
    //    return this.vote.filter(function(v) {
    //        return "negative" === v.value;
    //    });
    //});


    /**
     * Vote Comment with provided citizen
     * and voting value
     *
     * @param {Citizen|ObjectId|String} citizen
     * @param {String} value
     * @param {Function} cb
     * @api public
     */


    bookSchema.methods.letsvote = function(citizen, type, cb) {

        if (false) {
            this.unvote(citizen);
        }
        else {
            //console.log(this.upvoted(citizen) + " BEFORE: " + this);
            if (type == 'upvote' && !this.upvoted(citizen)) {
            this.upvote(citizen);}
            else if (type == 'downvote' && !this.downvoted(citizen)) {
                this.downvote(citizen);
            } else { console.log('I AIN\'T GOT NOT TYPE or you already downvoted');}
            //console.log("AFTER: " + this);
            //console.log("Score before: " + this.score + ", downvotes: "+ this.downvotes() + ", upvotes: "+  this.upvotes());
            this.score = this.upvotes() - this.downvotes();
            //console.log("After score " + this.score);
        }

        cb(this);
    };

    /**
     * Unvote Comment from provided citizen
     *
     * @param {Citizen|ObjectId|String} citizen
     * @param {Function} cb
     * @api public
     */

    bookSchema.methods.unvoter = function(citizen, cb) {
        var votes = this.vote;
        //console.log("votes:" + votes);
        var c = citizen.get ? citizen.get('_id') : citizen;

        var voted = votes.filter(function(v) {
            var a = v.author.get ? v.author.get('_id') : v.author;
            return a.equals
                ? a.equals(c)
                : a === c;
        });

        //console.log('About to remove votes %j', voted);
        voted.length && voted.forEach(function(v) {
            var removed = votes.id(v.id).remove();
            console.log('Remove vote %j', removed);
        });

        if (cb) this.save(cb);
    };

    bookSchema.plugin(voting,{ ref: 'User' });

    //console.log(bookSchema);

module.exports = mongoose.model('Book', bookSchema);
