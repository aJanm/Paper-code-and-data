var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// 以下为处理请求的中间件
var bodyParser   = require('body-parser');
var logger = require('morgan');
// var formidable = require('formidable');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

// app.use和app.get，router.use和router.get的区别：
// .use的第二个参数可以传递一个对象或者是一个函数，可以匹配所有的请求方式。 而.get或者.post第二个参数都只能时一个函数。

//ejs中 设置全局数据   所有的页面都可以使用
app.locals['userinfo']='';

// 保存用户消息
var session = require('express-session');
// process 对象是一个全局变量，提供了有关当前 Node.js 进程的信息并对其进行控制。 作为全局变量，
// 它始终可供 Node.js 应用程序使用，无需使用 require()。 它也可以使用 require() 显式地访问：
const {connected} = require('process');
const {ifError} = require('assert');
// 配置中间件 固定格式
app.use(session({
  secret: 'jianjian',// secret: 一个随机字符串，因为客户端的数据都是不安全的，所以需要进行加密
  resave: false,
  saveUninitialized: true,
  cookie:{
    maxAge:1000*60*30
  },
  rolling:true,
}))

//以下两句由系统自动生成，作用是使用ejs模板引擎，同时设置views文件夹存放模板 view engine setup
app.set('views', path.join(__dirname, 'views'));//配置页面文件的根目录，举例：访问./login则等同于访问view/index.ejs
app.set('view engine', 'ejs');
app.all("*",function(req,res,next){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  //让options尝试请求快速结束
    else
        next();
})

//路径中的“.”：当前目录，“..”：当前目录的上一级目录
//系统自动生成，作用是配置public目录为我们的静态资源目录,他必须放在session之前
// https://blog.csdn.net/weixin_42565137/article/details/89382398
app.use(express.static(path.join(__dirname, 'public')));//配置静态文件的根目录

app.use(logger('dev'));

app.use(bodyParser.json());
// 处理请求体
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 自定义中间件，判断登录状态
// next函数主要负责将控制权交给下一个中间件，如果当前中间件没有终结请求，
// 并且next没有被调用，那么请求将被挂起，后边定义的中间件将得不到被执行的机会。
// 一定要将拦截器放在中间件或静态资源的后面，路由定义的前面，
// 以至于无法加载白名单中的public中的文件，js、css、image和中间件
// 不管是加载哪个路由，以下这个部分基本上都会执行
app.use(function(req,res,next){
  // res.locals.session = req.session;
  // if (req.url == '/login' || req.url == '/users/login' || req.url == '/users/register' || req.url == '/register') {
  console.log("res.locals:",res.locals);
  // 现在出现一个奇怪的情况，ajax使用/users/historyajax访问时，session信息中无userinfo信息
  // 没有办法的办法，就是尝试将该直接放行 将 req.url == '/users/historyajax'添加到if条件中
  // console.log("app.js use中 req.url为",req.url,"typeof url:",typeof(req.url),req.url.length);
  //其中一次的打印结果如下,ajax中历史数据可视化的路由如下，91个字符，“/users/historyajax”字符为18个
  // /users/historyajax?searchTime=2021-05-01&beginTime=09%3A20&endTime=11%3A40&sel=%22Light1%22 typeof url: string 91
  var historyajaxSubUrl;
  if(req.url.length>=18){
	console.log("req.url.slice(0,18):",req.url.slice(0,18));
	if (req.url.slice(0,18) == "/users/historyajax") {
		historyajaxSubUrl ="/users/historyajax"; 
	} else{
		historyajaxSubUrl = "";
	} 
  }
  if (req.url == '/login' || req.url == '/users/login' || req.url == '/users/register' || req.url == '/register' || historyajaxSubUrl == '/users/historyajax' ) {
  // if (req.url == '/login'||req.url == '/register') {
    console.log('定位点1');
	next();
    
  }else{
	  var data ={
	    name: req.body.usrname,
	    password:req.body.password
	  }
	  // console.log("req.session:",req.session);
	  // console.log('app.js data:',data);
	  console.log('req.session.userinfo:',req.session.userinfo);
    if (req.session.userinfo != undefined) {//判断是否登录
		console.log('userinfo:',req.session.userinfo);
      app.locals['userinfo'] = req.session.userinfo;
	  // console.log("app.locals:",app.locals);
      next();
    }else{
		console.log('定位点2'); 
      res.redirect('/login');
	  // res.render('login',{account:'',password:''});
    }
  }
  // next();
})




app.use('/', indexRouter);
app.use('/users', usersRouter);




// 异常处理必须放在最后
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
