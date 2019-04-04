const express = require('express').Router();

express.use('/admin', require('./admin'));
express.use('/category/main', require('./category.main'));
express.use('/category/sub', require('./category.sub'));
express.use('/expert', require('./expert'));
express.use('/job', require('./job'));
express.use('/request', require('./request'));
express.use('/user', require('./user'));
express.use('/count', require('./count'));
express.use('/post', require('./post.blog'));
express.use('/push', require('./push'));
express.use('/balance', require('./balance'));

express.all('*', (req,res)=>res.json({ status: false, code: 404, message: 'این آدرس وجود ندارد.' }))

module.exports = express;