const category = require('../database/category.sub'),
    main = require('../database/category.main'),
    upload = require('../services/upload'),
    log = require('../services/log');

async function all(req,res){
    let categories = await category.find().select('name category photo').sort('category').populate({ path: 'category', select: 'name' }).exec();
    res.json({ status : true , data : categories });
}

async function allBy(req,res){
    let MAIN = await main.findOne({ 'name' : req.params.main });
    if(MAIN == null) return res.json({ status : false , message : 'دسته بندی اصلی یافت نشد.' });
    else{
        let categories = await category.find({ 'category' :  MAIN['_id']}).select('name photo').exec();
        res.json({ status : true , data : categories });
    }
}

async function add(req,res){
    try {
        if(req.body.photo){
            let name = await req.body.name.replace(new RegExp(' ', 'g'), '-');
            req.body.photo = await upload(req.body.photo, name, '/category/sub');
        }
        await new category(req.body).save();
        res.json({ status : true , message : 'دسته بندی با موفقیت اضافه شد.' });
    } catch (error) {
        log('Add new sub category', error);
        res.json({ status : false , message : 'خطای از سوی سرور رخ داده است.' })
    }
}

async function update(req,res){
    try {
        let _id = req.body.id;
        if(!_id) return res.json({status : false , message : 'برای ویرایش دسته بندی نیاز به id آن دارید.'});
        if(req.body.photo){
            let photo = req.body.photo,
                name = req.body.name;
            if(!name) return res.json({ status : false , message : 'برای آپلود فایل نام دسته بندی لازم است.' });
            else{
                photo = await upload(photo, name, '/category/sub');
                req.body.photo = photo;
                await category.updateOne({_id},req.body).exec();
                res.json({ status : true , message : 'دسته بندی با موفقیت ویرایش شد.' });
            }
        } else {
            await category.updateOne({_id},req.body).exec();
            res.json({ status : true , message : 'دسته بندی با موفقیت ویرایش شد.' });
        }
    } catch (error) {
        log('Update sub category', error);
        res.json({ status : false , message : 'خطای از سوی سرور رخ داده است.' })
    }
}

async function remove(req,res){
    try {
        let id = req.body.id;
        if(!id) return res.json({status : false , message : 'برای حذف دسته بندی نیاز به id آن دارید.'});
        else{
            await category.deleteOne({_id:id}).exec();
            res.json({ status : true , message : 'دسته بندی با موفقیت حذف شد.' });
        }
    } catch (error) {
        log('Remove sub category', error);
        res.json({ status : false , message : 'خطای از سوی سرور رخ داده است.' })
    }
}

module.exports = { all, allBy, add, update, remove }
