const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    table = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'user' },
        request: { type: Boolean, default: false },
        amount: { type: Number, default: 0 },
        authority: { type: String, default: null },
        url: { type: String, default: null },
        RefID: { type: String, default: null },
        paid: { type: Boolean, default: false }
    });

module.exports = mongoose.model('balance', table);