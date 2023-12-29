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
//https://blog.csdn.net/funche/article/details/103772596?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control&dist_request_id=&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control
const skt  = new WebSocket('ws://'+host);

var mChart;
var option;

var humidChart;
var humidOption;

var lightChart;
var lightOption;
// 2022年9月23日电导率
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


  console.log("temperature mchart");
    mChart = echarts.init(document.getElementById("zhuduChart"));

    option = {
        title:{
            text:"Turbidity"
        },
        tooltip:{},
        legend:{
            data:['(NTU)'],
            textStyle:{
              fontSize:17,
              fontWeight:'bold'
            }
        },
        xAxis:{
            type:'category',
            data:[],
            
            // axisLabel设置标签大小
            axisLabel:{
              fontSize:17,
              fontWeight:'bold',
              // color:'red',
            },
        },
        yAxis:{
          // type:'value',
          // axisLabel:{
          //   formatter:"{value}{℃}"
          // }
          // 2023年5月2日 缓兵之计 设置ysplitNumber以更好显示
          splitNumber: 3,
          axisLabel:{
            fontSize:17,
            fontWeight:'bold',
            // color:'red',
          },
        },
        series:[{
            name:"(NTU)",
            type:"line",
            data:[]
        }]
    };
    mChart.setOption(option);

  console.log("mchart of temperature");
  humidChart = echarts.init(document.getElementById("temperatureChart"));
  humidOption = {
    title:{
      text: "Temperature"
    },
    legend:{
      
      data:['(℃)'],
      textStyle:{
        fontSize:17,
        fontWeight:'bold'
      }
    },
    xAxis:{
      type:"category",
      data:[],
      // 2023年5月2日 缓兵之计 设置y步长以更好显示

      axisLabel:{
        fontSize:17,
        fontWeight:'bold',
        // color:'red',
      },
    },
    yAxis:{
      // type:'value',
      // axisLabel:{
      //   formatter:"{value}{%}"
      // }
      // 2023年5月2日
      // 2023年5月2日 缓兵之计 设置ysplitNumber以更好显示
      splitNumber: 3,
      axisLabel:{
        fontSize:17,
        fontWeight:'bold',
        // color:'red',
      },
    },
    series:[{
      name:"(℃)",
      type:"line",
      data:[]
    }]

  }
  humidChart.setOption(humidOption);

  console.log("mchart of phChart");

  lightChart = echarts.init(document.getElementById("phChart"));
  lightOption = {
    title:{
      text: "PH"
    },
    legend:{
      data:['PH(-)'],
      textStyle:{
        fontSize:17,
        fontWeight:'bold'
      }
    },
    xAxis:{
      type:"category",
      data:[],
      // 2023年5月2日 缓兵之计 设置y步长以更好显示

      axisLabel:{
        fontSize:16,
        fontWeight:'bold',
        // color:'red',
      },
    },
    yAxis:{
      // type:'value',
      // axisLabel:{
      //   formatter:"{value}{lux}"
      // }
      // 2023年5月2日
      // 2023年5月2日 缓兵之计 设置ysplitNumber以更好显示
      splitNumber: 3,
      axisLabel:{
        fontSize:17,
        fontWeight:'bold',
        // color:'red',
      },
    },
    series:[{
      name:"PH(-)",
      type:"line",
      data:[]
    }]
  }
  lightChart.setOption(lightOption);


  // 2022年9月23日
  ecChart = echarts.init(document.getElementById("ecChart"));
  ecOption = {
    title:{
      text: "Conductivity"
    },
    legend:{
      data:['(us/cm)'],
      textStyle:{
        fontSize:17,
        fontWeight:'bold'
      }
    },
    xAxis:{
      type:"category",
      data:[],
      // 2023年5月2日 缓兵之计 设置y步长以更好显示

      axisLabel:{
        fontSize:17,
        fontWeight:'bold',
        // color:'red',
      },
    },
    yAxis:{
      // type:'value',
      // axisLabel:{
      //   formatter:"{value}{lux}"
      // }
      // 2023年5月2日 缓兵之计 设置ysplitNumber以更好显示
      splitNumber: 3,
      axisLabel:{
        fontSize:15,
        fontWeight:'bold',
        // color:'red',
      },
    },
    series:[{
      name:"(us/cm)",
      type:"line",
      data:[]
    }]
  }
  ecChart.setOption(ecOption);
