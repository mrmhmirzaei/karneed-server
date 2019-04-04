const route = require('express').Router(),
    count = require('../../controller/count');

// PATH: /api/count/init
route.get('/init', count.init);

module.exports = route;