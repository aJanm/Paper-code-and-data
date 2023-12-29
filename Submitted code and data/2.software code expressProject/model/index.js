var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017";
var dbName = "water_5index_20220923";
var ObjectID = require('mongodb').ObjectID;//用于获取ObjectId类 //使用该变量用于删除集合中元素
//Collection 相当于关系数据库中的表，若集合不存在时，则会在第一次创建时
// 自动生成，若存在则追加。

// 数据库连接方法
function connect(callback){
    // console.log("开始连接数据库")
    MongoClient.connect(url,{},function(err,client){
        if(err){
            console.log('数据库连接错误',err);
        }else{
            // 创建一个数据库连接成功的对象
            
            var db = client.db(dbName);
            callback&&callback(db);
            //client.close();
            console.log("创建数据库成功");
        }
    });
}

// 增
function insert(clctionName, json, callback){
	connect(function(db){
		var res = db.collection(clctionName).insertOne(json, function(error, data){
			callback(error, data);
		});
		
	})
}

//删 

function delOne(clctionName, json, callback){
	connect(function(db){
		// 找到对应集合的对应元素
		db.collection(clctionName).deleteOne(json, function(error, data){
			callback(error, data);
		})
	})
}

// 改
// 讲解：https://blog.csdn.net/qq_23870025/article/details/66489253
function update(clctionName, json1, json2, callback){
	console.log('进入修改函数,json1:',json1,"json2:",json2);
	connect(function(db){
		// console.log('连接成功.......')
		// db.collection(clctionName).update(json1, {$set:json2},
		db.collection(clctionName).updateOne(json1, {"$set":json2}, 
		function(error, data){
			callback(error, data);
			// console.log("model中error为",error,"data为",data);
		})
		// db.clctionName.updateOne(json1, {$set:json2}, function(error, data){
		// 	callback(error, data);
		// })
	})
}
//查
// MongoDB 查询数据的语法格式如下：
// db.collection.find(query, projection) query ：可选，使用查询操作符指定查询条件
// projection ：可选，使用投影操作符指定返回的键。查询时返回文档中所有键值， 只需省略该参数即可（默认省略）。
function find(clctionName, json, callback){
	connect(function(db){
		var res = db.collection(clctionName).find(json);
		//var res = db.clctionName.find(json);
		res.toArray(function(error, data){
			
			// 拿到数据后执行回调函数
			callback(error, data);
			// console.log('model中find函数找到的data值为：',data);
			db.close();
		})
	})
}
// 查询例子：
// db.collection(clctionName).find({devId:device1,curTime:{$lt:endTime,$gt:startTime}})
// 解释：查询集合中devId字段为device1，并且curTime在startTime~endTime之间的数据
// model.find('work_msg', {}, function(err, data){
	// 	console.log("data:",data);
	// 	res.render('recordShow', {
	// 		arrays:data,
	// 	});
	// })


module.exports ={
    connect,
	insert,
	delOne,
	update,
	find,
	ObjectID
}