// tds 可视化 2022年9月23日
  tdsChart = echarts.init(document.getElementById("tdsChart"));
  tdsOption = {
    title:{
      text: "TDS"
    },
    legend:{
      data:['(ppm)'],
      textStyle:{
        fontSize:16,
        fontWeight:'bold'
      }
    },
    xAxis:{
      type:"category",
      data:[],
      // 2023年5月2日 缓兵之计 设置y步长以更好显示

      axisLabel:{
        fontSize:17,
        fontWeight:'bold',
        // color:'red',
      },
    },
    yAxis:{
      // type:'value',
      // axisLabel:{
      //   formatter:"{value}{lux}"
      // }
      // 2023年5月2日 缓兵之计 设置ysplitNumber以更好显示
      splitNumber: 3,
      axisLabel:{
        fontSize:17,
        fontWeight:'bold',
        // color:'red',
      },
    },
    series:[{
      name:"(ppm)",
      type:"line",
      data:[]
    }]
  }
  tdsChart.setOption(tdsOption);




  $("#open.btn.btn-info").click(function(){
    console.log("open click");
    var device = getDeviceMsg();
    // $.post("/", { action:"open",addr: equipment.addr, id: equipment.id } );
    //$.post("/", { action:"open"} );
    $.post("/",{action:"open",maddr:device.maddr,devId:device.devId});
    console.log("addr: ",device.maddr," devId: ",device.devId);
  });

  $("#close.btn.btn-default").click(function(){
    // var equipment = getEquipmentInfo()
    // $.post("/", { action:"close",addr: equipment.addr, id: equipment.id } );
    console.log("btnClose clicked");
    var device = getDeviceMsg();
    $.post("/", { action:"close",maddr:device.maddr,devId:device.devId});
  });

});

function renewMyChart(curTime,sensorData){
  if(!$.isNumeric(sensorData)){
    console.log("error sensor data");
    return;
  }
  option.xAxis.data.push(curTime);
  option.series[0].data.push(sensorData);
  //如果长度超过5，就删除最前面的元素
  if(option.xAxis.data.length>5){
    option.xAxis.data.shift();
    option.series[0].data.shift();
  }
  mChart.setOption(option);
}

function renewHumidChart(curTime,sensorData){
  if(!$.isNumeric(sensorData)){
    console.log("error sensor data");
    return;
  }
  humidOption.xAxis.data.push(curTime);
  humidOption.series[0].data.push(sensorData);
  //如果长度超过5，就删除最前面的元素
  if(humidOption.xAxis.data.length>5){
    humidOption.xAxis.data.shift();
    humidOption.series[0].data.shift();
  }
  humidChart.setOption(humidOption);
}

function renewLightChart(curTime,sensorData){
  if(!$.isNumeric(sensorData)){
    console.log("error sensor data");
    return;
  }
  lightOption.xAxis.data.push(curTime);
  lightOption.series[0].data.push(sensorData);
  //如果长度超过5，就删除最前面的元素
  if(lightOption.xAxis.data.length>5){
    lightOption.xAxis.data.shift();
    lightOption.series[0].data.shift();
  }
  lightChart.setOption(lightOption);
}

// 2022年9月23日添加ec和tds可视化图
function renewEcChart(curTime,sensorData){
  if(!$.isNumeric(sensorData)){
    console.log("error sensor data");
    return;
  }
  ecOption.xAxis.data.push(curTime);
  ecOption.series[0].data.push(sensorData);
  //如果长度超过5，就删除最前面的元素
  if(ecOption.xAxis.data.length>5){
    ecOption.xAxis.data.shift();
    ecOption.series[0].data.shift();
  }
  ecChart.setOption(ecOption);
}

function renewTdsChart(curTime,sensorData){
  if(!$.isNumeric(sensorData)){
    console.log("error sensor data");
    return;
  }
  tdsOption.xAxis.data.push(curTime);
  tdsOption.series[0].data.push(sensorData);
  //如果长度超过5，就删除最前面的元素
  if(tdsOption.xAxis.data.length>5){
    tdsOption.xAxis.data.shift();
    tdsOption.series[0].data.shift();
  }
  tdsChart.setOption(tdsOption);
}
// 2023年12月12日定义一个检测水质的新方法checkWaterQuality，不再使用fuzzyEvaluation

