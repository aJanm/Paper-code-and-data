//以下于创建websocket的连接
const host = window.location.host;
// 得到的host主机带端口，举例：http://localhost:3000/realtime，则host:localhost:3000
// window.location方法详解
// https://blog.csdn.net/weixin_38091374/article/details/79195864
console.log('host:',host);
// https://www.cnblogs.com/llljpf/p/10830651.html
//WebSocket是html5提供的一种在单个TCP连接上进行双向通信的协议，
// 解决了客户端和服务端之间的实时通信问题。浏览器和服务器只需完成一次握手，
// 两者之间就可以创建一个持久性的TCP连接，此后服务器和客户端通过此TCP连接进行双向实时通信。
const skt  = new WebSocket('ws://'+host);
// const model = require('../../model/index.js');
// const model = require('../../dist/model.js'); //require

var mChart;
var option;

var humidChart;
var humidOption;

var lightChart;
var lightOption;

// 2022年10月18日
var ecChart;
var ecOption;

var tdsChart;
var tdsOption;

// 以下是获取连接到服务器的设备的相关功能
//获取界面中选中的设备的信息
function getDeviceMsg(){
  console.log("getDeviceMsg函数");
  var deviceMsg = $('select').val();
  if(!deviceMsg){
    console.log("暂无设备连接");
    return ;
  }
  var maddr = deviceMsg.split(' - ')[0];
  var devId = deviceMsg.split(' - ')[1];
  console.log(maddr,devId);
  return{
    maddr: maddr,
    devId: devId
  }

}

// $('.navBar nav a').click(function () {
//   $(this).addClass('currentPage').siblings().removeClass('currentPage');
// })

