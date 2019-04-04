const base = require('base64-img'),
    PATH = require('path');

module.exports = async (data,name,path='/')=>{
    let dir = path;
    path = await PATH.join(__dirname,'../static/',path);
    path = await base.imgSync(data, path, name);
    path = await PATH.basename(path);
    return await PATH.join(dir, path);
}