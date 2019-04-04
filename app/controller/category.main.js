const category = require('../database/category.main'),
    upload = require('../services/upload'),
    log = require('../services/log');

async function all(req,res){
    let categories = await category.find().select('name photo').exec();
    res.json({ status : true , data : categories });
}

async function add(req,res){
    try {
        let name = await req.body.name.replace(new RegExp(' ', 'g'), '-');
        req.body.photo = await upload(req.body.photo, name, '/category/main');
        await new category(req.body).save();
        res.json({ status : true , message : 'دسته بندی با موفقیت اضافه شد.' }); 
    } catch (error) {
        log('Add new main category', error);
        res.json({ status : false , message : 'خطای از سوی سرور رخ داده است.' })
    }
}

async function update(req,res){     
    try {
        let _id = req.body.id;
        if(!_id) return res.json({status : false , message : 'برای ویرایش دسته بندی نیاز به id آن دارید.'});
        if(req.body.photo && req.body.photo.includes('http') == false){
            let photo = req.body.photo,
                name = req.body.name;
            if(!name) return res.json({ status : false , message : 'برای آپلود فایل نام دسته بندی لازم است.' });
            else{
                photo = await upload(photo, name, '/category/main');
                req.body.photo = photo;                
                await category.updateOne({_id},req.body).exec();
                res.json({ status : true , message : 'دسته بندی با موفقیت ویرایش شد.' });
            }
        } else {
	    delete req.body.photo;
            await category.updateOne({_id},req.body).exec();
            res.json({ status : true , message : 'دسته بندی با موفقیت ویرایش شد.' });
        }
    } catch (error) {
        log('Update main category', error);
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
        log('Remove main category', error);
        res.json({ status : false , message : 'خطای از سوی سرور رخ داده است.' })
    }
}

module.exports = { all, add, update, remove }
