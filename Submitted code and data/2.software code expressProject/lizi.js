// 功能： 创建TCP服务器
const net = require('net');
const curTime = require('moment');
const PORT = 4001;//对于客户端于访问服务器所使用的端口是在服务器的代码里面进行设置的，
//而服务器本身要运行所使用的端口是在项目的入口文件里面进行设置的

const TIMELIMITED = 20000000;
const deviceArr = [];
//新增websocket,加油~
// const wbSoc = require('./wbsoc.js');
const webSkt = require('./webSkt.js');
// 数据库增删改查文件
const model  = require('../model/index.js');

//创建服务器
const tcp_server = net.createServer((socket)=>{


    let maddr = socket.address().address+':' + socket.remotePort;
	console.log(maddr," connected to server.");
	
	//上面的功能是连接服务器以下进行数据的接收 on()函数相当于是一个监听函数，监听各种各样的事件，
	socket.on("data",data=>{
		// console.log("initial data: ",data.data);
		let clientMsg = maddr+" 发送了: "+data.toString('ascii');
		socket.lastValue = data.toString('ascii');
		console.log('server.js中的TCP服务器收到来自',clientMsg);
		console.log("socket.lastValue: "+socket.lastValue);
		if(!socket.devId){
			socket.devId = data.toString('ascii');
			socket.maddr = maddr;
			deviceMsg = "device:"+socket.devId+":"+socket.maddr;
			console.log(deviceMsg);
			webSkt.sendMessage(deviceMsg);
			addDevices(socket);
		}else{
			var dataArr = socket.lastValue.split(":");
			// dataArr.forEach(function(i){
			// 	console.log(i);
			// })
			// webSkt.sendMessage(dataArr);
			console.log("dataArr[0]:",dataArr[0],'typeof',typeof(dataArr[0]));
			if(dataArr[0]==="NaN"||dataArr[0]==="NAN"||dataArr[1]==="NaN"||dataArr[1]==="NAN"||
			dataArr[0]==="nan"||dataArr[0]==="nAn"||dataArr[1]==="nan"||dataArr[1]==="nan"||
			dataArr[0]==="Nan"||dataArr[0]==="naN"||dataArr[1]==="Nan"||dataArr[1]==="nAN"||
			dataArr[0]==="naN"||dataArr[0]==="naN"||dataArr[1]==="Nan"||dataArr[1]==="nAN"


			){
// 当传感器未正确发送数据时，则不执行操作不发送到客户端

			}else{
				console.log("devId: ",socket.devId);
				webSkt.sendMessage(socket.lastValue);
				//并将数据存储到数据库中
				var devId = socket.devId;
				
				dateandtime = curTime().format("YYYY-MM-DD HH:mm:ss");
				console.log("dateandtime",dateandtime);//dateandtime 2021-04-03 15:16:09
				//nyrAndSfm:年月日和时分秒 
				// 使用空格将dateandtime分割为两部分
				nyrAndSfm = dateandtime.split(' ');
				console.log("nyrAndSfm:",nyrAndSfm);//[ '2021-04-03', '15:16:09' ]
				console.log("nyrAndSfm[0]:",nyrAndSfm[0]);//nyrAndSfm[0]: 2021-04-03
				var year = nyrAndSfm[0].toString().substring(0,4);//获取0到4-1之间的内容
				var month = nyrAndSfm[0].toString().substring(5,7);
				var day = nyrAndSfm[0].toString().substring(8,10);
				var season;
				if (month>0&&month<4) {
					season=1;
				} else if(month>3&&month<7) {
					season=2;
				}else if(month>6&&month<10){
					season=3;
				}else{
					season=4;
				}
				var currentTime = nyrAndSfm[1];
				var dataArr0 = parseFloat(dataArr[0]);
				var dataArr1 = parseFloat(dataArr[1]);
				var dataArr2 = parseInt(dataArr[2]);
				// var dataArr1 = dataArr[1].parseFloat();
				// var dataArr2 = dataArr[2].parseInt();
				console.log("year:",year,"season:",season,"month:",month,"day:",day,"currentTime:",currentTime);
				model.insert('auto_msg',{
					devId:devId,
					date:nyrAndSfm[0],
					year:year,
					season:season,
					month:month,
					day:day,
					currentTime:currentTime,
					temperature:dataArr0,
					humidity:dataArr1,
					light:dataArr2
				},function(err, data) {
					if(!err){
						console.log("插入成功");
					}else{
						console.log("插入失败");
					}
				})
			}
		}
		// setInterval(function(){console.log("setInterval ceshi");},1000);
	})

	socket.on("error",()=>{
		console.log(maddr,socket.devId,"warning, error!");
		delDevice(socket.maddr,socket.devId);
	})

	socket.on("close",()=>{
		console.log(maddr,socket.devId,"has been closed\n+ the number of devices: ",deviceArr.length);
		delDevice(socket.maddr,socket.devId);
	})

	socket.setTimeout(TIMELIMITED);

	socket.on('timeout', () => {
		console.log(socket.maddr,socket.devId,'timeout');
		delDevice(socket.maddr,socket.devId);
		socket.end();
	});
})

function addDevices(socket){
	//首先要确保把旧的同名设备删除，然后再进行新设备的添加，
	delDevice(socket.maddr,socket.devId);
	deviceArr.push(socket);
	console.log("addDevices函数：",socket.maddr+' '+socket.devId);
	// console.log("device: ",deviceArr);
}

function findDevice(maddr,devId){
	let target = [];
	let j = 0;
	// console.log("findDevice: ",deviceArr);
	for(j=0;j<deviceArr.length;j++){
		if(maddr === deviceArr[j].maddr && devId === deviceArr[j].devId){
			target.push(deviceArr[j]);
		}
	}

	return target;
}

// 给设备发送控制命令
function sentCmd(maddr,devId,cmd) {

	let devices = findDevice(maddr,devId);
	console.log("device: ",devices);
	if(devices.length ===0){
		console.log("暂无此Id的设备");
		return;
	}
	if(cmd === "close"){
		devices.forEach((socket)=>{
			socket.write("0",'ascii');
		})
	}else{
		devices.forEach((socket)=>{
			socket.write("1",'ascii');
		})
	}

}

function delDevice(maddr,devId){
	console.log("delDevice函数");
	if(!devId || !maddr){
		return;
	}
	let index = null;
	let j = 0;

	for(j=0;j<deviceArr.length;j++){
		if(deviceArr[j].maddr === maddr && deviceArr[j].devId === devId){
			index = j;
		}
	}
	if(index!=null){
		console.log("找到了想要删除的设备");
		//注意 splice方法和slice都是用来删除数组中的元素，但是是有不一样的
		// deviceArr.slice(index,1);
		deviceArr.splice(index,1);
		
	}
}





tcp_server.on("error",(err)=>{
	console.log("warning, error!");
	delDevice(socket.maddr,socket.devId);
})



tcp_server.listen({port:PORT,host:'0.0.0.0'},()=>{
  console.log('tcp_server is running on', tcp_server.address());

})



module.exports={
	deviceArr: deviceArr,
	sentCmd:sentCmd,
	addDevices: addDevices,
	delDevice: delDevice,
	findDevice: findDevice
}
  