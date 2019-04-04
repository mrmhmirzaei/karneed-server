const  route = require('express').Router(), 
    expert = require('../../controller/expert'),
    middleware = require('../../middlewares/auth'),
    permission = require('../../middlewares/permission');

// PATH: /api/expert/all
route.get('/all', middleware, permission(['admin']), expert.all);

// PATH: /api/expert/one
route.get('/one', middleware, permission(['admin']), expert.getOneByPhone);

// PATH: /api/expert/add
route.post('/add', middleware, permission(['admin']), expert.add);

// PATH: /api/expert/update
route.post('/update', middleware, permission(['admin','expert']), expert.update);

// PATH: /api/expert/remove
route.post('/remove', middleware, permission(['admin']), expert.remove);

module.exports = route;