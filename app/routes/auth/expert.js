const route = require('express').Router(),
    expert = require('../../controller/auth/expert');

// PATH: /auth/expert/send
route.post('/send', expert.send);

// PATH: /auth/expert/verify
route.post('/verify', expert.verify);

// PATH: /auth/expert/login/auto <= login with refresh_token
route.post('/login/auto', expert.autologin);

module.exports = route;