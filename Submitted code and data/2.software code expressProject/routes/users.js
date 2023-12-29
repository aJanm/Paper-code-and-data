var express = require('express');//加载express
var router1 = express.Router();
var model  = require('../model')//导入model文件夹中index.js中的数据库模型，以将数据保存到数据库中 
var formidable = require('formidable');
//读写文件所需要的包
var iconv = require('iconv-lite');
var fs    = require('fs');
var PATH  = require('path');
var mime  = require('mime');
var resData;
const urlbli = require('url');

const webSkt = require('../bin/webSkt.js');
const historyWebSkt = require('../bin/historyDataWebskt.js');
// 定义一个全局函数findMonthsAndDays2023年12月10日
function findMonthsAndDays(startDateString, endDateString) {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    let currentDate = new Date(startDate);
    const months = [];
    const years = [];
    const days = new Set();

    // 遍历起始日期到终止日期之间的每一天
    while (currentDate <= endDate) {
        // 添加月份到数组中
        const month = currentDate.getMonth() + 1; // 月份是从 0 开始计数
        if (!months.includes(month)) {
            months.push(month);
        }

        // 添加年份到数组中
        const year = currentDate.getFullYear();
        if (!years.includes(year)) {
            years.push(year);
        }

        // 添加日期到集合中
        days.add(currentDate.getDate());

        // 增加一天
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return { months, years, days: Array.from(days).sort((a, b) => a - b) };
}

// 例子
// const startDate = "2023-01-15";
// const endDate = "2023-03-05";

// const { months, years, days } = findMonthsAndDays(startDate, endDate);
// console.log("月份列表:", months);
// console.log("年份列表:", years);
// console.log("日期列表:", days);



// var http = require('http');
// var url  = require('url');
// var createServer = http.createServer(onRequest);
// function onRequest(req,res){
//   res.writeHead(200, {
//     'Content-Type': 'text/plain',
//     'Access-Control-Allow-Origin': '*'
// });
// var str = JSON.stringify(url.parse(req.url, true).query);
// res.write(str);
// res.end();
// }
// createServer.listen(
//   3000
// );
/* GET users listing. */
router1.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router1.use(function(req,res,next){
  resData = {
    code:0,
    message:''
  };
  next();
});

// 注册接口如下：
router1.post('/register',function(req,res,next){
  var data ={
    usrname: req.body.usrname,
    password: req.body.password,
    password2: req.body.password2
  };
  var insertToDbs = {
    name: req.body.usrname,
    password: req.body.password
  }
  //以下判断用来确保三个输入框内的内容不为空，
  if(data.usrname==''||data.password==''||data.password2==''){
    var judge1,judge2,judge3;
    judge1=0;
    judge2=0;
    judge3=0;
    if(data.usrname==''){
      judge1=1;
    }
    if(data.password==''){
      judge2=1;
    }
    if(data.password2==''){
      judge3=1;
    }
    if(judge1==1&&judge2==1&&judge3==1){
      // 使用render一次性把数据传输过去，而不是使用多个render
      res.render('register', {account: 'Please enter your account',password:'Please enter password',repassword:'Please make sure your passwords are the same'});
    }else if(judge1==1&&judge2==0&&judge3==0){
      // 使用render一次性把数据传输过去，而不是使用多个render
      res.render('register', {account: 'Please enter your account',password:'',repassword:''});
    }else if(judge1==1&&judge2==1&&judge3==0){
      // 使用render一次性把数据传输过去，而不是使用多个render
      res.render('register', {account: 'Please enter your account',password:'Please enter password',repassword:''});
    }else if(judge1==0&&judge2==1&&judge3==1){
      // 使用render一次性把数据传输过去，而不是使用多个render
      res.render('register', {account: '',password:'Please enter password',repassword:'Please make sure your passwords are the same'});
    }else if(judge1==0&&judge2==0&&judge3==1){
      // 使用render一次性把数据传输过去，而不是使用多个render
      res.render('register', {account: '',password:'',repassword:'Please make sure your passwords are the same'});
    }else if(judge1==1&&judge2==0&&judge3==1){
      // 使用render一次性把数据传输过去，而不是使用多个render
      res.render('register', {account: 'Please enter password',password:'',repassword:'Please make sure your passwords are the same'});
    }else if(judge1==0&&judge2==1&&judge3==0){
      // 使用render一次性把数据传输过去，而不是使用多个render
      res.render('register', {account: '',password:'Please enter password',repassword:''});
    }else if(judge1==0&&judge2==0&&judge3==0){
      // 使用render一次性把数据传输过去，而不是使用多个render
      res.render('register', {account: '',password:'',repassword:''});
    }
    // if(judge1==0&&judge2==0&&judge3==0){
    //   res.render('register', {account: '',password:'',repassword:''});
    // }
    return;
  }
  //以下用来判断两次的输入密码一致
  if(data.password!=data.password2){
    res.render('register', {account: '',password:'',repassword:'Please make sure your passwords are the same'});
    return;
  }
  // if(data.usrname==''){
  //   // resData.code = 1;
  //   // resData.message = "用户名不能为空";
  //   // res.json(resData);
  //   // res.redirect('/register');
  //   // alert(resData.message);
  //   // msg = '用户名不能为空';
  //   // res.locals.msg = msg;
  //   // res.sender('register',{msg});
  //   res.render('register', {account: '请输入账号'});
  //   if(data.password==''){
  //     res.render('register', {password: '请输入密码'});
  //     // return;
  //   }
  //   return;
  // }else{
  //   res.render('register', {account: ''});
  // }
  // if(data.password==''){
  //   res.render('register', {password: '请输入密码'});
  //   // return;
  // }else{
  //   res.render('register', {password: ''});
  // }
  // if(data.password!=data.password2){
  //   res.render('register', {repassword: '请确保两次输入的密码一致'});
  //   // resData.code = 2;
  //   // resData.message = "请确保两次输入的密码一致";
  //   // res.json(resData); 
  //   // return;
  // }else{
  //   res.render('register', {repassword: ''});
  // }
  model.connect(function(db){
    
    console.log( db.collection('users').find({"usrname":insertToDbs.name}));
    db.collection('users').find({name:insertToDbs.name}).toArray(function(err,arrays){
      console.log("ceshi:",arrays);
      if(err){
        console.log("err happened  when searching users collection");
        res.redirect('/register');
      }else{console.log("创建数据库成功");
        if(arrays.length>0){
          console.log("the account has been existed");
          res.render('register',{account:'This account already exists',password:'',repassword:''});
          // return;
          // model.close();
        }else{
          console.log("name:",insertToDbs.name,"psw:",insertToDbs.password);
          db.collection('users').insertOne({name:insertToDbs.name,password:insertToDbs.password},function(err,ret){
          if(err){
            console.log('Registration Failure');
 	    console.log(err);
            res.redirect('/register');
          }else{
            res.redirect('/login');
          }
    })
        }
      }
    })
// ~3.5.5
    
    
  })
});

//登录接口
router1.post('/login',function(req,res,next){
  var data ={
    name: req.body.usrname,
    password:req.body.password
  }
  res.cookie('username', req.body.usrname);
  // res.cookie('password',req.body.password);
  // 将密码放在session中
  req.session.password = req.body.password;
  // session存储在服务器上，一旦服务器重置，session消失
  console.log("session:",req.session);
  // if(req.session.password){
	 //  console.log("登录了");
  // }else{
	 //  console.log("无登录");
  // }
  //注意data用来插入到数据库中，name和password要依次和数据库项对应
  // 要保证usrname和password与数据库中的字段相对应
  // 在项目编写时使用log来打印信息，来确保获取信息成功
  console.log('登录',data);
  if(data.usrname==''||data.password==''){
    var judge1,judge2,dataLength;
    if(data.usrname==''){judge1=0};
    if(data.password==''){judge2=0};
    if(judge1==0&&judge2==0){
      res.render('login',{account:'The account number cannot be empty~',password:'Password cannot be empty~'});
      return;
    }
    if(judge1==0&&judge2==0){}
    console.log('dian1:');

    
  }
  model.connect(function(db){
    db.collection('users').find(data).toArray(function(err,docs){
      if(err){
        console.log('error');
        res.redirect('/login');
      }else{
        if(docs.length>0){
			console.log('登录查询结果：',docs);
          dataLength = docs.length;
          // console.log('length:',docs.length);
		  req.session.userinfo = docs[0];
          res.redirect('/realtime');
        }else{
          console.log('eleslength:',docs.length);
          // alert('账号或密码错误~');
          res.render('login',{account:'', password:'Incorrect account number or password~'});
        }
      }
    });
  });
  
});

//信息添加接口
router1.post('/msgAdd', function(req, res, next){
	console.log('users/msgAdd');
	// 获取来自网页表单的数据
	var form = new formidable.IncomingForm();
	// 解析数据
	form.parse(req, function(err, fields, files){
		console.log('fields:',fields);
		var temperature = fields.temperature;
		console.log('temperature:',temperature);
		var humidity = fields.humidity;
		var light = fields.light;
		var testdate = fields.testdate;
		var testtime = fields.testtime;
		var description = fields.description;
		// 2022年9月29日
		var ec = fields.ec;
		var tds = fields.tds;
		model.insert('manual_msg',{
			temperature:temperature,
			humidity:humidity,
			light:light,
			ec:ec,
			tds:tds,
			testdate:testdate,
			testtime:testtime,
			description:description
			},function(err,data){
				if(!err){
					res.redirect('/msgShow');
				}else{
					console.log('err');
				}
		});
	});
});

//信息修改接口
router1.post('/msgEdit', function(req, res, next){
	console.log('/users/msgEdit');
	//接收来自msgEdit.ejs的数据
	var form = new formidable.IncomingForm();
	form.parse(req, function(error, fields, files){
		console.log('msgEdit form:',fields);
		var _id = fields._id;
		var temperature = fields.temperature;
		var humidity = fields.humidity;
		var light = fields.light;
		var testdate = fields.testdate;
		var testtime = fields.testtime;
		var description = fields.description;
		//2022年11月3日
		var ec = fields.ec;
		var tds = fields.tds;
		var setData = {
			"temperature":temperature,
			"humidity":humidity,
			"light":light,
			"testdate":testdate,
			"testtime":testtime,
			"description":description,
			"ec":ec,
			"tds":tds
		};
		console.log("users/msgEdit中setData为：",setData);
		// console.log("修改时temperature为",temperature);
		// new model.ObjectID(_id)：把字符串_id转化为ObjectID类型
		
		model.update('manual_msg', {"_id": new model.ObjectID(_id)}, setData, function(error, data){
			if (!error) {
				res.redirect('/msgShow');
			} else{
				console.log('修改错误 error');
			}
		});
	});
})

router1.get('/ajaxtest', function(req, res, next){
	// console.log("/users/ajaxtest","username:",username,"password:",password);
	var password = req.query.password;
	var username = req.query.username;
	console.log("users/ajaxtext");
	console.log("req:",req);
	console.log("req.url: "+req.url);
	// 读取文件并返回
	// let path = '/javascripts/data.json';
	let path = PATH.resolve(__dirname,'../public/json/data.json');
	console.log("path:",path);
	console.log("拓展名：",PATH.extname(path));
	try{
		let jsondata = iconv.decode(fs.readFileSync(path, "binary"),"utf8");
		let data = JSON.parse(jsondata);
		console.log("try to print data:",data);
	}catch(e){
		//TODO handle the exception
		console.log(e);
	}
	// console.log(req);
	// res.setHeader('Content-Type', MINE_TYPES[PATH.extname(path).slice(1)]+'; charset=utf-8');
	res.setHeader('Content-Type', {'Content-type':mime.getType(path)});
	console.log("data:",data);
	res.end(data);
	return ;
})
//农事信息添加接口
router1.post('/recordAdd', function(req, res, next){
	console.log('users/recordAdd');
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files){
		console.log(fields);
		var orchard  = fields.orchard;
		console.log('orchard:',orchard);
		var firstWork = fields.first;
		var secondWork = fields.second;
		var workdate = fields.workdate;
		var worktime = fields.worktime;
		var worktime2 = fields.worktime2;
		model.insert('work_msg', {
			orchard:orchard,
			firstWork:firstWork,
			secondWork:secondWork,
			workdate:workdate,
			worktime:worktime,
			worktime2:worktime2
		}, function(err, data){
			if(!err){
				res.redirect('/recordShow');
			}else{
				console.log('err');
			}
		});
	})
})

