const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    table = new Schema({
        user : { type : Schema.Types.ObjectId , ref : 'user' , required : true },
        job : { type : Schema.Types.ObjectId , ref : 'job' , required : true  },
        requestAt : {
            date : {
                year : { type : String , default : null , required : true  },
                month : { type : String , default : null , required : true  },
                day : { type : String , default : null , required : true  }
            },
            time : {
                hour : { type : String , default : null , required : true  },
                minute : { type : String , default : null , required : true  },
            }
        },
        AdminPaid : {
            status : { type : Boolean , default : false },
            price : { type : Number , default : 0 }
        },
        location : {
            address : { type : String , default : null , required : true  },
            code : { type : String , default : null },
        },
        score : {
            submitted : { type : Boolean , default : false },
            stars : { type : Number , default : 0 },
            message : { type : String , default : '' }
        },
        options : { type : Array , default : [] , required : true  },
        price : { type : Number , default : 0, required : true },
        description : { type : String , default : null},
        status: { type: String, default: 'waiting' },
        UserPaid: {
            status : { type : Boolean , default : false },
            type : { type : String , default : null },
            balance : { type : Schema.Types.ObjectId , ref : 'balance' , default : null }
        }
    });

module.exports = mongoose.model('request', table);
