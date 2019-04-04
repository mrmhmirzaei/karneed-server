const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    table = new Schema({
        ref : { type : Schema.Types.ObjectId },
        data : { type : Object, default: null }
    });

module.exports = mongoose.model('push', table);