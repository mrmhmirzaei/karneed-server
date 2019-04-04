const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    table = new Schema({
        name : {
            first : { type : String, default : null },
            last : { type : String, default : null },
        },
        phone : {
            number : { type : String, default : null, unique : true },
            token : { type : String, default : null },
            expire : { type : Number, default : 0 }
        },
        location : {
            address : { type : String , default : null },
            code : { type : String , default : null }
        },
        balance : { type : Number , default: 0 }
    });

module.exports = mongoose.model('user', table);
