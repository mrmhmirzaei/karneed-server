const user = require('../../database/user'),
    TOKEN = require('../../services/token'),
    SEND = require('../../services/send'),
    AUTH = require('../../services/auth');

async function send(req,res){
    let phone = req.body.phone;
    if(!phone) return res.json({ status : false , message : 'شماره تلفن ارسال نشده است.' })
    else if(phone.length != 11) return res.json({ status : false , message : 'شماره تلفن اشتباه است.' })
    else{
        let USER = await user.findOne({'phone.number':phone}).exec()
        if(USER != null){
            if(USER['phone']['expire'] != 0 && Date.now() < USER['phone']['expire']) return res.json({ status : false , message : 'زمان استفاده از کد تایید قبلی تمام نشده است.' , expire : Math.floor((USER['phone']['expire'] - Date.now())/1000) })
            else{
                let token = await TOKEN.sms();
                await user.updateOne({'phone.number':phone}, { 'phone.token':token, 'phone.expire':Date.now()+60000, 'auth.access_token': null, 'auth.refresh_token': null });
                await SEND.sms(phone, token);
                return res.json({ status : true , message : 'کد تایید ارسال شد.' })
            }
        } else {
            let token = await TOKEN.sms();
            new user({ 'phone.number' : phone, 'phone.token' : token }).save();
            await SEND.sms(phone, token);
            return res.json({ status : true , message : 'کد تایید ارسال شد.' })
        }
    }
}

async function verify(req,res){
    let phone = req.body.phone,
        token = req.body.token;

    if(!phone) return res.json({ status : false , message : 'شماره تلفن ارسال نشده است.' })
    if(!token) return res.json({ status : false , message : 'کد تایید ارسال نشده است.' })
    else if(phone.length != 11) return res.json({ status : false , message : 'شماره تلفن اشتباه است.' })
    else if(token.length != 5) return res.json({ status : false , message : 'کد تایید اشتباه است.' });
    else{
        let USER = await user.findOne({'phone.number':phone}).exec()
        if(USER == null) return res.json({ status : false , message : "این شماره تلفن یافت نشد." })
        else if(USER['phone']['token'] != token) return res.json({ status : false , message : "این کد تایید ثبت نشده است." })
        else{
            let auth = await AUTH.generate(USER['_id'], 'user');
            await user.updateOne({'phone.number':phone}, { 
                'phone.token':null, 'phone.verified':true, 'phone.expire' : 0,
            });
            return res.json({ status : true ,
                message : "شما با موفقیت وارد شدید." ,
                info : { name : USER['name'], location : USER['location'], balance: USER['balance'] },
                auth});
        }
    }
}


async function autologin(req,res){
    let token = req.body.token;
    if(!token) return res.json({ status : false , message : 'توکن ارسال نشده است.' })
    else{
        try {
            let refresh = await AUTH.RefreshToken(token);
            if(refresh == false) return res.json({ status : false, message : "این توکن اشتباه است." })
            else{
                let auth = await AUTH.generate(refresh['_id'], 'user');
                return res.json({ status : true ,
                    message : "شما با موفقیت وارد شدید." ,
                    info : { name : account['name'], location : account['location'], balance: account['balance'] },
                    auth});
            }
        } catch (error) {
            return res.json({ status : false, message : "این توکن اشتباه است." });
        }
    }
}


module.exports = { send , verify , autologin };
