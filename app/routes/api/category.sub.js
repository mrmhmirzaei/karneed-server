const  route = require('express').Router(),
    category = require('../../controller/category.sub'),
    middleware = require('../../middlewares/auth'),
    permission = require('../../middlewares/permission');

// PATH: /api/category/sub/all
route.get('/all', category.all);

// PATH: /api/category/sub/all/:main
route.get('/all/:main', category.allBy);

// PATH: /api/category/sub/add
route.post('/add', middleware, permission(['admin']), category.add);

// PATH: /api/category/sub/update
route.post('/update', middleware, permission(['admin']), category.update);

// PATH: /api/category/sub/remove
route.post('/remove', middleware, permission(['admin']), category.remove);

module.exports = route;
