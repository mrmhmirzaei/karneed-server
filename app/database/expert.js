const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    table = new Schema({
        company: { 
            name: { type : String, default : null },
            is: { type : Boolean, default : false }
        },
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
            code : { type : String , default : null },
            phone : { type : String , default : null }
        }
    });

async function save(next){
    this.phone.verified = false;       
    return next();
}

table.pre('save', save);

module.exports = mongoose.model('expert', table);
