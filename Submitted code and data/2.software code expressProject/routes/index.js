var express = require('express');
var router = express.Router();
var model  = require('../model');
var tcp_server = require('../bin/server.js');
const webSkt = require('../bin/webSkt.js');//在get('history')中用到该模块
let url = require('url');//get('/formtest')
const { Console } = require('console');

/* GET home page. */
router.get('/', function(req, res, next) {
  model.connect(function(db){
    db.collection('users').find().toArray(function(err,docs){
      console.log('用户列表',docs);
      // res.render('login',{account:'',password:''});
    //   res.render('index', { title: '基于NodeMCU的脐橙生长环境测控系统的设计与实现  ',tcp_server:tcp_server });//响应客户端
      res.render('index', { title: 'Here it is a demo',tcp_server:tcp_server });//响应客户端
    });
  });
  
});

// 渲染注册页
router.get('/register',function(req,res,next){
  res.render('register',{account:'',password:'',repassword:''});
});

// 渲染登录页

router.get('/login',function(req,res,next){
  res.render('login',{account:'',password:''});
});

//渲染我自己写的表格例子
router.get('/header',function(req,res,next){
  res.render('header',{title:"这是一个测试"});
});
router.get('/test', function(req, res, next){
	res.render('test');
})
//渲染例子

router.get('/msgAdd',function(req,res,next){
  res.render('msgAdd');
})

router.get('/realtime', function(req,res,next){
	res.render('realtime');
})

router.get('/msgShow', function(req,res,next){
	model.find('manual_msg', {}, function(err, data){
		// 在这里查询成功，从数据库中获取了数据，所以先把以下语句注销
		// console.log('data是: ',data);
		// data是一个数组，如下所示。
		// [
		//   {
		//     _id: 604247c7091e2e16a8041608,
		//     temperature: '22',
		//     humidity: '81',
		//     light: '152',
		//     testdate: '2021-03-05',
		//     testtime: '14:00',
		//     description: '赣南果园'
		//   },
		//   {
		//     _id: 6069f38b28f18d30c49227eb,
		//     temperature: '22',
		//     humidity: '80',
		//     light: '124',
		//     testdate: '2021-03-05',
		//     testtime: '14:00',
		//     description: 'dd'
		//   }
		// ]
		console.log("msgshow: data:", data)
		res.render('msgShow', {
			arrays:data
		});
	})
	// res.render('msgShow');
})

//修改数据对应路由，代码执行逻辑从点击页面开始
// 点击更改按钮，执行/msgEdit?id=<%=array[j]._id路由
// 					并传值id,然后在router/index中执行查询，得到editArr
// 					传给msgEdit界面，界面即可获取原来数据库中的值
					
// 					msgEdit中激发/users/msgAdd路由进行修改

//网页修改按钮对应的路由响应为<a href="/msgEdit?id=<%=arrays[j]._id%>" class="btn btn-success">修改</a>
router.get('/msgEdit', function(req, res){
	var id = req.query.id;
	console.log('想要修改的数据的id为：',id);
	model.find('manual_msg', {"_id": new model.ObjectID(id)},function(err, data){
		console.log('点击修改按钮时获得的数据data,',data);//data是一个数组
		console.log('msgEdit的data[0]:', data[0]);//data[0]是数组中的第一个元素，为一个键值对，所以传值应传data[0]
		//以下语句是将原来的数据也送到修改界面
		res.render('msgEdit', {
			//editArr是msgEdit对应网页上的一个数组
			editArr:data[0]
		});
	});
})

// 修改农事记录
// 注意在写路由时一定要加上斜杠/ / / / / 
router.get('/recordEdit', function(req, res){
	var id = req.query.id;
	console.log('想要修改的农事记录的id为：',id);
	model.find('work_msg', {"_id": new model.ObjectID(id)}, function(err, data){
		console.log('农事记录data:', data);
		res.render('recordEdit', {
			editArr:data[0],
		});
	});
})
//删除
// 直接点击链接的 对应写在index路由里
// 由表单提交的 写在users路由里
router.get('/msgDel', function(req, res){
	var id = req.query.id;
	model.delOne('manual_msg', {"_id": new model.ObjectID(id)}, function(err){
		if(!err){
			res.redirect('/msgShow');
		}else{
			console.log(err);
		}
	})
})
router.get('/recordAdd', function(req, res, next) {
  res.render('recordAdd');
})

// 农事操作记录显示
router.get('/recordShow', function(req, res, next){
	model.find('work_msg', {}, function(err, data){
		console.log("data.length:",data.length);
		console.log("data:",data);
		res.render('recordShow', {
			arrays:data,
		});
	})
	
})

// 2023年12月11日系统拓展界面
router.get('/expansion', function(req, res, next) {
	res.render('expansion');
  })

router.get('/recordDel', function(req, res){
	var id = req.query.id;
	model.delOne('work_msg', {"_id": new model.ObjectID(id)}, function(err){
		if (!err) {
			res.redirect('/recordShow');
		} else{
			console.log(err);
		}
	})
})


