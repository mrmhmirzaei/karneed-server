const webpush = require('web-push'),
    push = require('../database/push'),
    env = require('../../env');

webpush.setVapidDetails(`mailto:${env.email.auth.user}`, env.push.public, env.push.private);

async function notify(ref='', payload= { title : '' }){
    let account = push.findOne({ ref }).exec();
    if(account == null) return false;
    else {
        try {
            await webpush.sendNotification(account['data'], payload)
            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = { notify };
