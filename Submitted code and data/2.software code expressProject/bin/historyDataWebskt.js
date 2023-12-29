// 该模块主要用于更新历史化数据图表
const webskt = require('ws');
const historyTime = require('moment');
const websktArr = [];

function initialize(server){
	const websktServer = new webskt.Server({server});
	console.log("historyDataWebskt created");
	websktServer.on('connection',(ws,req)=>{
		ws.ip = req.connection.remoteAddress;
		console.log("historyDataWebskt,ws.ip: ",ws.ip);
		addWebskt(ws);
		
		ws.on('message', (message)=>{
			console.log("historyDataWebskt收到来自历史数据可视化页面的回复:%s",message);
		})
		
		ws.on('close', ()=>{
			console.log("historyDataWebskt.js is closed");
		})
		
		ws.on('error', (error)=>{
			console.log("historyDataWebskt.js error");
			delWebSocket(ws);
		})
	})
	
}
function addWebskt(webskt){
	websktArr.push({webskt:webskt});
}
function delWebSocket(webskt){
	var webSktInd;
	websktArr.forEach((i, ind)=>{
		if(i.webskt === webskt){
			webSktInd = ind;
		}
		if(webSktInd){
			websktArr.splice(webSktInd, 1);
			console.log("historyDataVision delWebSocket:",webskt.ip);
		}
	})
}

function sendHistoryMessage(msg){
	let message;
	console.log("进入到历史数据发送函数,msg:",msg,"websktArr:",websktArr);
	websktArr.forEach((i)=>{
		if(i.webskt.readyState === webskt.OPEN){
			console.log("historyDataWebskt开始发送数据");
			i.webskt.send(msg);
		}else{
			console.log("historyDataWebskt暂未开始发送数据");
			delWebSocket(i.webskt);
		}
	})
}

module.exports = {
	initialize: initialize,
	sendHistoryMessage: sendHistoryMessage
}