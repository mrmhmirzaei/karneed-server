const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    table = new Schema({
        name : { type : String, default: null },
        photo : { type : String, default: null },
    });

module.exports = mongoose.model('category.main', table);