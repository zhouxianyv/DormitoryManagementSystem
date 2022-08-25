var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dbObj = require("./utils/Db"); // 数据库对象
const {Guest,MError} = require("./utils/Result"); // 封装统一接口返回方法
const {checkToken,getuid} = require("./utils"); // 登录拦截中间件
const { validator } = require("./validator"); // 参数合法性校验
var app = express();
app.use(dbObj.connection); // 使用单例模式建立数据库连接， 给express应用对象添加中间件功能
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static("./www"));
app.use(logger('dev'));
app.use(express.json({limit: '80mb'}));
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use((req, res, next) => { // 负责挂载uid到req对象身上
    getuid(req);
    next();
});
app.use((req, res, next) => { // 负责验证参数合法性
    validator(req) ? next() : res.send(MError());
})
var loginRouter = require('./routes/login');
app.use('/api', loginRouter);//前台、后台用户登录
app.use(express.static(path.join(__dirname, 'public')));
var publicRouter = require('./routes/public');
app.use('/api', publicRouter);
// 如果想被登录拦截器拦截判断的, 接口放到下面
app.use(async (req, res, next) => {
     if (!req.headers.authorization) {
         res.send(MError("请设置请求头,并携带验证字符串"));
     } else {
         if (!await checkToken(req)) { // 过期  
             res.send(Guest([],"登录已过期或访问权限受限"));
         } else {
             next();
         }
     }
});
var menuRouter = require('./routes/menu');
app.use('/api', menuRouter);
var roleRouter = require('./routes/role');
app.use('/api', roleRouter);
var adminRouter = require('./routes/admin');
app.use('/api', adminRouter);
var buildRouter = require('./routes/build');
app.use('/api', buildRouter);
var otherRouter = require('./routes/other');
app.use('/api', otherRouter);
var roomRouter = require('./routes/room');
app.use('/api', roomRouter);
var studentRouter = require('./routes/student');
app.use('/api', studentRouter);
var bannerRouter = require('./routes/banner');
app.use('/api', bannerRouter);
var informationRouter = require('./routes/information');
app.use('/api', informationRouter);
var noticeRouter = require('./routes/notice');
app.use('/api', noticeRouter);
var reportRouter = require('./routes/report');
app.use('/api', reportRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;