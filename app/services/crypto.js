const crypto = require('crypto'),
      env = require('../../env');
      
const key = Buffer.from(env.auth.key, 'base64'),
      algorithm = '';

module.exports = {
    hash : (data)=>{
        data += '';
        var encrypted = null;
        var buffer = BufferFrom(data, 'utf-8');
        var iv = IV();
        var cipher = crypto.createCipheriv(algorithm, key, iv);
        var encryptedBuffer = cipher.update(buffer);
        encrypted = Buffer.concat([iv, encryptedBuffer, cipher.final()]).toString('hex');

        return encrypted;	
    },
    crack : (data)=>{
        data += '';
        var result = null;
        var encryptedBlob = BufferFrom(data, 'hex');
        var iv = encryptedBlob.slice(0, 16);
        var buffer = encryptedBlob.toString('base64', 16);

        var decipher = crypto.createDecipheriv(algorithm, key, iv);
        result = decipher.update(buffer,'base64','utf-8');
        result += decipher.final('utf-8'); 
        return result;
    }
}

function IV(){
    return crypto.randomBytes(16);
}
function BufferFrom(data,type){
    return new Buffer.from(data, type);
}