$(document).ready(function(){
	// 尝试更新下拉列表框
	var deviceArrUnit = document.getElementById("deviceArr").innerHTML;
	console.log("deviceArrUnit:",deviceArrUnit);
	// deviceArrUnit: Light1,nihao,nan,nihaoya,zhengwenyue,wuyueqihao,,,,,,,,,,,,,,,,,,,,
	var deviceArr = deviceArrUnit.split(',');
	console.log('deviceArr.length:',deviceArr.length,'deviceArr',deviceArr);
	for(var i=0; i<deviceArr.length; i++){
		if (deviceArr[i] != ',' && deviceArr[i] != '') {
			console.log('进入if (deviceArr[i] != ',') {')
			$('#sel').append('<option>'+deviceArr[i]+'</option>');
			// 或者$('select')
		} else{
			break;
		}
	}
	console.log("temperature mchart");
    mChart = echarts.init(document.getElementById("temperatureChart"));
    option = {
        title:{
            text:"Turbidity"
        },
        tooltip:{},
        legend:{
            data:['Turbidity(NTU)'],
            textStyle:{
              fontSize:12
            }
        },
        xAxis:{
            type:'category',
            data:[],
			axisTick:{
				show: false
			}
        },
        yAxis:{
          // type:'value',
          // axisLabel:{
          //   formatter:"{value}{℃}"
          // }
        },
        series:[{
            name:"水样浊度(NTU)",
            type:"line",
            data:[]
        }]
    };
    mChart.setOption(option);
	
	humidChart = echarts.init(document.getElementById("humidChart"));
	humidOption = {
    title:{
      text: "Temperature"
    },
    legend:{
      
      data:['Temperature(℃)'],
      textStyle:{
        fontSize:12
      }
    },
    xAxis:{
      type:"category",
      data:[]
    },
    yAxis:{
      // type:'value',
      // axisLabel:{
      //   formatter:"{value}{%}"
      // }
    },
    series:[{
      name:"水样温度(℃)",
      type:"line",
      data:[]
    }]

  }
	humidChart.setOption(humidOption);

	console.log("mchart of light");

	lightChart = echarts.init(document.getElementById("lightChart"));
	lightOption = {
		title:{
		text: "PH"
		},
		legend:{
		data:['PH(-)'],
		textStyle:{
			fontSize:12
		}
		},
		xAxis:{
		type:"category",
		data:[]
		},
		yAxis:{
		// type:'value',
		// axisLabel:{
		//   formatter:"{value}{lux}"
		// }
		},
		series:[{
		name:"水样PH(-)",
		type:"line",
		data:[]
		}]
    }
	lightChart.setOption(lightOption);
	// $.get("/history",function(error, data){
	// 	console.log("收到数据为：",data.avg_humidity);
	// })
	// 2022年9月24日

	tdsChart = echarts.init(document.getElementById("tdsChart"));
	tdsOption = {
		title:{
		text: "TDS"
		},
		legend:{
		data:['TDS(-)'],
		textStyle:{
			fontSize:12
		}
		},
		xAxis:{
		type:"category",
		data:[]
		},
		yAxis:{
		// type:'value',
		// axisLabel:{
		//   formatter:"{value}{lux}"
		// }
		},
		series:[{
		name:"水样TDS(-)",
		type:"line",
		data:[]
		}]
    }
	tdsChart.setOption(tdsOption);


	ecChart = echarts.init(document.getElementById("ecChart"));
	ecOption = {
		title:{
		text: "Conductivity"
		},
		legend:{
		data:['Conductivity(-)'],
		textStyle:{
			fontSize:12
		}
		},
		xAxis:{
		type:"category",
		data:[]
		},
		yAxis:{
		// type:'value',
		// axisLabel:{
		//   formatter:"{value}{lux}"
		// }
		},
		// 2023年12月11日可以把序列去除
		series:[{
		name:"电导率(-)",
		type:"line",
		data:[]
		}]
    }
	ecChart.setOption(ecOption);



	$.get("/history",(res)=>{
		// res返回的是整个网页
		// forEach作用是列出数组的每个元素
		// console.log("测试自动添加历史设备数据,");
	})
	
	// $.get("/deviceArr",(res)=>{
	//   console.log('javascripts index.js ceshi');
	//   // res.foreach(device=>{//哭~~~~~~~~是forEach不是foreach
	// 	//device是自己命名的，理论上也可叫做其他比如device1
	//   res.forEach(device=>{
	//     // 选择select元素，并将设备添加到选框里面，
	//     $('select').append('<option>'+device.maddr+' - '+device.devId+'</option>');
	//     // 添加到列表中 '<tbody><tr><td></td></tr></tbody>'
	//     // $('#deviceTab').append('<tr><td>'+device.maddr+'</td><td>'+device.devId+'</td></tr>');
	//   })
	// })


  // $("#open.btn.btn-info").click(function(){
  //   console.log("open click");
  //   var device = getDeviceMsg();
  //   // $.post("/", { action:"open",addr: equipment.addr, id: equipment.id } );
  //   //$.post("/", { action:"open"} );
  //   $.post("/",{action:"open",maddr:device.maddr,devId:device.devId});
  //   console.log("addr: ",device.maddr," devId: ",device.devId);
  // });

  // $("#close.btn.btn-default").click(function(){
  //   // var equipment = getEquipmentInfo()
  //   // $.post("/", { action:"close",addr: equipment.addr, id: equipment.id } );
  //   console.log("btnClose clicked");
  //   var device = getDeviceMsg();
  //   $.post("/", { action:"close",maddr:device.maddr,devId:device.devId});
  // });
  // 1. 尝试在页面加载完成时，发送一个Ajax请求以更新下拉列表框
	// $.ajax({
	// 		  url:'history1',
	// 		  dataType:'json',
	// 		  type:'GET',
	// 		  success:function(data){
	// 			  console.log('页面加载成功时的ajax,data为：',data);
	// 		  },
	// 		  error:function(error){
	// 			  console.log('err:',error);
	// 		  }
	// })
  // 2. 点击事件里面有一个 ajax，
	$("#btnSearch").click(function(){
		console.log("进入按钮点击事件");
		// 每次在进入点击事件之前，清空原有的数据
		$("#avg_temper").text("");
		$("#avg_humidity").text("");
		$("#avg_light").text("");
		$("#max_temper").text("");
		$("#max_humidity").text("");
		$("#max_light").text("");
		$("#min_temper").text("");
		$("#min_humidity").text("");
		$("#min_light").text("");

		//添加如下代码 2022年10月20日
		$("avg_ec").text("");
		$("max_ec").text("");
		$("min_ec").text("");

		$("avg_tds").text("");
		$("max_tds").text("");
		$("min_tds").text("");
		// mChart.clear();
		// $("#temperatureChart").empty();
		// for (var i=0; i<option.series.length;i++) {
		// 	option.series[i].data = [];// 清除图上的点
		// 	// option.series[i].name = "";// 清除纵坐标的值
		// 	option.xAxis.data = [];
		// }
		option.series[0].data = [];// 清除图上的点
		// option.series[i].name = "";// 清除纵坐标的值
		option.xAxis.data = [];
		mChart.setOption(option);
		
		humidOption.series[0].data = [];// 清除图上的点
		// option.series[i].name = "";// 清除纵坐标的值
		humidOption.xAxis.data = [];
		humidChart.setOption(humidOption);
		
		lightOption.series[0].data = [];// 清除图上的点
		// option.series[i].name = "";// 清除纵坐标的值
		lightOption.xAxis.data = [];
		lightChart.setOption(lightOption);
		// mChart.removeAttribute("_echarts_instance_");
	  // debugger

		//2022年10月20日，新增代码如下所示，清除之前的历史数据
		ecOption.series[0].data = [];// 清除图上的点
		// option.series[i].name = "";// 清除纵坐标的值
		ecOption.xAxis.data = [];
		ecChart.setOption(ecOption);

		tdsOption.series[0].data = [];// 清除图上的点
		// option.series[i].name = "";// 清除纵坐标的值
		tdsOption.xAxis.data = [];
		tdsChart.setOption(tdsOption);


	 
	  // debugger
	  // type:'get',
	  // 尝试写原生的ajax
		var searchTime = document.getElementById('searchTime').value;
		// 以下方法无法获取页面时钟控件的值
		// var beginTime  = $("#beginTime");
		// var endTime    = $("#endTime")

		var endDate = document.getElementById('endDate').value;
		console.log("2023年12月9日，endDate:",endDate);


		var beginTime = document.getElementById('beginTime').value; 
		var endTime = document.getElementById('endTime').value;
		var sel     = document.getElementById('sel').value;
		console.log("searchTime:",searchTime,"beginTime:",beginTime,"endTime:",endTime,"sel:",sel);
		// var xhr;
		// if (window.XMLHttpRequest) {
		// 	xhr = new XMLHttpRequest();
		// 	console.log('xhr:',xhr);
		// } else if(window.ActiveXObject){
		// 	xhr = new ActiveXObject('Microsoft.XMLHTTP');
		// 	// xhr.open('get','http://127.0.0.1:3000/gets');
		// 	// xhr.send();
		// }else{
		// 	return alert("不支持ajax");
		// }
		
		// // 2. 监听状态的改变 onreadystatechange
		// xhr.onreadystatechange = function(){
		// 	console.log("zt",xhr.readyState);
		// 	// readyState: 
		// 	// 1 :已经调用open函数
		// 	// 2 :已经接收到响应头
		// 	// 3 :已经接收到部分响应文本
		// 	// 4 :接受全部响应文本
		// 	if (xhr.readyState === 4 ) {
		// 		if(xhr.status === 200 || xhr.status === 304){
		// 			//查看数据
		// 			// xhr.responseText可以获取响应文本
		// 			console.log(xhr);
		// 			var name = xhr.responseXML.getElementsByTagName('name')[0].innerHTML;
		// 			var address = xhr.responseXML.getElementsByTagName('adderss')[0].innerHTML;
		// 			dom.innerHTML = '${address}-${name}';
		// 		}
		// 	}
		// }
		// console.log("第三步");
		// // 3. 发送ajax请求
		// xhr.open('GET','/users/ajaxtest?username=${usern}&password=${password}', true);
		// xhr.send();
		// 注意dataType表示服务器返回数据的类型
		$.ajax({
			// 当系统搬到云服务器时，要将127.0.0.1换为云服务器地址
			// url:'http://127.0.0.1:3000/users/historyajax',
			// 或者干脆直接如下所示
			// 2023年12月9日添加endDate字段
			url:'/users/historyajax',
			dataType:'json',
			type:'get',
			data:{
				searchTime:searchTime,
				endDate:endDate,
				beginTime:beginTime,
				endTime:endTime,
				sel:sel
			},
			success:function(data){
				console.log("ajax返回的数据为：",data);
				if (data.hints == "无设备信息") {
					$("#avg_temper").text("");
					$("#avg_humidity").text("");
					$("#avg_light").text("");
					$("#max_temper").text("");
					$("#max_humidity").text("");
					$("#max_light").text("");
					$("#min_temper").text("");
					$("#min_humidity").text("");
					$("#min_light").text("");
					// 尝试清空原有的折线图缓存
					
					alert("在该时间段无设备信息");
				} else{
					console.log("data.avg_temper:",data.avg_temper);
					$("#avg_temper").text(data.avg_temper);
					$("#avg_humidity").text(data.avg_humidity);
					$("#avg_light").text(data.avg_light);
					$("#max_temper").text(data.max_temper);
					$("#max_humidity").text(data.max_humidity);
					$("#max_light").text(data.max_light);
					$("#min_temper").text(data.min_temper);
					$("#min_humidity").text(data.min_humidity);
					$("#min_light").text(data.min_light);
					//2022年9月28日
					console.log("2022年9月28日data.avg_ec:", data.avg_ec)
					$("#avg_ec").text(data.avg_ec);
					$("#avg_tds").text(data.avg_tds);
					$("#max_ec").text(data.max_ec);
					$("#max_tds").text(data.max_tds);
					$("#min_ec").text(data.min_ec);
					$("#min_tds").text(data.min_tds);



					console.log("data.historyEchart: ", data.historyEchart)
					renewMyChart(data.historyEchart);
					renewHumidChart(data.historyEchart);
					renewLightChart(data.historyEchart);
					// 2022年9月26日
					renewEcChart(data.historyEchart);
					renewTdsChart(data.historyEchart);
				}
				
			},
			error:function(error){
				console.log("ajax error:",error);
			}
		});
	
	})

});

