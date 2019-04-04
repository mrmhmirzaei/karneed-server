const job = require('../database/job'),
    sub = require('../database/category.sub'),
    upload = require('../services/upload'),
    log = require('../services/log');

async function add(req,res){
    try {
        if(req.body.photo != null){
            let name = await req.body.name.replace(new RegExp(' ', 'g'), '-');
            req.body.photo = await upload(req.body.photo, name, '/job');
        }
        await new job(req.body).save();
        res.json({ status : true , message : 'کار جدید با موفقیت ثبت شد.' })
    } catch (error) {
        log('Add new job', error);
        res.json({ status : false , message : 'خطای از سوی سرور رخ داده است.' })
    }
}

async function update(req,res){
    try {
        if(!req.body.id) res.json({ status : false , message : 'برای ویرایش کار نیاز به id آن دارید.' })
        else{
            if(req.body.photo != null && req.body.photo.includes('https') == false){
                let name = await req.body.name.replace(new RegExp(' ', 'g'), '-');
                req.body.photo = await upload(req.body.photo, name, '/job');
            }
            await job.updateOne({'_id':req.body.id}, req.body).exec();
            res.json({ status : true , message : 'این کار با موفقیت ویرایش شد.' })
        }
    } catch (error) {
        log('Update job', error);
        res.json({ status : false , message : 'خطای از سوی سرور رخ داده است.' })
    }
}

async function remove(req,res){
    try {
        if(!req.body.id) res.json({ status : false , message : 'برای حذف کار نیاز به id آن دارید.' })
        else{
            await job.deleteOne({'_id':req.body.id}).exec();
            res.json({ status : true , message : 'این کار با موفقیت حذف شد.' })
        }
    } catch (error) {
        log('Remove job', error);
        res.json({ status : false , message : 'خطای از سوی سرور رخ داده است.' })
    }
}

async function all(req,res){
    let JOB = await job.find().sort('-date').populate({ path : "category" , select : "name" }).populate({ path : "expert", select: "name company phone.number" }).exec();
    res.json({ status : true , data : JOB });
}

async function allExpert(req,res){
  let JOB = await job.find({'expert': req._id}).populate({ path : "category" , select : "name" }).populate({ path: "expert", select : "company" }).exec();
  res.json({ status : true , data : JOB });
}

async function allBy(req,res){
    // Convert Category name to category ID
    let SUB = await sub.findOne({'name' : req.params.category}).exec();
    if(SUB == null) return res.json({ status : false , message : "زیر دسته بندی یافت نشد." })
    else{
        let JOB = await job.find({ category : SUB['_id'] }).select("name photo options multi price expert").populate({ path: "expert", select : "company" }).exec();
        res.json({ status : true , data : JOB })
    }
}

async function getOne(req,res){
    if(!req.query.id) res.json({ status : false , message : "برای گرفتن اطلاعات یک کار نیاز به id آن دارید." })
    else{
      try {
        let JOB = await job.findById(req.query.id).select("name photo options multi price category").populate({ path: "expert", select : "company" }).populate({ path : "category" , select : "name" }).exec();
        res.json({ status : true , data : JOB })
      } catch (e) {
          res.json({ status : false , message : "کار مورد نظر یافت نشد." })
      }
    }
}


module.exports = { add , update , remove , all , allExpert , allBy , getOne };
