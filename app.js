const express = require('express');
const db = require('./mongodb/db.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const config = require('config-lite')(__dirname);
const connectMongo = require('connect-mongo');
const MongoStore = connectMongo(session);
const winston = require('winston');
const expressWinston = require('express-winston');
const Statistic = require('./middlewares/statistic.js');
const routes = require('./routes/index.js');


const app = express();

//跨域请求的设置
app.all(function(req,res,next){
    res.header('Access-Control-Allow-Origin',req.header.origin || '*');//跨域的源
    res.header('Access-Control-Allow-Headers','Content-Type','Authorization','X-Requested-With');//允许请求中携带的字段
    res.header('Access-control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');//允许客户端使用的方法请求
    res.header('Access-Control-Allow-Credentials',true);//发送cookie 可是要客户端与服务端都要允许
    if(req.method == 'OPTIONS'){
        res.send(200);
    }else {
        next();
    }
});

app.disable('x-powered-by');

//app.use(Statistic.apiRecord);
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(session({
    name: config.session.name,
    secret : config.session.secret,
    resave : true,
    saveUninitialized : false,
    cookie: config.session.cookie,
    store : new MongoStore({url : config.url})
}));


app.use(expressWinston.logger({
    transports : [
        new (winston.transports.Console)({
            json : true,
            colorize : true 
        }),
        new winston.transports.File({
            filename: 'logs/success.log'
        })
    ]
}))

app.get('/',function(req,res){
    res.json({
        status : 1,
        message : '第一次成功'
    });
});

routes(app);

app.use(expressWinston.errorLogger({
    transports : [
        new winston.transports.Console({
            json : true,
            colorize : true
        }),
        new winston.transports.File({
            filename : 'logs/error.log'
        })
    ]
}));


app.listen(config.port);