$(document).ready(function(){
	
	console.log("欢迎来到json测试");
	var searchData = {devId:"Light1",currentTime:{$lt:"17:30",$gt:"17:05"}};
	var json_searchData = JSON.stringify(searchData);
	console.log("searchData：",typeof(searchData),"json_search",typeof(json_searchData));
	
	
	
	
	
	
	console.log("你好，欢迎来到gps测试");
	// string str = "$GPRMC,014635.00,A,2547.82431,N,11452.93870,E,0.117,,240421,,,A*7D";
	// var str = "$GPRMC,014635.00,A,2547.82431,N,11452.93870,E,0.117,,240421,,,A*7D"; // 该数据是格式正确的数据
	var str = "2.93890,E,014632.00,A,A*6F  $GPRMC,014633.00,A,2547.82434,N,11452.93886,E,0.017,,240421,,,A*76"//该数据是格式不正确的数据
	// $GPRMC,014631.00,A,2547.82438,N,11452.93894
	// console.log("strlength:",str.length,"str2lenth:",str2.length);
	var index = 0;//index用来记录$GPRMC数据中'$'的下标
	var endInd = 0;
	// 创建数组
	var finalGpsArr = [];
	for(var i=0; i<str.length-6; i++){
		if (str[i] == '$'  && str[i+1] == 'G'
		&& str[i+2] == 'P' && str[i+3] == 'R' 
		&& str[i+4] == 'M' && str[i+5] == 'C') {
			//如果判断正确，说明找到了以$GPRMC开头的数据
			console.log("找到了$GPRMC,当前i的值为:",i);
			//接下来则要判断其是否是一个完整的数据
			//先把这个下标记录下来
			index = i;
			break;
		} else{
			
		}
	}
	var test_index = str.indexOf("$GPRMC");
	console.log("使用字符串的indexOf方法:",test_index);
	// 从index开始,到后面加上66个字符(因为标准的数据格式中,字符个数为66个),通过统计','的个数来确定是否为标准格式数据
	endInd = index + 66;
	console.log("endInd:",endInd);
	var count = 0;//记录','总数
	for(var j=index; j<endInd; j++){
		if(endInd>str.length){
			//说明从$GPRMC开始,数据根本没这么多,则直接break
			break;
		}else{
			//开始统计其中','的个数
			if (str[j] == ',' || str[j] == ',') {
				count = count +1;
			}
		}
		
	}
	console.log("逗号总数为:",count);
	// $GPRMC,014635.00,A,2547.82431,N,11452.93870,E,0.117,,240421,,,A*7D
	// 标准格式中有12个','  
	
	// if (count == 12) {
	// 	var tmp_index = 0;
	// 	for(var k=index; k<endInd; k++){
	// 		finalGpsArr[tmp_index] = str[k];
	// 		tmp_index = tmp_index+1;
	// 		console.log("finalGpsArr[k]",finalGpsArr[tmp_index]);
	// 	}
	// 	console.log("最后结果为:",finalGpsArr);
	// } else{
	// 	console.log("未找到标准格式的数据");
	// }
	
	if (count == 12) {
		var finalGpsArr = str.slice(index, endInd);
		console.log("最后结果为:",finalGpsArr);
	} else{
		console.log("未找到标准格式的数据");
	}
	
	
	
	
})