const push = require('../database/push');

async function subscribe(req,res){
    let id = req._id,
        data = req.body;

    let notify = await push.findOne({ref: id}).exec();
    if(notify == null){
        new push(data).save();
    } else {
        await push.updateOne({ref: id}, data).exec();
    }

    res.json({ status: true, message: 'شما با موفقیت عضو شدید.' });
}

module.exports = { subscribe };