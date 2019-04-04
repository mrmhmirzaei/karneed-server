const route = require('express').Router(),
    user = require('../../controller/auth/user');

// PATH: /auth/user/send
route.post('/send', user.send);

// PATH: /auth/user/verify
route.post('/verify', user.verify);

// PATH: /auth/user/login/auto <= login with refresh_token
route.post('/login/auto', user.autologin);

module.exports = route;