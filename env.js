module.exports = {
    host: 'https://api.karneed.ir',
    port: 3000,
    auth: {
        key: '',
        access_token_expire: 86400000,
        refresh_token_expire: 86400000 * 24
    },
    token: {
        difficulty: 5,
        possible: "0123456789"
    },
    cache: {
        expire: 86400000
    },
    email: {
        service: 'gmail',
        auth: {
            user: '',
            pass: ''
        }
    },
    sms: {
        enable: true,
        number: "10000000007997",
        key: ""
    },
    push: {
        public: "",
        private: ""
    },
    zarinpal: {
        debug: true,
        token: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
    },
    database: ''
}
