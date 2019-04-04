const route = require('express').Router(),
    admin = require('../../controller/auth/admin');

// PATH: /auth/admin/send
route.post('/send', admin.send);

// PATH: /auth/admin/verify
route.post('/verify', admin.verify);

// PATH: /auth/admin/login <= login with password
route.post('/login', admin.login);

// PATH: /auth/admin/login/auto <= login with refresh_token
route.post('/login/auto', admin.autologin);

module.exports = route;