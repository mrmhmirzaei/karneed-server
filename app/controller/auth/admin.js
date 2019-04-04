const admin = require('../../database/admin'),
    TOKEN = require('../../services/token'),
    SEND = require('../../services/send'),
    AUTH = require('../../services/auth');
    
async function send(req,res){
    let phone = req.body.phone;
    if(!phone) return res.json({ status : false , message : 'شماره تلفن ارسال نشده است.' })
    else if(phone.length != 11) return res.json({ status : false , message : 'شماره تلفن اشتباه است.' })
    else{
        let ADMIN = await admin.findOne({'phone.number':phone}).exec()
        if(ADMIN != null){
            if(ADMIN['phone']['verified'] == false) return res.json({ status : false , message : 'این شماره تلفن تایید نشده است.' })
            else if(ADMIN['phone']['expire'] != 0 && Date.now() < ADMIN['phone']['expire']) return res.json({ status : false , message : 'زمان استفاده از کد تایید قبلی تمام نشده است.' , expire : Math.floor((ADMIN['phone']['expire'] - Date.now())/1000) })
            else{
                let token = await TOKEN.sms();
                
                await admin.updateOne({'phone.number':phone}, { 'phone.token':token, 'phone.expire':Date.now()+60000});
                await SEND.sms(phone, token);
                return res.json({ status : true , message : 'کد تایید ارسال شد.' })
            }
        } else return res.json({ status : false , message : 'این شماره تلفن ثبت نشده است.' })
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
        let ADMIN = await admin.findOne({'phone.number':phone}).exec()
        if(ADMIN == null) return res.json({ status : false , message : "این شماره تلفن یافت نشد." })
        else if(ADMIN['phone']['token'] != token) return res.json({ status : false , message : "این کد تایید ثبت نشده است." })
        else{
            let auth = await AUTH.generate(ADMIN['_id'],'admin');
            await admin.updateOne({'phone.number':phone}, { 'phone.token':null, 'phone.expire':0 });
            return res.json({ status : true ,
                message : "شما با موفقیت وارد شدید." ,
                info : { name : ADMIN['name'] } ,
                auth});
        }
    }
}

async function login(req,res){
    res.json({ status: false , message:"این صفحه حذف شده است." })
}


async function autologin(req,res){
    let token = req.body.token;
    if(!token) return res.json({ status : false , message : 'توکن ارسال نشده است.' })
    else{
        try {
            let refresh = await AUTH.RefreshToken(token);
            if(refresh == false) return res.json({ status : false, message : "این توکن اشتباه است." })
            else{
                let auth = await AUTH.generate(refresh['_id'], 'admin');
                return res.json({ status : true ,
                    message : "شما با موفقیت وارد شدید." ,
                    info : { name : account['name'] },
                    auth});
            }
        } catch (error) {
            return res.json({ status : false, message : "این توکن اشتباه است." })
        }
    }
}

module.exports = { send , verify , login , autologin };