const request = require('../database/request'),
    user = require('../database/user'),
    job = require('../database/job'),
    balance = require('../database/balance'),
    push = require('../services/push'),
    send = require('../services/send'),
    log = require('../services/log');

async function add(req,res){
    try{
        req.body.user = req._id;
        if('AdminPaid' in req.body) delete req.body.AdminPaid;
        if('UserPaid' in req.body && 'status' in req.body.UserPaid) delete req.body.UserPaid.status;
        if('options' in req.body == false) return res.json({ status: false , message : "گزینه های برای درخواست نیاز اند." })
        else if(Array.isArray(req.body.options) == false) return res.json({ status : false , message : "نوع داده ارسالی گزینه ها اشتباه است." })
        else if(req.body.options.length == 0) return res.json({ status: false , message : "گزینه ها خالی اند." })
        else if('job' in req.body == false) return res.json({ status: false, message : "برای ثبت درخواست نیاز به id کار دارید." })
        else{
            let result = await calcPrice(req.body.job, req.body.options);
            req.body.price = result['price'];
            req.body.options = result['options'];
            req.body.AdminPaid = result['AdminPaid'];
                        
            if('UserPaid' in req.body && 'type' in req.body.UserPaid && req.body.UserPaid.type == 'balance') {
                req.body.UserPaid = { type: 'balance', status: true };
                let USER = await user.findById(req._id).exec();
                if(USER == null) return res.json({ status : false , message : "کاربر یافت نشد." })
                else{
                    if((parseInt(USER['balance'].toString()) - parseInt(req.body.price.toString())) < 0 ) return res.json({ status : false , message: "اعتبار شما کافی نیست." })
                    else{
                        await user.updateOne({ '_id': req._id }, { balance: (parseInt(USER['balance'].toString()) - parseInt(req.body.price.toString()))}).exec();
                        new request(req.body).save();
                        res.json({ status : true , message : "درخواست شما ثبت شد." })
                    }
                }
            } else if('UserPaid' in req.body && 'type' in req.body.UserPaid && req.body.UserPaid.type == 'online' && 'balance' in req.body.UserPaid) {
                let BALANCE = await balance.findOne({ '_id': req.body.UserPaid.balance, 'user': req._id }).exec()
                if(BALANCE == null) return res.json({ status: false, message : "درگاه پرداخت یافت نشد." })
                else{
                    req.body.UserPaid = { type: 'online', status: BALANCE['paid'], balance: BALANCE['_id'] }
                    new request(req.body).save();
                    res.json({ status : true , message : "درخواست شما ثبت شد." })
                }
            } else if('UserPaid' in req.body && 'type' in req.body.UserPaid && req.body.UserPaid.type == 'offline'){
                req.body.UserPaid = { type: 'offline', status: false };
                req.body.AdminPaid = { status: true, price: 0 };
                new request(req.body).save();
                res.json({ status : true , message : "درخواست شما ثبت شد." })
            } else {
                return res.json({ status : false , message : "روش پرداخت تعریف نشده است." })
            }
        }
    } catch (error) {
        if(error['status'] && error['status'] == false){
            return res.json(error);
        } else {
            console.log(error);
            
            return res.json({ status : false , message : "خطا از سوی سرور رخ داده است." })
        }
    }
}

function calcPrice(jobId='', options=[]){
    return new Promise((resolve,reject)=>{
        job.findById(jobId).exec().then(JOB=>{
            if(JOB == null) reject({ status: false, message:"این کار یافت نشد." })
            else{
                let option = JOB['options'];
                let opts = [];
                let price = parseInt(JOB['price']);
                for(let i in options){
                    let index = options[i];
                    if(option[index] == null) reject({ status : false , message : "شماره اندیس گزینه وجود ندارد." })
                    else{
                        opts.push(option[index]);
                        price = price + parseInt(option[index]['price']);
                    }
                }
                if(price <= parseInt(JOB['price'])) reject({ status: false , message : "گزینه ها خالی اند." });
                else{
                    resolve({ price, options: opts, AdminPaid: { price : price - ((price * parseInt(JOB['percent'] || 0))/100)} })
                }
            }
        }).catch(reject)
    });
}

