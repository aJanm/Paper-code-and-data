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
  * @brief  ESP8266 ��Sta Tcp Client��͸��
  * @param  ��
  * @retval ��
  */
void ESP8266_StaTcpClient_UnvarnishTest ( void )
{
	uint8_t ucStatus;
	
//	char cStr [ 100 ] = { 0 };

//	DHT11_Data_TypeDef DHT11_Data;
	
//	u16 adcx; // ����������ADC��ֵ
	float zhudu;
	float temp; // ���ADCת��Ϊ��ѹ��ֵ
	
	float TU_value=0.0;
	float TU_calibration=0.0;
	char str[45];
//	char str_zhudu[15];
	char str_temper[15];
	char str_ph[15];
	//2022��10��10��
	//char str_tds[10]=":20";
	//char str_ec[10]=":40";
	
	//2022��10��18��
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
	
	//2022��10��13��,EC
	float EC_voltage;
	float EC_value=0.0;
	//float temp_data=250; //��ʱ�洢�¶�����
	float compensationCoefficient_EC=1.0;//�¶�У׼ϵ��
	float kValue_EC=1.0;
	//float kValue_Low=1.14948;  //У׼ʱ�����޸�
	float kValue_Low= 1.27168;//1.25748;  //У׼ʱ�����޸�
	float kValue_High= 1.22532;//1.21496; //У׼ʱ�����޸�
	float rawEC=0.0;
	float EC_valueTemp=0.0;
	
	float final_ec = 0.0;
	
	//2022��10��13��,tds��ز���
	float TDS=0.0,TDS_voltage;
	float TDS_value=0.0;
	float compensationCoefficient_tds=1.0;//�¶�У׼ϵ��
	float compensationVolatge_tds;
	// 1.1468��ʹ������ƿ��ˮУ���� tds��207֮��
	// 1.067 ���콭����ˮ �Ӷ౦  tds��67~80
	// 1.7161��ʹ������ƿ��ˮУ���� tds��287֮��
	float kValue_tds= 0.98;//1.0339;//1.1339;//0.9976;//1.1468;  // 1.47 
	
  printf ( "\r\n�������� ESP8266 ......\r\n" );

	macESP8266_CH_ENABLE();
	
	ESP8266_AT_Test ();
	
	ESP8266_Net_Mode_Choose ( STA );

  while ( ! ESP8266_JoinAP ( macUser_ESP8266_ApSsid, macUser_ESP8266_ApPwd ) );	
	
	ESP8266_Enable_MultipleId ( DISABLE );
	
	while ( !	ESP8266_Link_Server ( enumTCP, macUser_ESP8266_TcpServer_IP, macUser_ESP8266_TcpServer_Port, Single_ID_0 ) );
	
	while ( ! ESP8266_UnvarnishSend () );
	
	printf ( "\r\n���� ESP8266 ���\r\n" );
	
	ESP8266_SendString ( ENABLE, "device1", 0, Single_ID_0 );  
	Delay_ms ( 1000 );
	while ( 1 )
	{		/*
		if ( DHT11_Read_TempAndHumidity ( & DHT11_Data ) == SUCCESS )       //��ȡ DHT11 ��ʪ����Ϣ
			sprintf ( cStr, "\r\n��ȡDHT11�ɹ�!\r\n\r\nʪ��Ϊ%d.%d ��RH ���¶�Ϊ %d.%d�� \r\n", 
								DHT11_Data .humi_int, DHT11_Data .humi_deci, DHT11_Data .temp_int, DHT11_Data.temp_deci );
				
		else
			sprintf ( cStr, "Read DHT11 ERROR!\r\n" );

		printf ( "%s", cStr );                                             //��ӡ��ȡ DHT11 ��ʪ����Ϣ
		*/
		//�¶�
		tmpetValue = (float)(DS18B20_Get_Temp())/10;
		sprintf(str_temper, "%0.2f", tmpetValue);
		printf("tmpetValue: %f\r\t", tmpetValue);
		//���βɼ��Ƕȡ�PH��ec��tds����Ӧͨ��4 5 6 7
		temp2[0]=(float)ADC_convered[0]/4095*3.3;
		Delay_ms ( 5 );
		temp2[1]=(float)ADC_convered[1]/4095*3.3;
		Delay_ms ( 5 );
		//���ڣ�2022��10��13��
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
		PH = -5.7541*PH+16.654;   //�����ѹ��Χ0~3V3
		//printf("adc4 val: %d\r\t",adcx);
		sprintf(str_ph, "%0.2f", PH);
		printf("PH val: %f\t",PH);
		//�ǶȽ���
		T_test = tmpetValue;
		
		//adcx=Get_Adc_Average1(ADC_Channel_4 ,10);
		//adcx=Get_Adc_Average1(ADC_CH4,10);
		temp=temp2[0]; // ��ȡ��ѹ 3.3v ---- 4095    0v ----- 0
		U_test = temp;
		printf("adc voltage: %f\r  ", temp);
		//delta_U = -0.0192 * (T_test - 25);
		//U_25 = U_test - delta_U;
		//K = 865.68 * U_25;
		K = 865.68 * (U_test + 0.0192 * (T_test - 25));
		// ���ݵ�ѹ�����Ƕ�
		//zhudu = -865.68 * temp + 2678.78;2856.046631��2863.05
		//�Ƕ�У����2022��11��11��
//		TU_calibration=-0.0192*(temp_data/10-25)+TU;  
//	  TU_value=-865.68*TU_calibration + K_Value;

		TU_calibration = -0.0192 * (T_test - 25) + temp;
		printf("T_test:%f\n", T_test);
		zhudu = -865.68 * TU_calibration +  2893.56;//2763.62;//2873.36;//2740.11;//2856.05;
		printf("zhudu: %f\r ", zhudu);
		//�쳣�����жϣ�
		if(zhudu < 0){
			zhudu = rand()/(RAND_MAX+0.5);
		}else if(zhudu >= 1000){
			zhudu = 980.56;
		}
		printf("jiaozheng K: %f\r ", K);
		printf("jiaoz zhudu: %f\r\n", zhudu);
		//temp = temp*100/3.3; // ��tempת��Ϊ�ٷֱ�
		
		//if(temp > 100) temp = 100;
		
		//printf("adc val percentage: %f\r percent \n ",temp); // �����ѹֵ�İٷֱ�
		
		//2022��10��13��,ʹ��temp2[2]������Ϊ�ӿڣ�temp[2]��ӦPA6,��ʾadc�ɼ���ec,�����Ļ�������Ĵ����������̫��ĸı�
		EC_voltage = temp2[2] * 1000; //����1000 �Ǹ���֮ǰ�Ĵ�����ֲ������
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
		compensationCoefficient_EC=1.0+0.0185*((tmpetValue)-25.0); //tmpetValue���ǻ�ȡ�¶ȣ�Ҳ����(temp_data/10)
		EC_value=EC_value/compensationCoefficient_EC;
		
		if((EC_value<=0)){EC_value=0;}
		if((EC_value>20)){EC_value=20;}//20mS/cm
		
		//2022��10��20�� //final_ec���ڱ��潫ms/cmת��Ϊus/cm�ĵ�λ���ֵ
		//��ecת��Ϊ�ַ���
		final_ec = EC_value * 1000 ;
		sprintf(str_ec, " %0.2f" , final_ec);
		
		
		//2022��10��13��,
		TDS_voltage = temp2[3]; //ʹ��temp2[3]������Ϊ�ӿڣ�temp[3]��ʾtds,�����Ļ�������Ĵ����������̫��ĸı�
		compensationCoefficient_tds=1.0+0.02*((tmpetValue)-25.0); 
		compensationVolatge_tds=TDS_voltage/compensationCoefficient_tds;
		TDS_value=(133.42*compensationVolatge_tds*compensationVolatge_tds*compensationVolatge_tds - 
		255.86*compensationVolatge_tds*compensationVolatge_tds + 857.39*compensationVolatge_tds)*0.5*kValue_tds;
		if((TDS_value<=0)){TDS_value=0;}
		if((TDS_value>1400)){TDS_value=1400;}
		//��tdsת��Ϊ�ַ���
		sprintf(str_tds, " %0.2f" , TDS_value);
		
		printf("EC_value: %f\tms/cm, TDS_value,%f\t",EC_value, TDS_value);
		
		
		//����zhudu:temper:ph��ʽƴ������
		sprintf(str, " %0.2f" , zhudu);
		strcat(str, ":");
		strcat(str, str_temper);
		strcat(str, ":");
		strcat(str, str_ph);
		//2022��10��10��
		//strcat(str, str_tds);
		//strcat(str, str_ec);
		//2022��10��18��
		strcat(str, ":");
		strcat(str, str_tds);
		strcat(str, ":");
		strcat(str, str_ec);
		
		ESP8266_SendString ( ENABLE, str, 0, Single_ID_0 );               //���� DHT11 ��ʪ����Ϣ�������������
		
		Delay_ms ( 1000 );
		
		if ( ucTcpClosedFlag )                                             //����Ƿ�ʧȥ����
		{
			ESP8266_ExitUnvarnishSend ();                                    //�˳�͸��ģʽ
			
			do ucStatus = ESP8266_Get_LinkStatus ();                         //��ȡ����״̬
			while ( ! ucStatus );
			
			if ( ucStatus == 4 )                                             //ȷ��ʧȥ���Ӻ�����
			{
				printf ( "\r\n���������ȵ�ͷ����� ......\r\n" );
				
				while ( ! ESP8266_JoinAP ( macUser_ESP8266_ApSsid, macUser_ESP8266_ApPwd ) );
				
				while ( !	ESP8266_Link_Server ( enumTCP, macUser_ESP8266_TcpServer_IP, macUser_ESP8266_TcpServer_Port, Single_ID_0 ) );
				
				printf ( "\r\n�����ȵ�ͷ������ɹ�\r\n" );

			}
			
			while ( ! ESP8266_UnvarnishSend () );		
			
		}

	}
	
		
}


