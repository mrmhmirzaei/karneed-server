#!/usr/bin/env node
const figlet = require('figlet'),
    chalk = require('chalk'),
    inquirer = require('inquirer'),
    mongoose = require('../node_modules/mongoose'),
    admin = require('../app/database/admin'),
    token = require('../app/services/token'),
    send = require('../app/services/send'),
    env = require('../env');

    mongoose.connect(env.database,{ useNewUrlParser: true , useCreateIndex : true });

function logo(){
    console.log(chalk.yellow(figlet.textSync('Karneed', { horizontalLayout: 'Standard' })));
}

async function info(){
    let data = {
        name : 'Karneed CLI',
        description : 'Register new admin form.',
        version : '0.0.1',
        author : 'Mr.MHMirzaei'
    };
    await Object.keys(data).forEach(key=>{
        value = data[key];
        key = key.slice(0,1).toUpperCase() + key.slice(1);
        console.log(chalk.cyan(key+": ")+chalk.white(value));
    });
    return true;
}

async function createAdmin(data={}){
    try{        
        await new admin(data).save();
        await sendToken(data['phone.number'])
    } catch (error) {        
        return Promise.reject("This phone number registered before.");
    }
}

function sendToken(phone=''){
    return new Promise(async (resolve,reject)=>{
        let TOKEN = await token.sms();
        await admin.updateOne({'phone.number':phone}, { 'phone.token':TOKEN });
        await send.sms(phone, TOKEN);
        setTimeout(() => {
            resolve();
        }, 2500);
    });
}

function checkToken(phone='', TOKEN=''){
    return new Promise(async (resolve,reject)=>{
        let result = await admin.findOne({'phone.number':phone}).exec();
        if(result['phone']['token'] == TOKEN){
            await admin.updateOne({'phone.number':phone}, { 'phone.token':null, 'phone.verified':true });
            resolve('Your phone number verified successfully.');
        } else {
            reject('This is incorrect token.')
        }
    });
}

function ask(){
    let questions = [
        {
            type : "input",
            name : "name",
            message : "Enter new admin fullname:"
        },
        {
            type : "input",
            name : "phone",
            message : "Enter new admin phone number:",
        },
        {
            type : "confirm",
            name : "confirm",
            message : "Are you sure?",
        }
        ,{
            input : "input",
            name : "token",
            message : "Enter the send token:",
            filter : (answer)=>{
                return new Promise((resolve,reject)=>{
                    if(typeof answer == 'string' &&  answer.length == 5 && parseInt(answer)){
                        resolve(answer);
                    } else reject("Token is incorrect.")
                })
            },
            when : async (answer)=>{
                if(answer.confirm == true){
                    let data = { 'name' : answer['name'] , 'phone.number' : answer['phone'] }
                    await createAdmin(data);
                    return true;
                } else {
                    await process.stdout.write(chalk.yellow("Warning: ")+chalk.white('Registration canceled.'));
                    await process.exit(1);
                    return false;
                }
            }
        }
    ];
    return inquirer.prompt(questions);
}


async function init(){
    process.on('SIGINT', async()=>{
        await console.log(chalk.yellow("Warning: ")+chalk.white('Registration canceled.'));
        await process.exit(1);
    });
    try {
        console.clear();
        await logo();
        await info();
        let answer = await ask();
        let result = await checkToken(answer['phone'], answer['token']);
        await process.stdout.write(chalk.green("Success: ")+chalk.white(result)+"\n");
        process.exit(1);
    } catch (error) {
        await process.stdout.write(chalk.red("Error: ")+chalk.white(error));
        process.exit(1);
    }
}

init();