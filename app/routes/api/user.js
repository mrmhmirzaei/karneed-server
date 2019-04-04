const route = require('express').Router(),
    middleware = require('../../middlewares/auth'),
    user = require('../../controller/user'),
    permission = require('../../middlewares/permission');
    
// PATH: /api/user/profile/edit
route.post('/profile/edit', middleware, permission(['user']), user.update);

module.exports = route;