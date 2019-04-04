const jwt = require('jsonwebtoken'),
    env = require('../../env');

async function generate(id='', type = ''){
    if(!typeof data == String) return { status : false , message : 'داده نادرست است.' };
    else{
        data = { id, type };
        let access_token = await jwt.sign(data, env.auth.key, { expiresIn : env.auth.access_token_expire });
        let refresh_token = await jwt.sign(data, env.auth.key, { expiresIn : env.auth.refresh_token_expire });
        
        let object = new Object();
            object['token_type'] = "bearer";
            object['access_token'] = access_token;
            object['expires_in'] = env.auth.access_token_expire;
            object['refresh_token'] = refresh_token;
    
        return object;
    }
}

async function AccessToken(token=''){    
    if(token.includes('Bearer') == false && token.includes('bearer') == false) return false;
    else{
        token = await token.split(' ')[1];
        try {
            let data = jwt.verify(token, env.auth.key);            
            return data;
        } catch (error) {
            return false;
        }
    }
}

async function RefreshToken(token=''){
    try {
        let data = jwt.verify(token, env.auth.key);
        return data;
    } catch (error) {
        return false;
    }
}


module.exports = { generate, AccessToken, RefreshToken }