const express = require('express').Router();

express.use('/admin', require('./admin'))
express.use('/expert', require('./expert'))
express.use('/user', require('./user'))
express.use('/auto', require('./auto'))

module.exports = express;