// 农事信息修改接口
router1.post('/recordEdit', function(req, res, next){
	console.log('/users/recordEdit');
	var form = new formidable.IncomingForm();
	console.log("农事管理form:",form);
	form.parse(req, function(error, fields, files){
		console.log('recordEdit form:',fields);
		var _id = fields._id;
		var orchard = fields.orchard;
		var firstWork = fields.firstWork;
		var secondWork = fields.secondWork;
		var workdate = fields.workdate;
		var worktime = fields.worktime;
		var worktime2 = fields.worktime2;
		var setData = {
			orchard ,
			firstWork,
			secondWork,
			workdate,
			worktime,
			worktime2
		};
		
		console.log("_id:",_id,"model.ObjectID(_id):",model.ObjectID(_id));
		//_id: undefined model.ObjectID(_id): 6084e0c908a99809e8f56b24
		// 打印出来_id为空说明一直无法获取_id的值，导致每次查询的结果为空，但是又不会报错
		// 原因是在定义_id时，把它定义为了一个局部变量导致出错。
		model.update('work_msg', {"_id": model.ObjectID(_id)}, setData, function(error, data){
			console.log("_id",_id,"setData:",setData);
			if (!error) {
				res.redirect('/recordShow');
			} else{
				console.log('修改错误 error');
			}
		});
	});
	
})