// Echarts清除上次加载的数据只需要在setoptions中设置第二个参数为true即可。默认为false，即融合所有加载数据。
function renewMyChart(msg){
  // historyEchart:
  // humidity: (5) [86, 76, 76, 66, 65]
  // light: (5) [156, 200, 220, 153, 146]
  // temperature: (5) [22.39999962, 23.29999924, 23.39999962, 25.39999962, 25.60000038]
  // time: (5) ["09:23:50", "09:26:53", "09:29:56", "11:33:51", "11:36:54"]
  var time = msg.time;
  var temperature = msg.temperature;
  for(var i=0; i<time.length; i++){
	option.xAxis.data.push(time[i]);
	option.series[0].data.push(temperature[i]);  
	console.log("temperature[i] 类型",typeof(temperature[i])); //测得temperature[i]为number类型
	
  }
  
  mChart.setOption(option);
}

function renewHumidChart(msg){
  var time = msg.time;
  var humidity = msg.humidity;
  for(var i=0; i<time.length; i++){
  	humidOption.xAxis.data.push(time[i]);
  	humidOption.series[0].data.push(humidity[i]);  
  	// console.log("temperature[i] 类型",typeof(temperature[i])); //测得temperature[i]为number类型
  	
  }
  humidChart.setOption(humidOption);
}

