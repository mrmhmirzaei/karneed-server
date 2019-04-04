const auth = require('../services/auth');

module.exports = async(req,res,next)=>{    
    let token = req.headers.authorization ||
                req.body.authorization ||
                req.body.token ||
                req.query.token;
                
    if(!token) res.json({ status : false , message : 'توکن ارسال نشده است.' });
    else {
        try {
            let AUTH = await auth.AccessToken(token);            
            if(AUTH == false) res.json({ status : false , message : "توکن اشتباه است." })
            else{
                req.token = token;
                req._id = AUTH['id'];
                req.permission = AUTH['type'];   
                                
                next();
            }
        } catch (error) {
            res.json({ status : false , message : "توکن اشتباه است." })
        }
    }
};