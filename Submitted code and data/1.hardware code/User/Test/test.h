#ifndef  __TEST_H
#define	 __TEST_H



#include "stm32f10x.h"



/********************************** �û���Ҫ���õĲ���**********************************/
//Ҫ���ӵ��ȵ�����ƣ���WIFI����
#define      macUser_ESP8266_ApSsid           "Redmi K40" 
//#define      macUser_ESP8266_ApSsid           "GLUT" 
//Ҫ���ӵ��ȵ����Կ
//#define      macUser_ESP8266_ApPwd            "nisuiyijiuhao" 
#define      macUser_ESP8266_ApPwd            "nisuiyijiuhao" 
//Ҫ���ӵķ������� IP�������Ե�IP
#define      macUser_ESP8266_TcpServer_IP     "192.168.209.72" 

//Ҫ���ӵķ������Ķ˿�
#define      macUser_ESP8266_TcpServer_Port    "4001"         

#define RES2 820.0   //�˷ŵ��裬��Ӳ����·�й�
#define ECREF 200.0 //��Ƭ�����ѹ����Ӳ����·���

/********************************** �ⲿȫ�ֱ��� ***************************************/
extern volatile uint8_t ucTcpClosedFlag;



/********************************** ���Ժ������� ***************************************/
void                     ESP8266_StaTcpClient_UnvarnishTest  ( void );



#endif

