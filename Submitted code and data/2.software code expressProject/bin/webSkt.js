// 功能：此模块实现服务器端的WebSocket，然后在server.js中载入该模块
// 注意在使用之前要在www文件中声明并条用initialize函数进行初始化
const webSkt = require('ws');
const curTime = require('moment');
const webSktArr = [];



function initialize(server){
    console.log("init");
    const webSktServer = new webSkt.Server({server}); 
    //参数server是一个键值对，所以在外面要使用大括号，
    // 举例：const wbsktS = new webSkt.Server({host:127.0.0.1,port:4000});
    console.log("webSktServer created");
    webSktServer.on('connection',(ws,req)=>{
        
        ws.ip = req.connection.remoteAddress;
        console.log("webSkt.js has been connected ip:",ws.ip);

        addWebSkt(ws);
        ws.on('message',(message)=>{
            
            console.log("webSkt.js 收到来自浏览器的回复: %s",message);


            // try {
            //     let data = JSON.parse(message);
                

            // } catch (error) {
            //     console.log("initialize error");
            // }
        })

        ws.on("close",()=>{
            console.log("webSkt.js closed.");
            delWebSocket(ws);
        })

        ws.on("error",(err)=>{
            console.log("webSkt.js error",err);
            delWebSocket(ws);
        })

        // let timingSent = setInterval(()=>{
        //     if(ws.readyState === webSkt.OPEN){
        //         let data = [
        //             {
        //                 time: curTime().format("mm:ss"),
        //                 value: 12+Math.random().toFixed(2)*10
        //             }
        //         ]

        //         let transformData = JSON.stringify(data);
        //         ws.send(transformData);
        //     }else{
        //         console.log("something error happened");
        //         clearInterval(timingSent);
        //     }
        // },1000);
    });
}

// 设置此端口，并设置让其他模块使用
function addWebSkt(webSkt){
    webSktArr.push({webSkt:webSkt});
    // console.log("addWebSkt:",webSktArr);
}

function delWebSocket(webSkt){
    var webSktInd;
    //变量i用于循环遍历webSktArr, webSkt是他的一个成员属性
    webSktArr.forEach((i,ind)=>{
        if(i.webSkt === webSkt){
            webSktInd = ind;
        }

        if(webSktInd){
            webSktArr.splice(webSktInd,1);
            console.log("delWebSkt",webSkt.ip);
        }


    })
}
//尝试在sendMessage中增加一个类型字段，以区分不同路由对应发送的数据
// function sendMessage(msg, type)
// type = 1: 发送来自硬件的数据，具体在server.js文件中调用
// type = 2: 发送使用get请求时对应的数据，具体在index/history路由中调用
// type = 3: 发送使用post请求时对应的数据，具体在users/history路由中调用
function sendMessage(msg, type){
    console.log('进入bin/webSkt/sendMessage()函数');
    // console.log("webSktArr: ",webSktArr);
	if (type == 1) {
		console.log("type: ",type);
		let message;
		//msg 形式 [ '', 'Temperature', '','28.20', 'Humidity', '72.00']
		// console.log("sendMessage: ",msg[]);
		// console.log('转化之前的msg:',msg);
		try {
		    message = JSON.stringify([{time:curTime().format('HH:mm:ss'),msg:msg}]);
		    // message = JSON.parse('{"time":curTime().format("HH:mm:ss"),"msg":msg}');
		    // message = JSON.parse('{"time":"123","msg":"[1,2,3]"}');
			// message = {time:curTime().format('HH:mm:ss'),msg:msg};
		    // console.log('转化后的message',message);
		} catch (err) {
		    console.log("error happend when Json.stringify");
		}
		// console.log("msg: %s",msg);
		// console.log("receive: ",message);
		// console.log("foreach: ",webSktArr);
		webSktArr.forEach((i)=>{
		    // console.log("foreach: ",webSktArr);
		    if (i.webSkt.readyState === webSkt.OPEN) {
		        console.log("webSkt is sending");
		        i.webSkt.send(message);
		    } else {
		        console.log("webSkt isn't sending");
		        delWebSocket(i.webSkt);
		        return;
		    }
		})
	}else if(type == 2){
		console.log("type: ",type,"发送使用get请求时对应的数据");
	}else if(type == 3){
		let message;
		try{
			message = JSON.stringify(msg);
		}catch(e){
			//TODO handle the exception
			console.log("type=3时转化失败");
		}
		console.log("type: ",type,"发送使用post请求时对应的数据");
		console.log("msg:",message);
		webSktArr.forEach((i)=>{
		    // console.log("foreach: ",webSktArr);
		    if (i.webSkt.readyState === webSkt.OPEN) {
		        console.log("webSkt is sending");
		        i.webSkt.send(message);
		    } else {
		        console.log("webSkt isn't sending");
		        delWebSocket(i.webSkt);
		        return;
		    }
		})
	}else{
		console.log("输入type参数错误");
	}
    
    console.log('退出bin/webSkt.js的sendMessage()函数');
}

//这是我们自己写的一个模块，为了让这个模块给其他文件使用，则需要用export 把需要导出的功能写在里面，如下所示:
module.exports = {
    initialize: initialize,
    sendMessage : sendMessage
}
