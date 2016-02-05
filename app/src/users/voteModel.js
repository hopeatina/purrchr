/**
 * Created by hnatina on 11/16/15.
 */
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

    var voteSchema = mongoose.Schema({
        author: { type: ObjectId, ref: 'Citizen', required: true }
        , value: { type: String, enum: [ "positive", "negative" ], required: true }
        , createdAt: { type: Date, default: Date.now }
    });

module.exports = mongoose.model('Vote', voteSchema);