// 历史数据可视化
// 在history1中的前端使用jsp的方式接收数据
router1.post('/history1', function(req, res, next){
	console.log('/users/history1');
	var form = new formidable.IncomingForm();
	var searchData;
	var json_searchData;
	var devName;
	var devId;
	var date,beginTime,endTime,ipAndDev;
	var tmp
	form.parse(req, function(error, fields, files){
		console.log('history fields:',fields);
		// 获取网页中选定的数据，进行查询
		date       = fields.searchTime;//searchTime: 例子：2021-04-05
		beginTime  = fields.beginTime;//
		endTime    = fields.endTime;
		ipAndDev   = fields.devId;
		console.log('beginTime:',beginTime,'endTime:',endTime,'typeof',typeof(beginTime),typeof(endTime));
		 // devId     = ipAndDev.split(' - ')[1]; //devId:' device1'
		tmp = "'"+beginTime+"'";
		console.log('tmp:',tmp,'typdeof',typeof(tmp));
		console.log('devId:',devId);
		// 把设备名里面的空格去掉
		//     _devId     = devId.replace(/^\s*|\s*$/g,"").toString();
		// 	// _devId     = JSON.stringify(_devId); 
		// console.log('_devId:',_devId,'typeof _devId:',typeof(_devId));
		
		// searchData = {
		// 	devId:_devId
		// }
		
		// curTime:{$lt:endTime,$gt:beginTime}
		console.log('searchData:',searchData);
	});
	// var devName = "'"+devId+"'";
	console.log('devName:',devName);
	// "currentTime":{$lt:"00:22",$gt:"00:17"}
	model.find('auto_msg', {"devId":'Light1',"currentTime":{$lt:"17:30",$gt:"17:05"}}, function(error, data){
		if (!error) {
			var len = data.length;
			console.log('数据长度为：',len);
			console.log('查询到数据：',data[len-1]);
			// 对查询到的数据进行分析
			var thumidity=0,ttemper=0,tlight=0;
			var max_humidity=data[0].humidity,max_temper=data[0].temperature,max_light=data[0].light;
			var min_humidity=data[0].humidity,min_temper=data[0].temperature,min_light=data[0].light;
			var i,avg_humidity=0,avg_temper=0,avg_light=0;
			// 临时的最大值
			// var tmp_max_humidity=data[0].humidity,tmx_t=data[0].temperature,tmx_l=data[0].light;
			// 临时的最小值
			// var tmm_h=data[0].humidity,tmm_t=data[0].temperature,tmm_l=data[0].light;
			for(i=0; i<len; i++){
				// 求和
				thumidity = data[i].humidity + thumidity; 
				tlight    = data[i].light    + tlight;
				ttemper   = data[i].temperature + ttemper;
				// 找最大值
				if (data[i].humidity>max_humidity) {
					max_humidity = data[i].humidity;
				}
				if (data[i].temperature>max_temper) {
					max_temper   = data[i].temperature;
				}
				if (data[i].light>max_light) {
					max_light = data[i].light;
				}
				// 找最小值
				if (data[i].humidity<min_humidity) {
					min_humidity = data[i].humidity;
				}
				if (data[i].temperature<min_temper) {
					min_temper = data[i].temperature;
				}
				if (data[i].light<min_light) {
					min_light = data[i].light;
				}
			}
			console.log('最小值,温度，湿度和光度',min_temper,min_humidity,min_light);
			console.log('最大值,温度，湿度和光度',max_temper,max_humidity,max_light);
			avg_humidity = thumidity/len;
			avg_temper   = ttemper/len;
			avg_light    = tlight/len;
			avg_humidity = avg_humidity.toFixed(2);
			avg_temper   = avg_temper.toFixed(2);
			avg_light   = avg_light.toFixed(2);
			max_humidity = max_humidity.toFixed(2);
			max_temper = max_temper.toFixed(2);  
			max_light = max_light.toFixed(2);   
			min_humidity = min_humidity.toFixed(2);
			min_temper = min_temper.toFixed(2);  
			min_light = min_light.toFixed(2);   
			
			console.log('avg_temper:',avg_temper,'avg_humidity:',avg_humidity,'avg_light:',avg_light);
			// 当数据查询成功后，尝试使用websocket将查询到的数据传至前台
			var strJson = {
				avg_humidity:avg_humidity,
				avg_temper  :avg_temper,
				avg_light   :avg_light,
				max_humidity:max_humidity,
				max_temper  :max_temper,
				max_light   :max_light,
				min_humidity:min_humidity,
				min_temper  :min_temper,
				min_light   :min_light
			}
			res.render('history1',strJson);
			// 以下使用websocket进行值的发送
			// webSkt.sendMessage(strJson);
		} else{
			console.log('查询历史数据出错：',error);
		}
	});
})

