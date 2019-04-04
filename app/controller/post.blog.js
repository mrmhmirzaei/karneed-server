const post = require('../database/post.blog'),
    upload = require('../services/upload'),
    log = require('../services/log');

async function add(req,res){
    try {
        if(req.body.photo){
            let name = await req.body.title.replace(new RegExp(' ', 'g'), '-');
            req.body.photo = await upload(req.body.photo, name, '/post');
        }
        await new post(req.body).save();
        res.json({ status : true , message : 'نوشته با موفقیت اضافه شد.' });
    } catch (error) {
        log('Add new post', error);
        res.json({ status : false , message : 'خطای از سوی سرور رخ داده است.' })
    }
}

async function update(req,res){
    try {
        let _id = req.body.id;
        if(!_id) return res.json({ status : false , message : "برای ویرایش نوشته نیاز به id آن دارید." })
        else{
            if(req.body.photo){
                let name = await req.body.title.replace(new RegExp(' ', 'g'), '-');
                req.body.photo = await upload(req.body.photo, name, '/post');
            }
            await post.updateOne({_id}, req.body).exec();
            res.json({ status : true , message : "نوشته شما با موفقیت ویرایش شد." })
        }
    } catch (error) {
        log('Update post', error);
        res.json({ status : false , message : 'خطای از سوی سرور رخ داده است.' })
    }
}

async function remove(req,res){
    try {
        let _id = req.body.id;
        if(!_id) return res.json({ status : false , message : "برای حذف نوشته نیاز به id آن دارید." })
        else{
            await post.deleteOne({_id}).exec();
            res.json({ status : true , message : "نوشته با موفقیت حذف شد." });
        }
    } catch (error) {
        log('Remove post', error);
        res.json({ status : false , message : 'خطای از سوی سرور رخ داده است.' })
    }
}

async function all(req,res){
    let result = await post.find().exec();
    res.json({ status : true , data : result });
}

async function get(req,res){
    let page = parseInt(req.query.page)|| 0,
        limit = parseInt(req.query.limit) || 10,
        skip = page * limit;

    let result = await post.find().limit(limit).skip(skip).sort('-date').exec();
    res.json({ status : true , data : result });
}

async function one(req,res){
    let title = req.params.title;
    title = await title.replace(new RegExp('-', 'g'), ' ');
    let result = await post.findOne({ title }).exec();
    res.json({ status : true , data : result });
}

module.exports = { add , update , remove , all , get , one };