function checkWaterQuality(turbidity, temperature, pH, conductivity, TDs) {
  // 存储异常情况的提示信息
  // 检测一下传入的值是否错误
  console.log("温度:", temperature,"浊度:", turbidity,"pH:", pH, "电导:", conductivity, "tds:", TDs);
  const alerts = [];

  // 温度异常判断
  if (temperature > 30) {
      alerts.push("High temperature:"+temperature+"℃");
  }

  // pH异常判断
  if (pH < 6) {
      alerts.push("Low pH:"+pH+"(-)");
  } else if (pH > 9) {
      alerts.push("High pH"+pH+"(-)");
  }

  // 浊度异常判断
  if (turbidity > 50) {
      alerts.push("High turbidity:"+turbidity+"NTU");
  } else if (turbidity > 10) {
      alerts.push("Medium turbidity:"+turbidity+"NTU");
  }

  // 电导率异常判断
  if (conductivity > 500 || TDs > 1000) {
      alerts.push("High conductivity:"+conductivity+"μS/cm");
  }

  // 汇总提示信息
  if (alerts.length > 0) {
      const result = "Please note:" + alerts.join(",");
      console.log(result);
      $("#result").text(result);
  } else {
      console.log("It is normal water quality.");
      $("#result").text("It is normal water quality.");
  }

}

// 示例调用
// checkWaterQuality(32, 20, 7, 600, 800);


function fuzzyEvaluation(temperature,humidity,light,ec,tds){
  // var 
  $(document).ready(function(){
    if(temperature<10&&humidity<30&&(ec<100 && tds<200)){//
      // 注意在老的api中，temperature代表浊度，humidity代表温度
      // console.log("请开启设备，以适当降低温度");
      // $("#result").text("①.浊度正常，暂无需操作:"+" ②.温度:"+
      // humidity+"℃,无需调节"+" ③.当前PH:"+light+",可根据实际情况进行调节");
// 2023年12月12日
      $("#result").
      text("Normal turbidity,temperature,conductivity,etc no operation required");

      // console.log("humidity:",humidity);
    }
    if(temperature<10&&humidity<=90&&humidity>=80&&(ec>=500 || tds>=1000)){//
      // console.log("请开启设备，以适当降低温度");
      // 2023年12月12日
      $("#result").text("①.当前浊度:"+temperature+"NTU,较低，暂时无需调节"+" ②.:当前温度"+
      humidity+"℃,暂时无需进行温度调节"+" ③PH:"+light+",可根据实际情况进行调节");
      // console.log("humidity:",humidity);
    }
    if(temperature<3&&humidity>90){//
      // console.log("请开启设备，以适当降低温度");
      $("#result").text("①浊度:"+temperature+"NTU,较低，暂无需调节"+" ②温度:"+
      humidity+"℃,无需调节"+" ③PH:"+light+",可根据实际情况进行调节");
      console.log("humidity:",humidity);
    }

    if(temperature>=10&&temperature<=35&&humidity<80){//
      // console.log("请开启设备，以适当降低温度");
      $("#result").text("①浊度:"+temperature+"NTU,浊度中等！"+" ②.温度:"+
      humidity+"℃,暂无需调节"+" ③.PH:"+light+",过低，请注意");
      console.log("humidity:",humidity);
    }
    if(temperature>=10&&temperature<=35&&humidity>=80&&humidity<=90){//
      // console.log("请开启设备，以适当降低温度");
      $("#result").text("①.当前浊度:"+temperature+"NTU,当前浊度中等！"+" ②.当前温度:"+
      humidity+"℃,暂时无需进行温度调节"+" ③.当前PH:"+light+",可根据实际情况进行处理");
      console.log("humidity:",humidity);
    }
    if(temperature>=10&&temperature<=35&&humidity>90){//
      // console.log("请开启设备，以适当降低温度");
      $("#result").text("①.当前浊度:"+temperature+"NTU,当前浊度中等！"+" ②.当前温度:"+
      humidity+"℃,暂时无需进行温度调节"+" ③.当前光照:"+light+",可根据实际情况进行处理");
      console.log("humidity:",humidity);
    }
    if(temperature>35&&humidity<80){//
      // console.log("请开启设备，以适当降低温度");
      // 2023年12月12日
      // $("#result").text("①.浊度:"+temperature+"NTU,较高，注意采取措施"+" ②.温度度:"+
      // humidity+"℃,暂无需调节"+" ③.PH:"+light+",可根据实际情况处理");
      $("#result").text("①.High turbidity:"+temperature+",Please note");
      // console.log("humidity:",humidity);
    }
    if(temperature>35&&humidity>90){//
      // console.log("请开启设备，以适当降低温度");
      $("#result").text("①.当前浊度:"+temperature+"NTU,较高，注意采取措施"+" ②.当前温度:"+
      humidity+"℃,暂时无需进行温度调节"+" ③.当前光照:"+light+",可根据实际情况进行处理");
      // console.log("humidity:",humidity);
    }
    if(temperature>35&&humidity>=80&&humidity<=90){//
      // console.log("请开启设备，以适当降低温度");
      $("#result").text("①.当前浊度:"+temperature+"NTU,较高，注意采取措施"+"②.当前温度:"+
      humidity+"℃,暂时无需进行温度调节"+"③.当前光照:"+light+"lux,可根据实际情况进行调节");
      // console.log("humidity:",humidity);
    }
    console.log("成功");
  })
  

}
   
  
  $.get("/deviceArr",(res)=>{
    console.log('javascripts index.js ceshi');
    // res.foreach(device=>{//哭~~~~~~~~是forEach不是foreach
    res.forEach(device=>{
      // 选择select元素，并将设备添加到选框里面，
      $('select').append('<option>'+device.maddr+' - '+device.devId+'</option>');
      // 添加到列表中 '<tbody><tr><td></td></tr></tbody>'
      // $('#deviceTab').append('<tr><td>'+device.maddr+'</td><td>'+device.devId+'</td></tr>');
    })
  })




  //以下是关于实现websocket的相关功能
