const route = require('express').Router(),
    post = require('../../controller/post.blog'),
    middleware = require('../../middlewares/auth'),
    permission = require('../../middlewares/permission');

// PATH: /api/post?page&limit
route.get('/', post.get);

// POST: /api/post/all
route.get('/all', middleware, permission(['admin']), post.all);

// PATH: /api/post/one/:title
route.get('/one/:title', post.one)

// PATH: /api/post/add
route.post('/add', middleware, permission(['admin']), post.add);

// PATH: /api/post/update
route.post('/update', middleware, permission(['admin']), post.update);

// PATH: /api/post/remove
route.post('/remove', middleware, permission(['admin']), post.remove);

module.exports = route;