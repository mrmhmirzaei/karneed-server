const route = require('express').Router(),
    push = require('../../controller/push');


//PATH: /api/push/subscribe
route.post('/subscribe', push.subscribe);

module.exports = route;
