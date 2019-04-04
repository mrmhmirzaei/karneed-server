const route = require('express').Router(),
    request = require('../../controller/request'),
    middleware = require('../../middlewares/auth'),
    permission = require('../../middlewares/permission');

// PATH: /api/request/add
route.post('/add', middleware, permission(['user']), request.add);

// PATH: /api/request/update
route.post('/update', middleware, permission(['admin']), request.update);

// PATH: /api/request/remove
//route.post('/remove', request.remove);

// PATH: /api/request/pay
route.post('/pay', middleware, permission(['admin']), request.PayAll);

// PATH: /api/request/admin/all
route.get('/admin/all', middleware, permission(['admin']), request.all);

// PATH: /api/request/all
route.get('/all', middleware, permission(['user', 'expert']), request.getAll);

// PATH: /api/request/one?id
route.get('/one', middleware, permission(['user', 'expert']), request.getOne);

// PATH: /api/request/score
route.post('/score', middleware, permission(['user']), request.score);

// PATH: /api/request/status?set=
route.post('/status', middleware, permission(['expert']), request.status);

// PATH: /api/request/paid
route.post('/paid', middleware, permission(['expert']), request.paid);

module.exports = route;
