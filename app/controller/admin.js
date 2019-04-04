const admin = require('../database/admin'),
    crypto = require('../services/crypto'),
    log = require('../services/log');

async function editProfile(req,res){
    try {
        let data = req.body;
        if(data['password']) data['password'] = await crypto.hash(data['password']);
        await admin.updateOne({'_id':req._id}, data).exec();
        res.json({ status : true , message : 'اطلاعات با موفقیت ویرایش شدند.' , data });
    } catch (error) {
        log('Update Admin Profile', error);
        res.json({ status : false , message : 'خطای از سوی سرور رخ داده است.' })
    }
}

module.exports = { editProfile };