const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    table = new Schema({
        title : { type : String , required : true },
        photo : { type : String , default : null},
        content : { type : String , required : true },
        summary : { type : String , default : '' },
        tags : { type : String , default : '' },
        published : { type : Boolean , default : false },
        publishedAt : {
            year: { type : String , default : '' },
            month: { type : String , default : '' },
            day: { type : String , default : '' }
        }
    });

module.exports = mongoose.model('post', table);