// 尝试在前端使用ajax的方式加载数据
router.get('/history1', function(req, res, next){
	//访问http://localhost:3000/history时，先将前面9个为空的值传递过去，
	// 然后再进行数据库查询
	var deviceArr=new Array(100);
	model.find('auto_msg', {}, function(error, data){
		
		if(!error){
			
			if(!data){
				// 数据为空时
				console.log('data:',data);
			}else{
				console.log('datalength:',data.length);
				console.log('data[0]:',data[0]);
				// 假设最大设备数为100
				var finalValueIndex=0;//finalValueIndex用来记录最后一个设备值的下标
				deviceArr[0] = data[0].devId;
				for (var i=1; i<data.length; i++) {
					for(var j=0; j<deviceArr.length; j++){
						if (data[i].devId != deviceArr[j] && j==finalValueIndex) {
							finalValueIndex++;
							deviceArr[finalValueIndex] = data[i].devId;
						} else{
							continue;
						}
					}
				}
				console.log('deviceArr:',deviceArr);
			}
		}else{
			console.log('error',error);
		}
	})
	var result_json = JSON.stringify({deviceArr:deviceArr});
	// res.end(result_json);
	//使用render将数据渲染到界面中，然后在界面使用类似于jsp的方法进行数据传送
	res.render('history1', {'avg_temper':'','max_temper':'','min_temper':'',
		'avg_humidity':'','max_humidity':'','min_humidity':'',
		'avg_light':'','max_light':'','min_light':'','deviceArr':deviceArr
	});
	
})

// 在history中的前端使用jsp的方式接收数据,同时尝试 所以尝试也用渲染的方式去更新deviceArr
router.get('/history', function(req, res, next){
	//访问http://localhost:3000/history时，先将前面9个为空的值传递过去，
	// 然后再进行数据库查询
	console.log("\n进入到/history路由\n");
	model.find('auto_msg', {}, function(error, data){
		// 获取列表名
		var deviceArr=new Array(100);
		if(!error){
			if(data.length == 0){
				// 数据为空时
				// console.log('data:',data);
			}else{
				// console.log('datalength:',data.length);
				// console.log('data[0]:',data[0]);
				// 假设最大设备数为100
				console.log('data.length:',data.length);
				var finalValueIndex=0;//finalValueIndex用来记录最后一个设备值的下标
				deviceArr[0] = data[0].devId;
				for (var i=1; i<data.length; i++) {
					for(var j=0; j<deviceArr.length; j++){
						if (j<=finalValueIndex) {
							if (data[i].devId == deviceArr[j]) {
								break;
							}else{
								if (j == finalValueIndex) {
									console.log("devID:",data[i].devId,"i:",i);
									finalValueIndex++;
									deviceArr[finalValueIndex] = data[i].devId;
								}
							}
						} else{
							break;
						}
						if (data[i].devId != deviceArr[j] && j==finalValueIndex) {
							
						} 
					}
				}
				console.log('deviceArr:',deviceArr);
				//尝试使用webSkt将设备信息发送到前端
				// 20210507 又因为在云服务器上更新设备下拉列表框时会出现一些问题
				// 所以尝试也用渲染的方式去更新deviceArr
				// var senddeviceArr = deviceArr.toString('ascii');
				// console.log('senddeviceArr:',senddeviceArr);
				// webSkt.sendMessage(deviceArr, 1);
			}
		}else{
			console.log('error',error);
		}
		// 因为在以get方式访问路由时，在云服务器上更新设备下拉列表框时会出现一些问题
		// 所以尝试也用渲染的方式去更新deviceArr
		// 在history中设置<p class="title" style="visibility: hidden;" id="deviceArr"  ></p>并将其隐藏
		// 尝试将deviceArr传到该段落中，在前端使用document.getElementById('deviceArr').innerHTM的值
		// webSkt.sendMessage(deviceArr, 1);
		console.log("deviceArr[0]:",deviceArr[0]);
		res.render('history', {'avg_temper':'','max_temper':'','min_temper':'',
			'avg_humidity':'','max_humidity':'','min_humidity':'',
			'avg_light':'','max_light':'','min_light':'',
			'avg_ec':'', 'max_ec':'', 'min_ec':'',
			'avg_tds':'','max_tds':'', 'min_tds':'',
			'echartTime':'','deviceArr':deviceArr
		});
	})
	
	//使用render将数据渲染到界面中，然后在界面使用类似于jsp的方法进行数据传送
	// res.render('history', {'avg_temper':'','max_temper':'','min_temper':'',
	// 	'avg_humidity':'1','max_humidity':'','min_humidity':'',
	// 	'avg_light':'','max_light':'','min_light':''
	// });
	// res.send({'avg_temper':'','max_temper':'','min_temper':'',
	// 	'avg_humidity':'1','max_humidity':'','min_humidity':'',
	// 	'avg_light':'','max_light':'','min_light':''
	// });
	
	
})