async function update(req,res){
    if(!req.body.id) res.json({ status : false , message : "برای ویرایش درخواست نیاز به id آن دارید." });
    else{
        await request.updateOne({'_id':req.body.id}, req.body).exec();
        res.json({ status : true , message : "درخواست با موفقیت ویرایش شد." })
    }
}

async function PayAll(req,res){
    if(!req.body.job) res.json({ status : false , message : "برای ویرایش پرداخت نیاز به id شغل دارید." });
    else{
        await request.updateMany({'job': req.body.job}, { 'paid.status' : true });
        res.json({ status : true , message : "پرداخت درآمد شغل تایید شد." })
    }
}

async function remove(req,res){
    if(!req.body.id) res.json({ status : false , message : "برای حذف درخواست نیاز به id آن دارید." });
    else{
        let condination = {'_id':req.body.id, 'paid.status' : false};
        await request.deleteOne(condination).exec();
        res.json({ status : true , message : "درخواست با موفقیت حذف شد." })
    }
}

async function all(req,res){
    try {
        let result = await request.aggregate([{$match : { 'AdminPaid.status':false, 'UserPaid.status':true, "status": "accepted" }},{ $group: {_id: "$job",fullprice: { $sum: "$price" },price: { $sum: "$AdminPaid.price" }}}]);
        let data = [];
        for(let i in result){
            if(result[i]['fullprice'] > 0){
                let res = await job.findById(result[i]['_id']).select("name card").exec();
                result[i]['job'] = {'name':res['name'],'card':res['card']};
                data.push(result[i]);
            }
        }
        res.json({ status : true , data });
    } catch (error) {
        log('Admin All Request', error);
        res.json({ status : false , message : 'خطای از سوی سرور رخ داده است.' })
    }
}

async function getAll(req,res){
    try {
        if(req.permission == 'user'){ 
            let REQUEST = await request.find({ user: req._id }).select("UserPaid status description job location options price requestAt score").populate({path : 'job', select : 'name'}).populate({path:'UserPaid.balance', select: "url"}).exec();
            res.json({ status : true , data : REQUEST })
        }
        else if(req.permission == 'expert'){
            let REQUEST = await request.find({ job: req.query.job}).populate({path : 'user', select : 'name phone.number'}).exec();
            res.json({ status : true , data : REQUEST })
        }
        else {
            res.json({ status: false, message : "عدم دسترسی" })
        }
    } catch (error) {
        res.json({ status : false , message : 'خطای از سوی سرور رخ داده است.' })
    }
}

async function getOne(req,res){
    if(!req,query.id) res.json({ status : false , message : 'برای گرفتن اطلاعات یک درخواست نیاز به id آن دارید.' })
    else{
        let condination = { '_id' : req.query.id }, populate = "";
        if(req.permission == 'user'){ condination['user'] = req._id; populate = {path : 'job', select : 'name'}}
        if(req.permission == 'expert'){ condination['job'] = req.query.job; populate = {path : 'user', select : 'name phone.number'}}
        let REQUEST = await request.findOne(condination).populate(populate).exec();
        res.json({ status : true , data : REQUEST })
    }
}

async function score(req,res){
    if(!req.body.id) return res.json({ status : false , message : 'برای ثبت امتیاز نیاز به id درخواست دارید.' })
    else{
        let REQUEST = await request.findOne({ _id: req.body.id, user:req._id }).exec();
        if(REQUEST == null) return res.json({ status : false , message : 'درخواست مورد نظر یافت نشد.' })
        else if(REQUEST['score']['submitted'] == true) return res.json({ status : false , message : 'شما قبلا نظر خود را ثبت کرده اید.' })
        else{
            await request.updateOne({ _id: req.body.id, user:req._id },{'score.submitted': true, 'score.stars': req.body.stars || 0, 'score.message': req.body.message}).exec();
            res.json({ status : true , message : 'نظر شما با موفقیت ثبت شد.' })
        }
    }
}