// 历史数据可视化 注意该方式已经被我废除，而代替使用ajax 见router1.get('/historyajax', function(req, res){
router1.post('/history', function(req, res, next){
	console.log('/users/history');
	var form = new formidable.IncomingForm();
	var searchData;
	var json_searchData;
	var devName;
	var devId;
	var date,beginTime,endTime,ipAndDev;
	var tmp;
	form.parse(req, function(error, fields, files){
		console.log('history fields:',fields);
		// 获取网页中选定的数据，进行查询
		date       = fields.searchTime;//searchTime: 例子：2021-04-05
		beginTime  = fields.beginTime;//
		endTime    = fields.endTime;
		devName    = fields.devId;
		console.log('beginTime:',beginTime,'endTime:',endTime,'typeof',typeof(beginTime),typeof(endTime),'devName:',devName);
		// devId     = ipAndDev.split(' - ')[1]; //devId:' device1'
		// tmp = "'"+beginTime+"'";
		// console.log('tmp:',tmp,'typdeof',typeof(tmp));
		// 设备名中有‘"’,因此使用split()函数将其去掉
		// 又因为后来使用render去渲染前端界面，所以设备名中已经没有引号了 所以下面可以注释了
		// if (devName != undefined) {
			// console.log('nihao !  undefined')
			// devId = devName.split('"')[1];
			// console.log('devId:',devId);
			// searchData = {"currentTime":{"$lt":endTime,"$gt":beginTime},"devId":devId};
			// json_searchData = JSON.stringify(searchData);
			// console.log('searchData1:',searchData,"typeof searchData:",typeof(searchData),"typeof json_searchData:",typeof(json_searchData),
			// "json_searchData:",json_searchData);
		// }
		searchData = {"currentTime":{"$lt":endTime,"$gt":beginTime},"devId":devName};
		json_searchData = JSON.stringify(searchData);
		console.log('searchData1:',searchData,"typeof searchData:",typeof(searchData),"typeof json_searchData:",typeof(json_searchData),"json_searchData:",json_searchData);
	});
	
	console.log('searchData2:',searchData);
	// var devName = "'"+devId+"'";
	// console.log('devName:',devName);
	// "currentTime":{$lt:"00:22",$gt:"00:17"}
	model.connect(function(db){
		// var res = db.auto_msg.find(searchData);
		// 以下这行注释可以得到想要的结果
		// db.collection("auto_msg").find({devId:"Light1",currentTime:{$lt:"17:30",$gt:"17:05"}}).toArray(function(err, data){
		db.collection("auto_msg").find(searchData).toArray(function(err, data){
			var len = data.length;
			if (err) {
				throw err;
			} else{
				console.log("searchData:",searchData,"db.collection('auto_msg').find(searchData),length:",data.length);
				if (len>0) {
					// 对查询到的数据进行分析
					var thumidity=0,ttemper=0,tlight=0;
					var max_humidity=data[0].humidity,max_temper=data[0].temperature,max_light=data[0].light;
					var min_humidity=data[0].humidity,min_temper=data[0].temperature,min_light=data[0].light;
					var i,avg_humidity=0,avg_temper=0,avg_light=0;
					var echartTime = ["12:00","15:00"];
					var echartTemperature = [];
					var echartHumidity = [];
					var echartLight = [];
					// 临时的最大值
					// var tmp_max_humidity=data[0].humidity,tmx_t=data[0].temperature,tmx_l=data[0].light;
					// 临时的最小值
					// var tmm_h=data[0].humidity,tmm_t=data[0].temperature,tmm_l=data[0].light;
					for(i=0; i<len; i++){
						// 求和
						thumidity = data[i].humidity + thumidity; 
						tlight    = data[i].light    + tlight;
						ttemper   = data[i].temperature + ttemper;
						// if(i == 3000){
						// 	console.log("i = 3000 ttemper: ",ttemper);
						// }
						// 找最大值
						if (data[i].humidity>max_humidity) {
							max_humidity = data[i].humidity;
						}
						if (data[i].temperature>max_temper) {
							max_temper   = data[i].temperature;
						}
						if (data[i].light>max_light) {
							max_light = data[i].light;
						}
						// 找最小值
						if (data[i].humidity<min_humidity) {
							min_humidity = data[i].humidity;
						}
						if (data[i].temperature<min_temper) {
							min_temper = data[i].temperature;
						}
						if (data[i].light<min_light) {
							min_light = data[i].light;
						}
					}
					console.log('最小值,温度，湿度和光度',min_temper,min_humidity,min_light);
					console.log('最大值,温度，湿度和光度',max_temper,max_humidity,max_light);
					avg_humidity = thumidity/len;
					avg_temper   = ttemper/len;
					avg_light    = tlight/len;
					avg_humidity = avg_humidity.toFixed(2);
					avg_temper   = avg_temper.toFixed(2);
					avg_light   = avg_light.toFixed(2);
					max_humidity = max_humidity.toFixed(2);
					max_temper = max_temper.toFixed(2);  
					max_light = max_light.toFixed(2);   
					min_humidity = min_humidity.toFixed(2);
					min_temper = min_temper.toFixed(2);  
					min_light = min_light.toFixed(2);   
					console.log('温度总和为：',ttemper,"数据长度为：",len);
					console.log('avg_temper:',avg_temper,'avg_humidity:',avg_humidity,'avg_light:',avg_light);
					// 当数据查询成功后，尝试使用websocket将查询到的数据传至前台
					var strJson = {
						avg_humidity:avg_humidity,
						avg_temper  :avg_temper,
						avg_light   :avg_light,
						max_humidity:max_humidity,
						max_temper  :max_temper,
						max_light   :max_light,
						min_humidity:min_humidity,
						min_temper  :min_temper,
						min_light   :min_light
					}
					// historyWebSkt.sendHistoryMessage({currentTime:"17:50"});
					// 当数据存在时，则使用render去渲染温湿度、光度的最高、最低和平均值
					// 同时使用sendMessage方法进行可视化表数据的发送
					// x轴：15:37:59  15:39:46  15:41:46 15:43:46 15:45:46
					//
					echartTime = ["15:37:59", "15:39:46", "15:41:46", "15:43:46", "15:45:46"];
					echartTemperature = [20, 21.2, 21.5, 20.9, 19.8];
					var flag = 3;//表示user/history路由中使用webskt进行发送数据，使用flag便于网页前端进行区分
					var dataVision = {flag:flag,echartTime:echartTime,echartTemperature:echartTemperature,
					};
					webSkt.sendMessage(dataVision,3);
					res.render('history',strJson);
					// 以下使用websocket进行值的发送
					// webSkt.sendMessage(strJson);
					
				} else{
					console.log("无历史数据");
					// 无数据时，三个可视化图表就不需要再去更新了
					var strJson = {
						avg_humidity:"无",
						avg_temper  :"无",
						avg_light   :"无",
						max_humidity:"无",
						max_temper  :"无",
						max_light   :"无",
						min_humidity:"无",
						min_temper  :"无",
						min_light   :"无",
						echartTime  :echartTime
					}
					// historyWebSkt.sendHistoryMessage({currentTime:"17:50"});
					// webSkt.sendMessage({currentTime:"17:50"});
					webSkt.sendMessage("ceshi",3);
					res.render("history",strJson);
				}
			}
			db.close();
		})
	})
	//以下为调用model中的find函数，当所选时间端数据不存在时，就会出现异常，查询auto_msg中的全部数据
	// 以下这行注释是可以用的
	// model.find('auto_msg', {"devId":'Light1',"currentTime":{$lt:"17:30",$gt:"17:15"}}, function(error, data){
	// model.find('auto_msg', {searchData,"currentTime":{$lt:"17:30",$gt:"17:05"}}, function(error, data){
	// model.find('auto_msg', searchData, function(error, data){
	// 	if (!error) {
	// 		var len = data.length;
	// 		console.log('数据长度为：',len);
	// 		console.log('查询到数据：',data[len-1]);
	// 		if (len>0) {
	// 			// 对查询到的数据进行分析
	// 			var thumidity=0,ttemper=0,tlight=0;
	// 			var max_humidity=data[0].humidity,max_temper=data[0].temperature,max_light=data[0].light;
	// 			var min_humidity=data[0].humidity,min_temper=data[0].temperature,min_light=data[0].light;
	// 			var i,avg_humidity=0,avg_temper=0,avg_light=0;
	// 			// 临时的最大值
	// 			// var tmp_max_humidity=data[0].humidity,tmx_t=data[0].temperature,tmx_l=data[0].light;
	// 			// 临时的最小值
	// 			// var tmm_h=data[0].humidity,tmm_t=data[0].temperature,tmm_l=data[0].light;
	// 			for(i=0; i<len; i++){
	// 				// 求和
	// 				thumidity = data[i].humidity + thumidity; 
	// 				tlight    = data[i].light    + tlight;
	// 				ttemper   = data[i].temperature + ttemper;
	// 				if(i == 3000){
	// 					console.log("i = 3000 ttemper: ",ttemper);
	// 				}
	// 				// 找最大值
	// 				if (data[i].humidity>max_humidity) {
	// 					max_humidity = data[i].humidity;
	// 				}
	// 				if (data[i].temperature>max_temper) {
	// 					max_temper   = data[i].temperature;
	// 				}
	// 				if (data[i].light>max_light) {
	// 					max_light = data[i].light;
	// 				}
	// 				// 找最小值
	// 				if (data[i].humidity<min_humidity) {
	// 					min_humidity = data[i].humidity;
	// 				}
	// 				if (data[i].temperature<min_temper) {
	// 					min_temper = data[i].temperature;
	// 				}
	// 				if (data[i].light<min_light) {
	// 					min_light = data[i].light;
	// 				}
	// 			}
	// 			console.log('最小值,温度，湿度和光度',min_temper,min_humidity,min_light);
	// 			console.log('最大值,温度，湿度和光度',max_temper,max_humidity,max_light);
	// 			avg_humidity = thumidity/len;
	// 			avg_temper   = ttemper/len;
	// 			avg_light    = tlight/len;
	// 			avg_humidity = avg_humidity.toFixed(2);
	// 			avg_temper   = avg_temper.toFixed(2);
	// 			avg_light   = avg_light.toFixed(2);
	// 			max_humidity = max_humidity.toFixed(2);
	// 			max_temper = max_temper.toFixed(2);  
	// 			max_light = max_light.toFixed(2);   
	// 			min_humidity = min_humidity.toFixed(2);
	// 			min_temper = min_temper.toFixed(2);  
	// 			min_light = min_light.toFixed(2);   
	// 			console.log('温度总和为：',ttemper,"数据长度为：",len);
	// 			console.log('avg_temper:',avg_temper,'avg_humidity:',avg_humidity,'avg_light:',avg_light);
	// 			// 当数据查询成功后，尝试使用websocket将查询到的数据传至前台
	// 			var strJson = {
	// 				avg_humidity:avg_humidity,
	// 				avg_temper  :avg_temper,
	// 				avg_light   :avg_light,
	// 				max_humidity:max_humidity,
	// 				max_temper  :max_temper,
	// 				max_light   :max_light,
	// 				min_humidity:min_humidity,
	// 				min_temper  :min_temper,
	// 				min_light   :min_light
	// 			}
	// 			res.render('history',strJson);
	// 			// 以下使用websocket进行值的发送
	// 			// webSkt.sendMessage(strJson);
	// 		} else{
	// 			console.log("无历史数据");
	// 		}
	// 	} else{
	// 		console.log('查询历史数据出错：',error);
	// 	}
	// });
})

