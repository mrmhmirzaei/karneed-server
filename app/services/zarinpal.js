const ZARINPAL = require('zarinpal-checkout'),
    env = require('../../env'),
    zarinpal = ZARINPAL.create(env.zarinpal.token, env.zarinpal.debug);

module.exports = zarinpal;