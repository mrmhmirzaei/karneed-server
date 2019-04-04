const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    table = new Schema({
        name : { type : String, default: null },
        photo : { type : String , default: null},
        category : { type : Schema.Types.ObjectId , ref : 'category.main' }
    });

module.exports = mongoose.model('category.sub', table);