const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    path = require('path'),
    env = require('./env'),
    app = express();

mongoose.connect(env.database,{ useNewUrlParser: true , useCreateIndex : true });

app.set('views', './app/views'); 
app.set('view engine', 'ejs');

app.use('/static', express.static(path.join(__dirname,'app','static')))

// app.use((req,res,next)=>{
//     res.header('Access-Control-Allow-Credentials', "true");
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
//     next();
// })

app.use(cors());


app.use(bodyParser.urlencoded({extended : true, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));

app.use('/auth', require('./app/routes/auth/routes'));
app.use('/', require('./app/routes/api/routes'));

app.get('*', (req,res)=>{
    res.status(404).json({
        status: false,
        code: 404,
        message: "صفحه یافت نشد."
    })
})

app.listen(env.port,()=>{
    console.log('Server is ready ...');
});