const route = require('express').Router(),
    auto = require('../../controller/auth/auto');

// PATH : /auth/auto
route.post('/', auto.auto);

module.exports = route;