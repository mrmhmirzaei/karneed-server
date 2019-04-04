const  route = require('express').Router(),
    job = require('../../controller/job'),
    middleware = require('../../middlewares/auth'),
    permission = require('../../middlewares/permission');

// PATH: /api/job/all
route.get('/all', middleware, permission(['admin']), job.all);

// PATH: /api/job/expert
route.get('/expert', middleware, permission(['expert']), job.allExpert);

// PATH: /api/job/all/:category
route.get('/all/:category', job.allBy);

// PATH: /api/job/one?id
route.get('/one', job.getOne);

// PATH: /api/job/add
route.post('/add', middleware, permission(['admin']), job.add);

// PATH: /api/job/update
route.post('/update', middleware, permission(['admin','expert']), job.update);

// PATH: /api/job/remove
route.post('/remove', middleware, permission(['admin']), job.remove);

module.exports = route;
