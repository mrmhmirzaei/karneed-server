const fs = require('fs'),
    path = require('path'),
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let dir = path.join(__dirname,'../','../','logs')

async function folder(){
    let index = new Date().getMonth();
    let folder_name = months[index];
    let folder_path = await path.join(dir,folder_name);
    let exists = await fs.existsSync(folder_path);    
    if(exists == false){
        await fs.mkdirSync(folder_path);
        return folder_path;
    } else {
        return folder_path;
    }
}

async function file(data=''){
    let folder_path = await folder();
    let day = new Date().getDate();
    let file_name = day+'.log';
    let file_path = await path.join(folder_path, file_name);
    await fs.appendFileSync(file_path,data);
    return file_path;
}

async function log(title='Untitled error', error=''){
    let date = new Date()
    let time = `${date.getHours()}:${date.getMinutes()}`
    error = '\n'+time+'\t'+title+'\n'+error+'\n';
    await file(error);
}

module.exports = log;