function renewLightChart(msg){
  var time = msg.time;
  var light = msg.light;
  for(var i=0; i<time.length; i++){
  	lightOption.xAxis.data.push(time[i]);
  	lightOption.series[0].data.push(light[i]);  
  	// console.log("temperature[i] 类型",typeof(temperature[i])); //测得temperature[i]为number类型
  	
  }
  lightChart.setOption(lightOption);
}

function renewEcChart(msg){
	var time = msg.time;
	var ec = msg.ec;
	for(var i=0; i<time.length; i++){
		ecOption.xAxis.data.push(time[i]);
		ecOption.series[0].data.push(ec[i]);  
		// console.log("temperature[i] 类型",typeof(temperature[i])); //测得temperature[i]为number类型
		
	}
	ecChart.setOption(ecOption);
  }


  function renewTdsChart(msg){
	var time = msg.time;
	var tds = msg.tds;
	for(var i=0; i<time.length; i++){
		tdsOption.xAxis.data.push(time[i]);
		tdsOption.series[0].data.push(tds[i]);  
		// console.log("temperature[i] 类型",typeof(temperature[i])); //测得temperature[i]为number类型
		
	}
	tdsChart.setOption(tdsOption);
  }




function fuzzyEvaluation(temperature,humidity,light){
  // var 
  // $(document).ready(function(){
  //   if(temperature<3&&humidity<80){//
  //     console.log("请开启设备，以适当降低温度");
  //     $("#result").text("①.当前温度:"+temperature+"℃,较低，注意采取果树防冻措施"+" ②.当前湿度:"+
  //     humidity+"%,暂时无需进行湿度调节"+" ③.当前光照:"+light+"lux,可根据实际情况进行调节");
  //     console.log("humidity:",humidity);
  //   }
  // })
 
}
   
  
 //  $.get("/deviceArr",(res)=>{
 //    console.log('javascripts index.js ceshi');
 //    // res.foreach(device=>{//哭~~~~~~~~是forEach不是foreach
	// //device是自己命名的，理论上也可叫做其他比如device1
 //    res.forEach(device=>{
 //      // 选择select元素，并将设备添加到选框里面，
 //      $('select').append('<option>'+device.maddr+' - '+device.devId+'</option>');
 //      // 添加到列表中 '<tbody><tr><td></td></tr></tbody>'
 //      // $('#deviceTab').append('<tr><td>'+device.maddr+'</td><td>'+device.devId+'</td></tr>');
 //    })
 //  })
  
  




  //以下是关于实现websocket的相关功能