// 监听建立连接事件
  skt.onopen=()=>{
    console.log("connected to webSS!");
  }
  skt.onclose=()=>{
    console.log("disconnected from wss");
  }
  skt.onerror=(event)=>{
    console.log("Sorry error happened when connecting to wss:",event);
  }

  skt.onmessage=(message) =>{
    // console.log("receievd from wss:",message.data);
    // dataArr = message.data.split(':');
    console.log('message:',message);
    console.log("message.data: ",message.data);
    // console.log("message.msg: ",message);
    var jsonMsg = JSON.parse(message.data);
    var substr = jsonMsg[0].msg.substr(0,6);
    // console.log("substr:",substr);
    //在这里尝试自动刷新连接设备，通过对发送过来的数据进行分析，如果含有""device"字段，则说明是设备消息，于是把设备消息追加到复选框和table表格中，以实现自动刷新
    if(substr==="device"){
      
      console.log("time: ",jsonMsg[0].time);
      console.log("msg:",jsonMsg[0].msg);
      var deviceMessage = jsonMsg[0].msg.split(':');
      var deviceId = deviceMessage[1];
      var deviceIp = deviceMessage[2]+":"+deviceMessage[3];
      console.log("deviceId:",deviceId,"deviceIp:",deviceIp);
      $(document).ready(function(){
        $('select').append('<option>'+deviceIp+' - '+deviceId+'</option>');
      // 添加到列表中 '<tbody><tr><td></td></tr></tbody>'
        // $('#deviceTab').append('<tr><td>'+deviceIp+'</td><td>'+deviceId+'</td></tr>');
      });
    }else{
		//调试时，在网络调试助手中输入格式如20:70:45的数据
		//20对应温度，70对应湿度，45对应光照强度
      var jsonMsg = JSON.parse(message.data);
	    // console.log("jsonMsg:",jsonMsg);
      console.log("time: ",jsonMsg[0].time);
      console.log("msg:",jsonMsg[0].msg);
      var sensorData = jsonMsg[0].msg.split(":");
      // 2023年12月12日更新一下浊度、温度和ph的变量名
      var newTurbidity = parseFloat(sensorData[0]).toFixed(2);//浊度
      var newTemperature    = parseFloat(sensorData[1]).toFixed(2);//温度
      var newPH       = sensorData[2];//ph
      // 2022年9月23日
      var tds = parseFloat(sensorData[3]).toFixed(2)
      var ec  = parseFloat(sensorData[4]).toFixed(2)
	  // sensorData[3]为字符串类型，遍历数据，然后找到GPRMC，
	  // 数据举例：一、sensorData[3]:   2.93890,E,014632.00,A,A*6F $GPRMC,014633.00,A,2547.82434,N,11452.93886,E,0.017,,240421,,,A*76
	  //二、$GPRMC,014629.00,A,2547.824
	  //三、$GPRMC,014631.00,A,2547.82438,N,11452.93894
	  //四、$GPRMC,014633.00,A,2547.82434,N,11452.93886,E,0.017,,240421,,,A*76
	  //五、$GPRMC,014635.00,A,2547.82431,N,11452.93870,E,0.117,,240421,,,A*7D
	  // 因为从硬件端收到的很多GPRMC数据是不完整的，因此我们在遍历sensorData数据时，
	  // 要先找到完整的这一部分，然后再进行遍历，标准的GPRMC数据有66个字符
	  // console.log("typeof sensorData[3]",typeof(sensorData[3]));
	  
      // console.log("temperature: ",temperature,"humidity:",humidity,"light:",light,"sensorData[3]: ",sensorData[3]);
      // console.log("dataArr: ",dataArr);
      renewMyChart(jsonMsg[0].time,newTurbidity);//更新浊度
      renewHumidChart(jsonMsg[0].time,newTemperature);//更新温度
      renewLightChart(jsonMsg[0].time,newPH);//更新ph

      //2022年9月23日
      renewEcChart(jsonMsg[0].time,ec);
      renewTdsChart(jsonMsg[0].time, tds);
      $(document).ready(function(){
        console.log("try to renew html ");
        // 2023年12月12日老式接口中，newTurbidity对应的是#temperature id,
        // 其余类似
        $("#temperature").text(newTurbidity.toString()+"NTU");
        $("#humidity").text(newTemperature.toString()+"℃");
        $("#test3").text(newPH.toString()+"(-)");
		    $("#gps").text("Reserved interface");
		// $("#gps").text("N:25.67,E:114.52");
        // 2022年9月27日
        $("#ec").text(ec.toString()+"us/cm");
        $("#tds").text(tds.toString()+"ppm")
        console.log("try to renew html2 ");
      });
      // 2023年12月12日
      // fuzzyEvaluation(newTurbidity,newTemperature,newPH,ec,tds);
      checkWaterQuality(newTurbidity,newTemperature,newPH,ec,tds);
	  
      // 以前的废弃接口
	  var gpsMessage = sensorData[3];
	  var index = gpsMessage.indexOf("$GPRMC");
	  console.log("index of $GPRMC:",index);
	  var endInd = index+66;
	  var count = 0;
	  for(var j=index; j<endInd; j++){
	  		if(endInd>gpsMessage.length){
	  			//说明从$GPRMC开始,数据根本没这么多,则直接break
	  			break;
	  		}else{
	  			//开始统计其中','的个数
	  			if (gpsMessage[j] == ',' || gpsMessage[j] == ',') {
	  				count = count +1;
	  			}
	  		}
	  }
	  //count>=7表示其至少获取了经度和纬度数据
	  if (count >=7) {
	  		var finalGpsMes = gpsMessage.slice(index, endInd);
	  		console.log("最后结果为:",finalGpsMes);
			var GPRMCArr = finalGpsMes.split(",");
			console.log('GPRMCArr:',GPRMCArr);
			if(GPRMCArr.length>=7){
				// 再判断是否为有效消息
				// 如果GPRMCArr[2] == "V" (见项目文件夹截图gps信息获取错误.png)则表示获取的信息无效，则不更新页面
				if(GPRMCArr[2] == "V"){
					
				}else{
					// 25.47 114.52
					console.log("执行到设置网页面上的gps信息");
					$("#gps").text(GPRMCArr[4]+':'+GPRMCArr[3].slice(0,2)+'.'+GPRMCArr[3].slice(2,4)+
					','+GPRMCArr[6]+':'+GPRMCArr[5].slice(0,3)+'.'+GPRMCArr[5].slice(3,5)
					);
					// GPRMCArr[3]
				}
				
			}
			
	  } else{
	  		console.log("未找到标准格式的数据");
	  }
    }
    skt.send("你好服务器，我是浏览器，我收到了你的数据用于设置设备和可视化，这是来自javascript/index.js的回复");
  } 

  