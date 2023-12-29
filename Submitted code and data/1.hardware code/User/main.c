/**
  ******************************************************************************
  * @file    main.c
  * @author  fire
  * @version V1.0
  * @date    2015-01-xx
  * @brief   WF-ESP8266 WiFi模块测试
  ******************************************************************************
  * @attention
  *
  * 实验平台:野火 iSO STM32 开发板 
  * 论坛    :http://www.chuxue123.com
  * 淘宝    :http://firestm32.taobao.com
  *
  ******************************************************************************
  */ 
#include "adc_dma.h"
#include "stm32f10x.h"
#include "bsp_usart1.h"
#include "bsp_SysTick.h"
#include "bsp_esp8266.h"
#include "test.h"
#include "bsp_dht11.h"
//#include "adc.h"
//#include "adc2.h"
#include "ds18b20.h"
#include "adc_inc.h" 


/**
  * @brief  主函数
  * @param  无
  * @retval 无
  */


int main ( void )
{
	
	/* 初始化 */
  USARTx_Config ();                                                              //初始化串口1
	SysTick_Init ();                                                               //配置 SysTick 为 1ms 中断一次 
	ESP8266_Init ();                                                               //初始化WiFi模块使用的接口和外设
	//DHT11_Init ();
	DS18B20_Init();
	//ADC_init(ADC_CH4);
	//ADC_init2(ADC_CH5);
	//Adc_Init(); adc原来的初始化方式
	Adc_dma_Init();
	printf ( "\r\n野火 WF-ESP8266 WiFi模块测试例程\r\n" );                          //打印测试例程提示信息
	
	
  ESP8266_StaTcpClient_UnvarnishTest ();
	
	
  while ( 1 );
	
	
}


/*********************************************END OF FILE**********************/
