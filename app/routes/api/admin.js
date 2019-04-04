const route = require('express').Router(),
    middleware = require('../../middlewares/auth'),
    admin = require('../../controller/admin'),
    permission = require('../../middlewares/permission');
    
// PATH: /api/admin/profile/edit
route.post('/profile/edit', middleware, permission(['admin']), admin.editProfile);

module.exports = route;