// router.get('/history', function(req, res, next){
// 	//访问http://localhost:3000/history时，先将前面9个为空的值传递过去，
// 	// 然后再进行数据库查询
// 	console.log("\n进入到/history路由\n");
// 	model.find('auto_msg', {}, function(error, data){
// 		if(!error){
// 			if(data.length == 0){
// 				// 数据为空时
// 				// console.log('data:',data);
// 			}else{
// 				// console.log('datalength:',data.length);
// 				// console.log('data[0]:',data[0]);
// 				// 假设最大设备数为100
// 				console.log('data.length:',data.length);
// 				var deviceArr=new Array(100);
// 				var finalValueIndex=0;//finalValueIndex用来记录最后一个设备值的下标
// 				deviceArr[0] = data[0].devId;
// 				for (var i=1; i<data.length; i++) {
// 					for(var j=0; j<deviceArr.length; j++){
// 						if (j<=finalValueIndex) {
// 							if (data[i].devId == deviceArr[j]) {
// 								break;
// 							}else{
// 								if (j == finalValueIndex) {
// 									console.log("devID:",data[i].devId,"i:",i);
// 									finalValueIndex++;
// 									deviceArr[finalValueIndex] = data[i].devId;
// 								}
// 							}
// 						} else{
// 							break;
// 						}
// 						if (data[i].devId != deviceArr[j] && j==finalValueIndex) {
							
// 						} 
// 					}
// 				}
// 				console.log('deviceArr:',deviceArr);
// 				//尝试使用webSkt将设备信息发送到前端
// 				// var senddeviceArr = deviceArr.toString('ascii');
// 				// console.log('senddeviceArr:',senddeviceArr);
// 				webSkt.sendMessage(deviceArr, 1);
// 			}
// 		}else{
// 			console.log('error',error);
// 		}
		
// 	})
	
// 	//使用render将数据渲染到界面中，然后在界面使用类似于jsp的方法进行数据传送
// 	// res.render('history', {'avg_temper':'','max_temper':'','min_temper':'',
// 	// 	'avg_humidity':'1','max_humidity':'','min_humidity':'',
// 	// 	'avg_light':'','max_light':'','min_light':''
// 	// });
// 	// res.send({'avg_temper':'','max_temper':'','min_temper':'',
// 	// 	'avg_humidity':'1','max_humidity':'','min_humidity':'',
// 	// 	'avg_light':'','max_light':'','min_light':''
// 	// });
	
// 	res.render('history', {'avg_temper':'','max_temper':'','min_temper':'',
// 		'avg_humidity':'','max_humidity':'','min_humidity':'',
// 		'avg_light':'','max_light':'','min_light':'',
// 		'echartTime':'',
// 	});
	
// })


router.get('/table',function(req,res,next){
  res.render('table');
})
router.get('/deviceArr',function(req,res,next){
  let target = [];
  //个人猜测这个device应该是个局部变量，就是像一个循环变量一样，
  tcp_server.deviceArr.forEach((device)=>{
    target.push({
      maddr: device.maddr,
      devId: device.devId
    })
    console.log('router ceshi'+device.maddr+' '+device.devId+'res: '+res);
  })
  res.json(target);
})
//用来测试界面和脚本文件
router.get('/test', function(req,res,next){
	res.render('test');
})
// 打开网页的初始化渲染
router.get('/ajaxtest', function(req, res, next){
	res.render('ajax');
})

// POST / 控制设备开关灯
router.post('/',function(req, res, next) {
  let maddr = req.body.maddr;
  let devId = req.body.devId;
  let action = req.body.action
  if(action === 'open' || action === 'close'){
    tcp_server.sentCmd(maddr,devId,action);
  }
  res.json(req.body);
})

// router.get('/ajaxtest1', function(req, res, next){
// 	// console.log("/users/ajaxtest","username:",username,"password:",password);
// 	console.log("index/ajaxtext");
// 	console.log("req.url:"+req.url);
// 	// 读取文件并返回
// 	// let path = '/javascripts/data.json';
// 	let path = PATH.resolve(__dirname,'../public/json/data.json');
// 	console.log("path:",path);
// 	console.log("拓展名：",PATH.extname(path));
// 	try{
// 		let jsondata = iconv.decode(fs.readFileSync(path, "binary"),"utf8");
// 		let data = JSON.parse(jsondata);
// 	}catch(e){
// 		//TODO handle the exception
// 		console.log(e);
// 	}
// 	// console.log(req);
// 	res.setHeader('Content-Type', MINE_TYPES[PATH.extname(path).slice(1)]+'; charset=utf-8');
// 	console.log("data:",data);
// 	res.end(data);
// 	return ;
// })
router.get('/form', function(req, res, next){
	res.render('form',{account:'',password:''});
})
router.get('/formtest', function(req, res, next){
	console.log("/index/formtest");
	console.log(req.url);
	// 使用url解析地址
	console.log(url.parse(req.url, true));
	let urlObj = url.parse(req.url, true);
	if (path.pathname === '/formtest') {
		
	}
})
router.get('/loginOut',function(req, res, next){
	console.log("loginOut");
	console.log("req.session:",req.session);
	req.session.destroy(function(err){
		if (err) {
			console.log(err);
		} else{
			console.log("尝试销毁后req.session的值:",req.session);
			res.redirect('/login');
		}
	})
})

module.exports = router;
