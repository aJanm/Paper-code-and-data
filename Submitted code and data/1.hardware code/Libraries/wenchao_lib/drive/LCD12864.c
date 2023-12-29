
#include "LCD12864.h"

unsigned char AC_TABLE[]={				           //????
0x80,0x81,0x82,0x83,0x84,0x85,0x86,0x87,
0x90,0x91,0x92,0x93,0x94,0x95,0x96,0x97,
0x88,0x89,0x8a,0x8b,0x8c,0x8d,0x8e,0x8f,
0x98,0x99,0x9a,0x9b,0x9c,0x9d,0x9e,0x9f,
};

void delay(unsigned int n) 
{
	unsigned int i;
	for(i=0; i<n; i++) {;}
}
//���з���һ�ֽ�����
void SendByte(unsigned char dat)
{
	unsigned char i;
	for(i=0;i<8;i++)
	{
		EN_L;
		SYSTICK_DelayUs(5);
		if(dat&0x80) 
			RW_H;
		else RW_L;
		SYSTICK_DelayUs(5);
		EN_H;
		SYSTICK_DelayUs(5);
		dat=dat<<1;
	}
	EN_L;
}

void SendCMD(unsigned char dat)
{
//      while(ReadBF){;}
	RS_H;
	SendByte(0xF8);//11111,00,0 RW=0,RS=0   ͬ����־
	SendByte(dat&0xF0);//����λ
	SendByte((dat&0x0F)<<4);//����λ
	RS_L;
}

//д��ʾ���ݻ��ֽ��ַ�
void SendDat(unsigned char dat)
{
//      while(ReadBF){;}
	RS_H;
	SendByte(0xFA);//11111,01,0 RW=0,RS=1
	SendByte(dat&0xF0);//����λ
	SendByte((dat&0x0F)<<4);//����λ
	RS_L;
} 



void display(unsigned char x_add,unsigned char *ptr)
{
	SendCMD(x_add);//1xxx,xxxx �趨DDRAM 7λ��ַxxx,xxxx����ַ������AC
	while(*ptr != '\0')
	{
		SendDat(*ptr);
		++ptr;
	}
}

//��ʼ�� LCM
void initlcm(void)
{
	GPIO_QuickInit(HW_GPIOB, GPIO_Pin_7, GPIO_Mode_Out_PP);//��ʼ����LED���ӵ�Ӳ���ӿ�
	GPIO_QuickInit(HW_GPIOB, GPIO_Pin_8, GPIO_Mode_Out_PP);//��ʼ����LED���ӵ�Ӳ���ӿ�
	GPIO_QuickInit(HW_GPIOB, GPIO_Pin_9, GPIO_Mode_Out_PP);//��ʼ����LED���ӵ�Ӳ���ӿ�

	RS_L;
	delay(100);
	SendCMD(0x30);//�������ã�һ����8λ���ݣ�����ָ�
	SendCMD(0x0C);//0000,1100 ������ʾ���α�off���α�λ��off
	SendCMD(0x01);//0000,0001 ��DDRAM
	SendCMD(0x02);//0000,0010 DDRAM��ַ��λ
	SendCMD(0x80);//1000,0000 �趨DDRAM 7λ��ַ000��0000����ַ������AC
}

void LCD12864_show(unsigned char y, unsigned char x, unsigned char *puts){
	//SendCMD(0x30);//1xxx,xxxx �趨DDRAM 7λ��ַxxx,xxxx����ַ������AC
	//SendCMD(AC_TABLE[8*y+x]);
	display( AC_TABLE[8*y+x], puts );
}

void LCD12864_clear(void){
	unsigned char i;
	SendCMD(0x30);
	SendCMD(0x80);
	for(i=0;i<64;i++)
	SendDat(0x20);
}

