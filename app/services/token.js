const env = require('../../env'),
    { hash } = require('../services/crypto');
module.exports = {
    email : async(id)=>{
        return await hash(id);
    },
    sms : ()=>{
        var possible = env.token.possible;
        var text = "";
        for (var i = 0; i < env.token.difficulty; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
}