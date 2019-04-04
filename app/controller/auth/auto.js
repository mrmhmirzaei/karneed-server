const user = require('../../database/user'),
    expert = require('../../database/expert'),
    AUTH = require('../../services/auth');

async function getInfo(access_token=''){
    try {
        access_token = await AUTH.getDataFromToken(access_token);  
        access_token = access_token['data'];              
        let permission = await access_token.split('-')[0],
            _id = await access_token.split('-')[1];
        if(permission == 'user' || permission == 'expert'){
            let db = null
            if(permission == 'user') db = user;
            if(permission == 'expert') db = expert;
            let info = await db.findById(_id).exec();
            if(info == null) return { status : false , message : 'حساب کاربری شما یافت نشد.' }
            else return { status : true, 
                message : "شما با موفقیت وارد شدید.", 
                info : { 
                    name : info['name'],
                    phone : info['phone']['number'],
                    location : info['location'],
                    permission
                }
            };
        } else {
            return { status : false , message : 'شما نمی توانید وارد حساب خود شوید.' };
        }    
    } catch (error) {
        console.log(error);
        
        return { status : false , message : 'خطا در ورود خودکار از سوی سرور' }
    }
}

async function auto(req,res){
    // let token = req.body.token;
    // if(!token) return res.json({ status : false , message : 'توکن ارسال نشده است.' })
    // else{
    //     let auth = await AUTH.checkRefreshToken(token);    
    //     if(auth['status'] == false) return res.json({ status : false , message : "توکن اشتباه است." })  
    //     let info = await getInfo('Bearer '+auth['access_token']);
    //     if(info['status'] == true){
    //         info['auth'] = auth;
    //     } 
    //     return res.json(info)
    // }
    return res.json({ status: false, message: "این صفحه حدف شده است." })
}

module.exports = { auto };