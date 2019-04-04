const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    table = new Schema({
        name : { type : String, default: null },
        photo : { type : String, default: null },
        location : {
            address : { type : String , default : null },
            code : { type : String , default : null },
            phone : { type : String , default : null },
            map : {
                x : { type : String , default : null },
                y : { type : String , default : null }
            }
        },
        options : { type : Array , default : [] },
        multi : { type : Boolean , default : false },
        price : { type : String , default : '0' },
        card : { type : String , default : null },
        percent: { type : Number , default : 0 },
        expert : { type : Schema.Types.ObjectId , ref : 'expert' },
        category : { type : Schema.Types.ObjectId , ref : 'category.sub' },
    });

module.exports = mongoose.model('job', table);