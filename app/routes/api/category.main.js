const  route = require('express').Router(), 
    category = require('../../controller/category.main'),
    middleware = require('../../middlewares/auth'),
    permission = require('../../middlewares/permission');

// PATH: /api/category/main/all
route.get('/all', category.all);

// PATH: /api/category/main/add
route.post('/add', middleware, permission(['admin']), category.add);

// PATH: /api/category/main/update
route.post('/update', middleware, permission(['admin']), category.update);

// PATH: /api/category/main/remove
route.post('/remove', middleware, permission(['admin']), category.remove);

module.exports = route;