
#include "WS2811.h"
	
unsigned long WsDat[nWs];   //�Դ�
unsigned long WsDat_RUN[nWs];   //��ˮ���Դ�


/**************************************************
* IO��ʼ������ֲʱ���޸ģ�
***************************************************/
void WS_GPIO_Init(int instance, int GPIO_Pin_x)
{
	GPIO_QuickInit(instance, GPIO_Pin_x, GPIO_Mode_Out_PP);
}

/**************************
* �ڲ���ʱ
***************************/

void WS_delay_us(__IO u32 nCount)	 //�򵥵���ʱ����
{
	for(; nCount != 0; nCount--);
} 

void WS_delay2us()
{
	unsigned char i;
	for(i=0; i<11; i++);
}

void WS_delay05us()
{
//	unsigned char i;
//	for(i=0; i<1; i++);
}

void WS_delay_ms(uint32_t nms)
{	
	while(nms--)
	{
	  WS_delay_us(1670);	//��ͨ��ʽ��ʱ 		
	}
}


/***************************
* ����һ����
****************************/
void TX0(GPIO_TypeDef *GPIOx,uint16_t GPIO_Pin)    	// ����0	
{
	GPIO_SetBits(GPIOx, GPIO_Pin); 
    WS_delay05us();
	GPIO_ResetBits(GPIOx, GPIO_Pin);
	WS_delay2us();
} 
void TX1(GPIO_TypeDef *GPIOx,uint16_t GPIO_Pin) 	  // ����1	
{ 							 	
	GPIO_SetBits(GPIOx, GPIO_Pin); 
	WS_delay2us();
	GPIO_ResetBits(GPIOx, GPIO_Pin);
	WS_delay05us();
} 
void WS_Reset(GPIO_TypeDef *GPIOx,uint16_t GPIO_Pin)   //��λ
{
	GPIO_ResetBits(GPIOx, GPIO_Pin); 
	WS_delay_us(50); 
	GPIO_SetBits(GPIOx, GPIO_Pin);
	GPIO_ResetBits(GPIOx, GPIO_Pin); 
}

/************************************************
* ��������
*************************************************/
void WS_Set1(GPIO_TypeDef *GPIOx,uint16_t GPIO_Pin,unsigned long dat)
{
	unsigned char i;	
	for(i=0; i<24; i++)
	{
		if(0x800000 == (dat & 0x800000) )	
			TX1(GPIOx,GPIO_Pin);
		else								
			TX0(GPIOx,GPIO_Pin);
		dat<<=1;        //����һλ
	}
}


void WS_Set_Date(GPIO_TypeDef *GPIOx,uint16_t GPIO_Pin,unsigned char len,unsigned long dat) // ȫ������ͬ��������
{
   unsigned char i;
   for(i = 0; i <len; i++)
   {
		WS_Set1(GPIOx,GPIO_Pin,dat);	
   }
	WS_Reset(GPIOx,GPIO_Pin);
}


void WS_SetAll(GPIO_TypeDef *GPIOx,uint16_t GPIO_Pin)   //���������ֽ�
{
	unsigned char i;
	
	for(i=0;i<nWs;i++)
	{
		WS_Set1(GPIOx,GPIO_Pin,WsDat_RUN[i]);  
	}
	WS_Reset(GPIOx,GPIO_Pin);
	WS_delay_ms(500);	
}



/**************************��ɫ���亯��***************************/
/*
����ʼ��ɫ---������ɫ
*/
unsigned char abs0(int num)//�����ֵ
{
	if(num>0) return num;
	
	num = -num;
	return (unsigned char) num;
}

unsigned long WS_SET_ColorToColor(GPIO_TypeDef *GPIOx,uint16_t GPIO_Pin,unsigned long color0, unsigned long color1,unsigned int speed)  
{
	unsigned char Red0, Green0, Blue0;  // ��ʼ��ԭɫ
	unsigned char Red1, Green1, Blue1;  // �����ԭɫ
	int			  RedMinus, GreenMinus, BlueMinus;	// ��ɫ�color1 - color0��
	unsigned char NStep; 							// ��Ҫ����
	float		  RedStep, GreenStep, BlueStep;		// ��ɫ����ֵ
	unsigned long color;							// ���ɫ
	unsigned char i;
	
	// �� �� �� ��ԭɫ�ֽ�
	Red0   = color0>>8;
	Green0 = color0>>16;
	Blue0  = color0;
	
	Red1   = color1>>8;
	Green1 = color1>>16;
	Blue1  = color1;
	
	// ������Ҫ���ٲ���ȡ��ֵ�����ֵ��
	RedMinus   = Red1 - Red0; 
	GreenMinus = Green1 - Green0; 
	BlueMinus  = Blue1 - Blue0;
	
	//�ж���������ֵ��С����a>bΪ�棬��=a������=b
	NStep = ( abs0(RedMinus) > abs0(GreenMinus) ) ? abs0(RedMinus):abs0(GreenMinus); 
	NStep = ( NStep > abs0(BlueMinus) ) ? NStep:abs0(BlueMinus);
	
	// �������ɫ����ֵ
	RedStep   = (float)RedMinus   / NStep;
	GreenStep = (float)GreenMinus / NStep;
	BlueStep  = (float)BlueMinus  / NStep;
	
	// ���俪ʼ
	for(i=0; i<NStep; i++)
	{
		Red1   = Red0   + (int)(RedStep   * i);
		Green1 = Green0 + (int)(GreenStep * i);
		Blue1  = Blue0  + (int)(BlueStep  * i);
		
		color  = Green1<<16 | Red1<<8 | Blue1; 	// �ϳ�  �̺���
		
		WS_Set_Date(GPIOx,GPIO_Pin,nWs,color); //������ɫ�����еƴ�ͬɫ
		WS_delay_ms(speed);
	}
	return color;
}


/*************�����****************
000000000000000000000000
111100000000000000000000
000011110000000000000000
000000001111000000000000
111100000000111100000000
000011110000000011110000
***********************************/
void WS_Set_Color(GPIO_TypeDef *GPIOx,uint16_t GPIO_Pin,unsigned long color) //��ʼ���Դ�����
{
	unsigned char i;
	for(i=0;i<50;i++)
		WsDat_RUN[i]=color;
	WS_SetAll(GPIOx,GPIO_Pin);
}

//��ڲ���     color----speed----temp
//            ��ʾ��ɫ--��ˮ�ٶ�--�������
void RUN_LED(GPIO_TypeDef *GPIOx,uint16_t GPIO_Pin,unsigned long color,unsigned int speed,unsigned char temp)//�����
{
	unsigned char i,j;
	for(j=0;j<(nWs-1);j++)
	{
		for(i=nWs;i>0;i--)
			WsDat_RUN[i] = WsDat_RUN[i-1];
		
		if(j%temp == 0)
			WsDat_RUN[0] = color;		
		else
			WsDat_RUN[0] = Black;
		
		//WS_Set_Date(GPIO_PIN,nWs,WsDat_RUN[i]); 
		WS_SetAll(GPIOx,GPIO_Pin);
		WS_delay_ms(speed);
	}
}