// async function accept(req,res){
//     if(!req.body.id) return res.json({ status : false , message : 'برای تایید درخواست نیاز به id درخواست دارید.' })
//     else{
//         let REQUEST = await request.findOne({ _id: req.body.id }).populate("user").exec();
//         if(REQUEST == null) return res.json({ status : false , message : 'درخواست مورد نظر یافت نشد.' })
//         else if(REQUEST['accepted'] == true) return res.json({ status : false , message : 'شما قبلا این درخواست را تایید کرده اید.' })
//         else{
//             if(REQUEST['UserPaid']['type'] == 'balance'){
//                 let balance = parseInt(REQUEST['user']['balance']) - parseInt(REQUEST['price']);
//                 if(balance >= 0){
//                     await user.updateOne({ _id: REQUEST['user']['_id'] }, { balance }).exec();
//                     await request.updateOne({ _id: req.body.id },{'accepted': true, 'UserPaid.status':true}).exec();
//                 }
//             } else {
//                 await request.updateOne({ _id: req.body.id },{'accepted': true}).exec();
//             }
//             let notify = await push.notify(REQUEST['user']['_id'], { title: 'درخواست شما تایید شد.' })
//             if(notify == false) await send.sms(REQUEST['user']['phone']['number'], 'درخواست شما تایید شده است.', true)
//             res.json({ status : true , message : 'درخواست با موفقیت تایید شد.' });
//         }
//     }
// }

async function status(req,res){
    if(!req.body.id) return res.json({ status : false , message : 'برای ویرایش وضعیت درخواست نیاز به id درخواست دارید.' })
    else if(!req.query.set) return res.json({ status: false, message :"برای ویرایش وضعیت نیاز به set آن دارید." })
    else if(req.query.set != 'accepted' && req.query.set != 'rejected') return res.json({ status: false, message : "مقدار داده ی set اشتباه است." })
    else{
        let REQUEST = await request.findOne({ _id: req.body.id }).populate("user").exec();
        if(REQUEST == null) return res.json({ status : false , message : 'درخواست مورد نظر یافت نشد.' })
        else if(REQUEST['status'] == req.query.set) return res.json({ status: false, message : "وضعیت درخواست تغییر نکرد." })
        else {
            await request.updateOne({ _id: req.body.id },{'status': req.query.set}).exec();
            let message = (req.query.set == 'accepted')?'درخواست شما تایید شد.':'درخواست شما لغو شد';
            let notify = await push.notify(REQUEST['user']['_id'], { title: message });
            if(notify == false) await send.sms(REQUEST['user']['phone']['number'], message, true);
            if(req.query.set == 'rejected' && REQUEST['UserPaid']['status'] == true){
                let balance = parseInt(REQUEST['user']['balance']) + parseInt(REQUEST['price']);
                await user.updateOne({ _id: REQUEST['user']['_id'] }, { balance }).exec();
            }
            return res.json({ status: true, message: "وضعیت درخواست با موفقیت تغییر کرد." })
        }
    }
}

async function paid(req,res){
    if(!req.body.id) return res.json({ status : false , message : 'برای تایید درخواست نیاز به id درخواست دارید.' })
    else{
        let REQUEST = await request.findOne({ _id: req.body.id }).populate("user").exec();
        if(REQUEST == null) return res.json({ status : false , message : 'درخواست مورد نظر یافت نشد.' })
        else if(REQUEST['UserPaid']['status'] == true) return res.json({ status : false , message : 'هزینه قبلا پرداخت شده است.' })
        else{
            await request.updateOne({'_id':req.body.id}, { 'UserPaid.status': true }).exec();
            return res.json({ status: true, message: "هزینه پرداخت شده است." })
        }
    }
}

module.exports = { add , update, PayAll , remove , all , getAll , getOne , score, status, paid };
