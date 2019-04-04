const route = require('express').Router(),
    middleware = require('../../middlewares/auth'),
    permission = require('../../middlewares/permission'),
    balance = require('../../controller/balance');

// PATH: /api/balance/add
route.post('/add', middleware, permission(['user']), balance.add);

// PATH: /api/balance/checkout
route.get('/checkout', balance.checkout);

// PATH: /api/balance/all
route.get('/all', middleware, permission(['user']), balance.getAll);

// PATH: /api/balance/one
route.get('/one', middleware, permission(['user']), balance.getOne);

// PATH: /api/balance/me
route.get('/me', middleware, permission(['user']), balance.me);

module.exports = route;