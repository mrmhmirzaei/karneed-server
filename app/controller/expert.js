const expert = require('../database/expert'),
    log = require('../services/log');

async function all(req,res){
    let EXPERT = await expert.find().select('company name phone.number').exec();
    res.json({ status : true , data : EXPERT });
}

async function add(req,res){
    try {
        await new expert(req.body).save();
        res.json({ status : true , message : 'متخصص جدید با موفقیت اضافه شد.' })
    } catch (error) {
        log('Add new expert', error);
        res.json({ status : false , message : 'شماره تلفن این متخصص قبلا ثبت شده است.' })
    }        
}

async function update(req,res){
    try {
        let id = req.body.id || req._id;
        if(!id) return res.json({ status : false , message : 'برای ویرایش متخصص نیاز به id آن دارید.' })
        if(req.permission ==  "expert" && req.body.phone) delete req.body.phone;
        await expert.updateOne({'_id':id}, req.body).exec();
        res.json({ status : true , message : 'اطلاعات با موفقیت ویرایش شدند.' })  
    } catch (error) {
        log('Update expert', error);
        res.json({ status : false , message : 'خطای از سوی سرور رخ داده است.' })       
    }
}

async function remove(req,res){
    try {
        if(!req.body.id) return res.json({ status : false , message : 'برای حذف متخصص نیاز به id آن دارید.' })
        await expert.deleteOne({ '_id':req.body.id }).exec();
        res.json({ status : true , message : 'متخصص با موفقیت حذف شد.' })
    } catch (error) {
        log('Remove expert', error);
        res.json({ status : false , message : 'خطای از سوی سرور رخ داده است.' })
    }
}

async function getOneByPhone(req,res){
    if(!req.query.phone) return res.json({ status : false , message : "فیلتر phone وارد نشده است." })
    else{
        let EXPERT = await expert.findOne({ "phone.number" : req.query.phone }).select("name company").exec();
        res.json({ status : true , data : EXPERT });
    }
}

module.exports = { all, getOneByPhone, add, update, remove }
