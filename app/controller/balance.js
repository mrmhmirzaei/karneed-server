const balance = require('../database/balance'),
    request = require('../database/request'),
    user = require('../database/user'),
    env = require('../../env'),
    zarinpal = require('../services/zarinpal');

async function add(req, res){
    let Amount = req.body.amount;
    let Request = req.body.request || false;
    if(Amount == null) return res.json({ status : false , message: "هزینه افزایش ثبت نشده است." });
    if(typeof Amount != 'number') return res.json({ status: false , message : "نوع داده برای amount اشتباه است." })
    else if(typeof Request != 'boolean') return res.json({ status : false , message : "نوع داده برای request اشتباه است." })
    else{
        try {
            let Description = (Request == true)?`پرداخت درخواست به هزینه ${Amount} تومان`:`افزایش اعتبار کیف پول`;
            let response = await zarinpal.PaymentRequest({
                Amount,
                Description,
                CallbackURL: env.host+'/balance/checkout'
            });
            if(response.status == 100){
                let BALANCE = await new balance({ user: req._id, amount: parseInt(Amount), request:Request, authority: response.authority, url: response.url }).save();
                if(req.body.redirect && req.body.redirect == true) return res.redirect(response.url);
                else{
                    return res.json({ status: true, redirect: response.url, id: BALANCE['_id'] });
                }
            } else {
                return res.json({ status : false , message : "خطا از سوی درگاه پرداخت رخ داده است." })
            }
        } catch (error) {    
            console.log(error);
                          
            return res.json({ status : false , message : 'خطایی از سوی سرور رخ داده است.' });
        }
    }
}

async function checkout(req, res){
    let authority = req.query.Authority;
        
    let BALANCE = await balance.findOne({ authority }).populate("user").exec();

    if(BALANCE == null) return res.render('error', {message : "این داده ثبت نشده است." })
    else if(BALANCE['paid'] == true) return res.render('error', {message : "این مبلغ قبلا واریز شده است." })
    else{
        try {
            let response = await zarinpal.PaymentVerification({
                Amount: parseInt(BALANCE['amount']),
                Authority: authority
            });
            if(response.status == 100){
                await balance.updateOne({'_id': BALANCE['_id']}, { paid: true, RefID: response['RefID'] }).exec();
                if(BALANCE['request'] == true){
                    let REQUEST = await request.findOne({ 'user': BALANCE['user']['_id'], 'UserPaid.status': false, 'UserPaid.type': 'online', 'UserPaid.balance': BALANCE['_id'] }).exec();
                    if(REQUEST == null){
                        await user.updateOne({ '_id': BALANCE['user']['_id'] }, { 'balance': parseInt(BALANCE['user']['balance']) + parseInt(BALANCE['amount']) });
                        return res.json({ status : false , message : "درخواستی ثبت نشده است." });
                    } else {
                        await request.updateOne({ '_id': REQUEST['_id'], 'user': BALANCE['user']['_id'] }, { 'UserPaid.status': true }).exec();
                        res.render('request');
                    }
                } else {
                    await user.updateOne({ '_id': BALANCE['user']['_id'] }, { 'balance': parseInt(BALANCE['user']['balance']) + parseInt(BALANCE['amount']) });
                    res.render('balance', { balance: parseInt(BALANCE['user']['balance']) + parseInt(BALANCE['amount']) })
                }
            } else if(response.status == 101){
                return res.render('error', {message : "این مبلغ قبلا واریز شده است." })
            } else {                
                return res.render('error',{ message : "خطا از سوی درگاه پرداخت رخ داده است." })
            }
        } catch (error) {
            console.log(error, authority);
            
            return res.render('error',{ message : "خطایی از سوی درگاه پرداخت رخ داده است." })
        }
    }
}

async function getAll(req,res){
    let BALANCE = await balance.find({ 'user': req._id }).select("paid amount url request").exec();
    return res.json({ status : true, data:BALANCE })
}

async function getOne(req,res){
    let id = req.body.id;
    if(id == null) return res.json({ status : false , message : "نیاز به id برای اضافه کردن دارید." })
    else{
        let BALANCE = await balance.findOne({ '_id': id, 'user': req._id }).exec();
        if(BALANCE == null) return res.json({ status : false , message : "داده یافت نشد." })
        else{
            return res.json({ status : true , redirect: BALANCE['url'] , id : BALANCE['_id'] });
        }
    }
}

async function me(req,res){
    let USER = await user.findById(req._id).exec();
    if(USER == null) return res.json({ status : false , message : "کاربر یافت نشد." })
    else{
        return res.json({ status : true , balance: USER['balance'] })
    }
}

module.exports = { add, checkout, getAll, getOne, me };