const user = require('../database/user'),
    log = require('../services/log');

async function update(req,res){
    try {
        await user.updateOne({ '_id':req._id }, req.body).exec();
        res.json({ status : true , message : 'اطلاعات شما با موفقیت ویرایش شد.' })
    } catch (error) {
        log('Update user profile', error);
        res.json({ status : false , message : 'خطای از سوی سرور رخ داده است.' })
    }
}

module.exports = { update }