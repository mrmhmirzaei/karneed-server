const NODEMAILR = require('nodemailer'),
    request = require('request'),
    env = require('../../env'),
    nodemailer = NODEMAILR.createTransport(env.email);

async function email(address='', token=''){
    let link = `${env.host}/auth/verify/${token}`
    let options = {
        from: env.email.auth.user,
        to: address,
        subject: "تایید حساب کاربری",
        html: `<html dir="rtl"><h3>تایید حساب کاربری</h3><p>برای تایید حساب کاربری خود بر روی لینک زیر کلیک یا در نوار آدرس مرورگر خود کپی کرده و کلید Enter را فشار دهید.</p><p><a href="${link}">${link}</a></p></html>`
    }
    await nodemailer.sendMail(options)
    return true;
}

function sms(receptor='', content='', message=false){
    if(env.sms.enable == false) return;
    return new Promise((resolve, reject)=>{
        let options = {
          url : "https://ghasedakapi.com/v1/sms/send/simple",
          method : 'POST',
          json : true,
          form : {
            message : (message)?content:`کد تایید شما ${content} می باشد`,
            Receptor : receptor,
            linenumber : env.sms.number
          },
          headers : {
            apikey : env.sms.key
          }
        };
        request(options, (error,response,body)=>{
          if(error) reject(error);
          else resolve();
        })
    })
}

module.exports = { email, sms };