// 尝试在前端使用ajax的方式加载数据
router1.get('/historyajax', function(req, res){
	console.log('/users/historyajax'); 
	// 路由举例如下，后面是前端ajax 传递的参数：
	// GET /users/historyajax?searchTime=2021-04-05&beginTime=11%3A09&endTime=11%3A40&sel=%22Light1%22 200 51.838 ms - -
	
	// res.writeHead(200, {
	//         'Content-Type': 'text/plain',
	//         'Access-Control-Allow-Origin': '*'
	// });
	// 以下是post而并非get请求的方法，
	// req.on('data', function(chunk){
	// 	console.log("got data chunk");
	// 	console.log(data);
	// })
	// console.log("后端historyajax收到：",req);
	// console.log("\n req.url:",req.url);
	var parseObj = urlbli.parse(req.url, true);
	// console.log("url.parse(req.url):",parseObj);
	var queryObj = parseObj.query;
	console.log("queryObj:",queryObj);
	var searchTime = queryObj.searchTime;
	// 2023年12月9日增加查询终止日期
	var endDate = queryObj.endDate;
	// console.log("23年12月9日增加endDate:",endDate);

	// 2023年12月10上午日对searchTime和endDate处理，
	// searchTime_test = new Date(searchTime);
	// 使用 split 方法将日期字符串分割,找到各自的年月日起始日期
	// const [startYear, startMonth, startDay] = searchTime.split("-").map(Number);
	// const [endYear, endMonth, endDay] = endDate.split("-").map(Number);
	// console.log(
	// 	"Start Date: Year:", startYear, "Month:", startMonth, "Day:", startDay,
	// 	"End Date: Year:", endYear, "Month:", endMonth, "Day:", endDay
	//   );

	// 2023年12月10日下午再次更新，将年月日全部转化为字典进行查询
	const { months, years, days } = findMonthsAndDays(searchTime, endDate);
	console.log("月份列表:", months);
	console.log("年份列表:", years);
	console.log("日期列表:", days);


	var beginTime = queryObj.beginTime;
	var endTime = queryObj.endTime;
	// 举例子，sel为"light1",所以我要把外边的双引号去掉，得到light1的结果
	// 因为在前端 20210507使用渲染的方式渲染下拉框，所以没有引号了，不需要以下这句
	// var sel  = queryObj.sel.split('"')[1] ;
	var sel = queryObj.sel;
	var searchItem;
	var json_searchItem;
	console.log("searchTime:",searchTime,"beginTime:",beginTime,"endTime:",endTime,"sel:",sel);
	// 存在设备记录时,设置查询json数据searchItem，其键与数据库对应，进行数据库查询
	if(sel != undefined){
		var have_result;//保存数据库查询结果
		var have_result_json;
		var no_result = {hints:"无设备信息"};//无结果时返回
		var no_result_json = JSON.stringify(no_result);
		// 2023年12月10下午日更改数据库查询语句searchItem
		// searchItem = {"date":{"$lt":endDate, "$gt":searchTime},"currentTime":{"$lt":endTime, "$gt":beginTime}, "devId":sel};
		// searchItem = {
		// 	$and: [
		// 	  { year: { $gte: startYear, $lte: endYear } },
		// 	  { month: { $gte: startMonth, $lte: endMonth } },
		// 	  { day: { $gte: startDay, $lte: endDay } },
		// 	  { currentTime: { $lt: endTime, $gt: beginTime } },
		// 	  { devId: sel }
		// 	]
		//   };
		// 2023年12月10日晚上改成成如下：
		searchItem = {
			$and: [
				{ year: { $in: years } },
				{ month: { $in: months } },
				{ day: { $in: days } },
				{ currentTime: { $lt: endTime, $gt: beginTime } },
				{ devId: sel }
			]
		};
		
		json_searchItem = JSON.stringify(searchItem);
		console.log("json_searchItem:",json_searchItem);
		// 开始查询数据库
		model.connect(function(db){
			db.collection("auto_msg").find(searchItem).toArray(function(err, data){
				var length = data.length;
				console.log("length:",length);
				if (err) {
					throw err;
				} else{
					if (length>0) {
						// 1.对查询到的数据进行分析，得到最大最小值、平均值等
						// 2.2022年9月26日新增电导率和tds
						// 注意data[0].ec中的ec是数据库中的表头的名字
						var thumidity=0,ttemper=0,tlight=0, tec=0, ttds=0;
						var max_humidity=data[0].humidity,max_temper=data[0].temperature,max_light=data[0].light;
						console.log("ec和TDS: ", data[0].ec, ": ", data[0].tds)
						var max_ec = data[0].ec, max_tds = data[0].tds;
						var min_humidity=data[0].humidity,min_temper=data[0].temperature,min_light=data[0].light;
						var min_ec = data[0].ec, min_tds = data[0].tds;
						var i,avg_humidity=0,avg_temper=0,avg_light=0;
						var avg_ec = 0.0, avg_tds = 0.0;
						for(i=0; i<length; i++){
							// 求和
							// console.log("typeof data[i].humidity:",typeof(data[i].humidity));
							// if( typeof(data[i].humidity )  != "NaN"
							// && typeof(data[i].temperature) != "NaN"
							// && typeof(data[i].light)       != "NaN" )
							if( data[i].humidity.toString() != "NaN"
								&& data[i].temperature.toString() != "NaN"
								&& data[i].light.toString() != "NaN"
							){
								// console.log("对数字进行相加");
								thumidity = data[i].humidity + thumidity;
								tlight    = data[i].light    + tlight;
								ttemper   = data[i].temperature + ttemper;
								// 2022年9月26日
								tec = data[i].ec + tec;
								ttds = data[i].tds + ttds;
							}
							if (data[i].humidity>max_humidity) {
								max_humidity = data[i].humidity;
							}
							if (data[i].temperature>max_temper) {
								max_temper   = data[i].temperature;
							}
							if (data[i].light>max_light) {
								max_light = data[i].light;
							}
							// 2022年9月26日
							if (data[i].ec > max_ec){
								max_ec = data[i].ec;
							}
							if (data[i].tds > max_tds){
								max_tds = data[i].tds;
							}
							// 找最小值
							if (data[i].humidity<min_humidity) {
								min_humidity = data[i].humidity;
							}
							if (data[i].temperature<min_temper) {
								min_temper = data[i].temperature;
							}
							if (data[i].light<min_light) {
								min_light = data[i].light;
							}
							// 2022年9月26日
							if (data[i].ec < min_ec) {
								min_ec = data[i].ec;
							}

							if (data[i].tds < min_tds) {
								min_tds = data[i].tds;
							}
						}
						avg_humidity = thumidity/length;
						avg_temper   = ttemper/length;
						avg_light    = tlight/length;
						// 2022年9月26日2
						avg_ec = tec/length;
						avg_tds = ttds/length;
						avg_humidity = avg_humidity.toFixed(2);
						avg_temper   = avg_temper.toFixed(2);
						avg_light   = avg_light.toFixed(2);
						// 2022年9月26日
						avg_ec = avg_ec.toFixed(2);
						avg_tds = avg_tds.toFixed(2);
						max_humidity = max_humidity.toFixed(2);
						max_temper = max_temper.toFixed(2);  
						max_light = max_light.toFixed(2);  
						// 2022年9月26日
						max_ec = max_ec.toFixed(2)
						max_tds = max_tds.toFixed(2) 
						min_humidity = min_humidity.toFixed(2);
						min_temper = min_temper.toFixed(2);  
						min_light = min_light.toFixed(2);   
						// 2022年9月26日
						min_ec = min_ec.toFixed(2)
						min_tds = min_tds.toFixed(2) 
						// console.log('温度总和为：',ttemper,"数据长度为：",length);
						console.log('avg_temper:',avg_temper,'avg_humidity:',avg_humidity,'avg_light:',avg_light);
						// 2. 尝试获取历史数据可视化echart表所需要的数据
						console.log("数据库查询结果data[0]：",data[0],"data[length-1]:",data[length-1],"数据长度为：",data.length);
						// 2.1 在所有的数据查询结果中，均匀取其中的五个值 举例 10个数时，取 0 2 4 6 8
						var historyEchart={
							time:['','','','',''],
							temperature:[],
							humidity:[],
							light:[],
							ec:[],
							tds:[]
						};
						var finalIndex = length;
						// 如果小于10个数据，那么直接取前五个数据
						if (finalIndex<10) {
							console.log("查询到的总数据小于10");
							var end;
							if(finalIndex<5){
								end = finalIndex;
							}else{
								end = 5;
							}
							for (var i=0; i<end; i++) {
								historyEchart.time[i] = data[i].currentTime;
								historyEchart.temperature[i] = data[i].temperature;
								historyEchart.humidity[i] = data[i].humidity;
								historyEchart.light[i] = data[i].light;
								// 2022年9月26日
								historyEchart.ec[i] = data[i].ec;
								historyEchart.tds[i] = data[i].tds;
							}
						} else{
							// 确定步长
							var distance = parseInt(length/5);
							console.log("步长distance:",distance);
							var j =0;
							for (var i=0; i<length;) {
								// 2023年12月18日
								console.log("可视化的日期：",data[i].date);
								contact_date = data[i].month + "-" + data[i].day + "-";
								// 尝试将以下这句更改,改成data[i].date
								// historyEchart.time[j] = data[i].currentTime;
								// historyEchart.time[j] = contact_date + data[i].currentTime;
								historyEchart.time[j] = data[i].date;
								historyEchart.temperature[j] = data[i].temperature;
								historyEchart.humidity[j] = data[i].humidity;
								historyEchart.light[j] = data[i].light;
								// 2022年9月26日
								historyEchart.ec[j] = data[i].ec;
								historyEchart.tds[j] = data[i].tds;
								j = j+1;
								i = distance+i;
								if(j > 4)
									break;
							}
						}
						// console.log("historyEchart",historyEchart);
						// 3. 最后进行结果的传送
						have_result = {
							avg_humidity:avg_humidity,
							avg_temper  :avg_temper,
							avg_light   :avg_light,
							avg_ec      :avg_ec,
							avg_tds     :avg_tds,
							max_humidity:max_humidity,
							max_temper  :max_temper,
							max_light   :max_light,
							max_ec      :max_ec,
							max_tds     :max_tds,
							min_humidity:min_humidity,
							min_temper  :min_temper,
							min_light   :min_light,
							min_ec      :min_ec,
							min_tds     :min_tds,
							historyEchart:historyEchart
						}
						have_result_json = JSON.stringify(have_result);
						res.end(have_result_json);
					}else{
						//如果查得的数据长度为0
						res.end(no_result_json);
					}
				}
			})
		})
	}else{
		// var no_result = {test:"无设备"};
		// var resjson = JSON.stringify(result);
		res.end(no_result_json);
	}
	// res.end("你好");
})

module.exports = router1;

