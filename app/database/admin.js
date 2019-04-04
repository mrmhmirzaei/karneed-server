const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    table = new Schema({
        name : { type : String , default : null },
        phone : {
            number : { type : String , required : true , unique : true },
            token : { type : String , default : null },
            verified : { type : Boolean , default : false },
            expire : { type : Number , default : 0 }
        }
    });

async function save(next){
    this.phone.verified = false;       
    return next();
}

table.pre('save', save);

module.exports = mongoose.model('admin', table);