// 监听建立连接事件
  skt.onopen=()=>{
    console.log("connected to webSS!");
	// 以下功能应该再router/index.js中实现
	// 当打开“http://localhost:3000/history”网页时，自动查找数据库，找到其中包含多少设备，
	// 并将设备名添加到下拉列表框中
	// model.find('auto_msg', {}, function(error, data){
	// 	console.log('datalength:',data.length);
	// })
  }
  skt.onclose=()=>{
    console.log("disconnected from wss");
  }
  skt.onerror=(event)=>{
    console.log("Sorry error happened when connecting to wss:",event);
  }

  skt.onmessage=(message) =>{
	// 以下为使用websocket进行数据的接收
	// 如果我们不适用websocket进行数据传送和接收的话，则用不到下面代码
 //    console.log('message:',message);
	//以下代码用来接收来自/index/history发送的设备信息
	var msgData = message.data.split('[');
	var deviceArr = msgData[2].split(',');
	console.log("message.data[0].msg: ",message.data,'字符串转为数组：',msgData,'deviceArr:',deviceArr);
	for(var i=0; i<deviceArr.length; i++){
		if (deviceArr[i] != "null") {
			$('select').append('<option>'+deviceArr[i]+'</option>');
		} else{
			break;
		}
	}
	console.log("message.flag: ",message.flag);
	if (message.flag == 3) {
		console.log("尝试更新历史可视化图表");
		renewMyChart(message);
	}
    skt.send("你好服务器，我是历史数据可视化页面，javascript/historyDataVision.js的回复");
  }

  