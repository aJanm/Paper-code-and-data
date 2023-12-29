#include "test.h"
#include "bsp_esp8266.h"
#include "bsp_SysTick.h"
#include <stdio.h>  
#include <string.h>  
#include <stdbool.h>
#include "bsp_dht11.h"
#include "adc_inc.h"
#include "ds18b20.h"
#include <stdlib.h>
#include "adc_dma.h"


volatile uint8_t ucTcpClosedFlag = 0;



/**
  * @brief  ESP8266 （Sta Tcp Client）透传
  * @param  无
  * @retval 无
  */
void ESP8266_StaTcpClient_UnvarnishTest ( void )
{
	uint8_t ucStatus;
	
//	char cStr [ 100 ] = { 0 };

//	DHT11_Data_TypeDef DHT11_Data;
	
//	u16 adcx; // 定义变量存放ADC的值
	float zhudu;
	float temp; // 存放ADC转化为电压的值
	
	float TU_value=0.0;
	float TU_calibration=0.0;
	char str[45];
//	char str_zhudu[15];
	char str_temper[15];
	char str_ph[15];
	//2022年10月10日
	//char str_tds[10]=":20";
	//char str_ec[10]=":40";
	
	//2022年10月18日
	char str_tds[10];
	char str_ec[10];
	
//	int flag = 0;
	float T_test = 0.0;
	float U_test = 0.0;
//	float delta_U = 0.0;
//	float U_25 = 0.0;
	float K= 0.0;
//	float suijishu;
	
//	u16 adcx2;
	float PH;
	float tmpetValue;
	
	
	extern u16 ADC_convered[4];
	float temp2[4];
	
	//2022年10月13日,EC
	float EC_voltage;
	float EC_value=0.0;
	//float temp_data=250; //暂时存储温度数据
	float compensationCoefficient_EC=1.0;//温度校准系数
	float kValue_EC=1.0;
	//float kValue_Low=1.14948;  //校准时进行修改
	float kValue_Low= 1.27168;//1.25748;  //校准时进行修改
	float kValue_High= 1.22532;//1.21496; //校准时进行修改
	float rawEC=0.0;
	float EC_valueTemp=0.0;
	
	float final_ec = 0.0;
	
	//2022年10月13日,tds相关操作
	float TDS=0.0,TDS_voltage;
	float TDS_value=0.0;
	float compensationCoefficient_tds=1.0;//温度校准系数
	float compensationVolatge_tds;
	// 1.1468是使用葡萄瓶子水校正的 tds在207之间
	// 1.067 是漓江干流水 加多宝  tds在67~80
	// 1.7161是使用葡萄瓶子水校正的 tds在287之间
	float kValue_tds= 0.98;//1.0339;//1.1339;//0.9976;//1.1468;  // 1.47 
	
  printf ( "\r\n正在配置 ESP8266 ......\r\n" );

	macESP8266_CH_ENABLE();
	
	ESP8266_AT_Test ();
	
	ESP8266_Net_Mode_Choose ( STA );

  while ( ! ESP8266_JoinAP ( macUser_ESP8266_ApSsid, macUser_ESP8266_ApPwd ) );	
	
	ESP8266_Enable_MultipleId ( DISABLE );
	
	while ( !	ESP8266_Link_Server ( enumTCP, macUser_ESP8266_TcpServer_IP, macUser_ESP8266_TcpServer_Port, Single_ID_0 ) );
	
	while ( ! ESP8266_UnvarnishSend () );
	
	printf ( "\r\n配置 ESP8266 完毕\r\n" );
	
	ESP8266_SendString ( ENABLE, "device1", 0, Single_ID_0 );  
	Delay_ms ( 1000 );
	while ( 1 )
	{		/*
		if ( DHT11_Read_TempAndHumidity ( & DHT11_Data ) == SUCCESS )       //读取 DHT11 温湿度信息
			sprintf ( cStr, "\r\n读取DHT11成功!\r\n\r\n湿度为%d.%d ％RH ，温度为 %d.%d℃ \r\n", 
								DHT11_Data .humi_int, DHT11_Data .humi_deci, DHT11_Data .temp_int, DHT11_Data.temp_deci );
				
		else
			sprintf ( cStr, "Read DHT11 ERROR!\r\n" );

		printf ( "%s", cStr );                                             //打印读取 DHT11 温湿度信息
		*/
		//温度
		tmpetValue = (float)(DS18B20_Get_Temp())/10;
		sprintf(str_temper, "%0.2f", tmpetValue);
		printf("tmpetValue: %f\r\t", tmpetValue);
		//依次采集浊度、PH、ec和tds，对应通道4 5 6 7
		temp2[0]=(float)ADC_convered[0]/4095*3.3;
		Delay_ms ( 5 );
		temp2[1]=(float)ADC_convered[1]/4095*3.3;
		Delay_ms ( 5 );
		//日期，2022年10月13日
		temp2[2]=(float)ADC_convered[2]/4095*3.3;
		Delay_ms ( 5 );
		temp2[3]=(float)ADC_convered[3]/4095*3.3;
		//printf("ec:%f\t,tds:%f\n", temp2[2], temp2[3]);
		//ph
		/*
		adcx2 = Get_Adc_Average2(ADC_Channel_5,10);
		if( tmpetValue > 42 )  adcx2 += 5;
			else if(tmpetValue > 28){
			adcx2 += 5*(tmpetValue - 28)/14;
		}
		*/
		
		PH=temp2[1];
		printf("PH voltage: %f  ",PH);
		PH = -5.7541*PH+16.654;   //输出电压范围0~3V3
		//printf("adc4 val: %d\r\t",adcx);
		sprintf(str_ph, "%0.2f", PH);
		printf("PH val: %f\t",PH);
		//浊度矫正
		T_test = tmpetValue;
		
		//adcx=Get_Adc_Average1(ADC_Channel_4 ,10);
		//adcx=Get_Adc_Average1(ADC_CH4,10);
		temp=temp2[0]; // 获取电压 3.3v ---- 4095    0v ----- 0
		U_test = temp;
		printf("adc voltage: %f\r  ", temp);
		//delta_U = -0.0192 * (T_test - 25);
		//U_25 = U_test - delta_U;
		//K = 865.68 * U_25;
		K = 865.68 * (U_test + 0.0192 * (T_test - 25));
		// 根据电压计算浊度
		//zhudu = -865.68 * temp + 2678.78;2856.046631，2863.05
		//浊度校正，2022年11月11日
//		TU_calibration=-0.0192*(temp_data/10-25)+TU;  
//	  TU_value=-865.68*TU_calibration + K_Value;

		TU_calibration = -0.0192 * (T_test - 25) + temp;
		printf("T_test:%f\n", T_test);
		zhudu = -865.68 * TU_calibration +  2893.56;//2763.62;//2873.36;//2740.11;//2856.05;
		printf("zhudu: %f\r ", zhudu);
		//异常数据判断，
		if(zhudu < 0){
			zhudu = rand()/(RAND_MAX+0.5);
		}else if(zhudu >= 1000){
			zhudu = 980.56;
		}
		printf("jiaozheng K: %f\r ", K);
		printf("jiaoz zhudu: %f\r\n", zhudu);
		//temp = temp*100/3.3; // 将temp转化为百分比
		
		//if(temp > 100) temp = 100;
		
		//printf("adc val percentage: %f\r percent \n ",temp); // 输出电压值的百分比
		
		//2022年10月13日,使用temp2[2]变量作为接口，temp[2]对应PA6,表示adc采集的ec,这样的话，后面的代码就无需做太大的改变
		EC_voltage = temp2[2] * 1000; //乘以1000 是根据之前的代码移植过来的
		rawEC = 1000*EC_voltage/RES2/ECREF;
		EC_valueTemp=rawEC*kValue_EC;
		if(EC_valueTemp>2.0)
		{
			kValue_EC=kValue_High;
		}
		else if(EC_valueTemp<=2.0)
		{
			kValue_EC=kValue_Low;
		}
		EC_value=rawEC*kValue_EC;
		compensationCoefficient_EC=1.0+0.0185*((tmpetValue)-25.0); //tmpetValue就是获取温度，也就是(temp_data/10)
		EC_value=EC_value/compensationCoefficient_EC;
		
		if((EC_value<=0)){EC_value=0;}
		if((EC_value>20)){EC_value=20;}//20mS/cm
		
		//2022年10月20日 //final_ec用于保存将ms/cm转化为us/cm的单位后的值
		//将ec转化为字符串
		final_ec = EC_value * 1000 ;
		sprintf(str_ec, " %0.2f" , final_ec);
		
		
		//2022年10月13日,
		TDS_voltage = temp2[3]; //使用temp2[3]变量作为接口，temp[3]表示tds,这样的话，后面的代码就无需做太大的改变
		compensationCoefficient_tds=1.0+0.02*((tmpetValue)-25.0); 
		compensationVolatge_tds=TDS_voltage/compensationCoefficient_tds;
		TDS_value=(133.42*compensationVolatge_tds*compensationVolatge_tds*compensationVolatge_tds - 
		255.86*compensationVolatge_tds*compensationVolatge_tds + 857.39*compensationVolatge_tds)*0.5*kValue_tds;
		if((TDS_value<=0)){TDS_value=0;}
		if((TDS_value>1400)){TDS_value=1400;}
		//将tds转化为字符串
		sprintf(str_tds, " %0.2f" , TDS_value);
		
		printf("EC_value: %f\tms/cm, TDS_value,%f\t",EC_value, TDS_value);
		
		
		//按照zhudu:temper:ph格式拼接数据
		sprintf(str, " %0.2f" , zhudu);
		strcat(str, ":");
		strcat(str, str_temper);
		strcat(str, ":");
		strcat(str, str_ph);
		//2022年10月10日
		//strcat(str, str_tds);
		//strcat(str, str_ec);
		//2022年10月18日
		strcat(str, ":");
		strcat(str, str_tds);
		strcat(str, ":");
		strcat(str, str_ec);
		
		ESP8266_SendString ( ENABLE, str, 0, Single_ID_0 );               //发送 DHT11 温湿度信息到网络调试助手
		
		Delay_ms ( 1000 );
		
		if ( ucTcpClosedFlag )                                             //检测是否失去连接
		{
			ESP8266_ExitUnvarnishSend ();                                    //退出透传模式
			
			do ucStatus = ESP8266_Get_LinkStatus ();                         //获取连接状态
			while ( ! ucStatus );
			
			if ( ucStatus == 4 )                                             //确认失去连接后重连
			{
				printf ( "\r\n正在重连热点和服务器 ......\r\n" );
				
				while ( ! ESP8266_JoinAP ( macUser_ESP8266_ApSsid, macUser_ESP8266_ApPwd ) );
				
				while ( !	ESP8266_Link_Server ( enumTCP, macUser_ESP8266_TcpServer_IP, macUser_ESP8266_TcpServer_Port, Single_ID_0 ) );
				
				printf ( "\r\n重连热点和服务器成功\r\n" );

			}
			
			while ( ! ESP8266_UnvarnishSend () );		
			
		}

	}
	
		
}


