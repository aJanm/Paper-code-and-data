# include "adc_dma.h"
//https://blog.csdn.net/qq_52487856/article/details/119425241    参考链接
//u16 ADC_convered[2]={0,0};
//2022年10月13日
u16 ADC_convered[4]={0,0,0,0};

static void ADC_GPIO_CONFIG(void)
{
    GPIO_InitTypeDef GPIO_InitStructure;
 
	RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA |RCC_APB2Periph_ADC1	, ENABLE );	//使能ADC1通道时钟
	//PA4和5 作为模拟通道输入引脚                         
	GPIO_InitStructure.GPIO_Pin = GPIO_Pin_4;
	GPIO_InitStructure.GPIO_Pin = GPIO_Pin_5;//初始化两个GPIO
	//2022年10月13日，
	
	GPIO_InitStructure.GPIO_Pin = GPIO_Pin_6;
	GPIO_InitStructure.GPIO_Pin = GPIO_Pin_7;//初始化两个GPIO
	
	GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AIN;		//模拟输入引脚
	GPIO_Init(GPIOA, &GPIO_InitStructure);	
}

static void ADC_MODE_CONFIG_(void)
{ 	
// ADC的输入时钟不得超过14MHz，它是由PCLK2经分频产生。	
	DMA_InitTypeDef DMA_InitInstructure;
	RCC_AHBPeriphClockCmd(RCC_AHBPeriph_DMA1,ENABLE);
	DMA_DeInit(DMA1_Channel1);//复位
	DMA_InitInstructure.DMA_PeripheralBaseAddr =(u32)(&(ADC1->DR));//配置外设的基址，取adc 数据寄存器的地址
	DMA_InitInstructure.DMA_MemoryBaseAddr = (u32)ADC_convered;//把DMA的数据存入数组
	DMA_InitInstructure.DMA_DIR = DMA_DIR_PeripheralSRC;//外设到DMA
	//DMA_InitInstructure.DMA_BufferSize = 2;//2个通道
	//2022年10月13日
	DMA_InitInstructure.DMA_BufferSize = 4;//4个通道
	DMA_InitInstructure.DMA_PeripheralInc = DMA_PeripheralInc_Disable;//
	DMA_InitInstructure.DMA_MemoryInc = DMA_MemoryInc_Enable;
	DMA_InitInstructure.DMA_PeripheralDataSize = DMA_PeripheralDataSize_HalfWord;
	DMA_InitInstructure.DMA_MemoryDataSize = DMA_MemoryDataSize_HalfWord;
	DMA_InitInstructure.DMA_Mode = DMA_Mode_Circular;//不断地传输，有数据就传输
	DMA_InitInstructure.DMA_Priority = DMA_Priority_High;//DMA优先级
	DMA_InitInstructure.DMA_M2M = DMA_M2M_Disable;
	DMA_Init(DMA1_Channel1,&DMA_InitInstructure);
	DMA_Cmd(DMA1_Channel1,ENABLE);//使能DMA请求

	ADC_InitTypeDef ADC_InitStructure; 
	ADC_DeInit(ADC1);  //复位ADC1,将外设 ADC1 的全部寄存器重设为缺省值
	ADC_InitStructure.ADC_Mode = ADC_Mode_Independent;	//ADC工作模式:ADC1和ADC2工作在独立模式
	ADC_InitStructure.ADC_ScanConvMode = ENABLE;	//模数转换工作在多通道模式
	ADC_InitStructure.ADC_ContinuousConvMode = ENABLE;	//模数转换工作在连续转换模式
	ADC_InitStructure.ADC_ExternalTrigConv = ADC_ExternalTrigConv_None;	//转换由软件而不是外部触发启动
	ADC_InitStructure.ADC_DataAlign = ADC_DataAlign_Right;	//ADC数据右对齐
	
	
	//ADC_InitStructure.ADC_NbrOfChannel = 2;	//顺序进行规则转换的ADC通道的数目
	//2022年10月13日
	ADC_InitStructure.ADC_NbrOfChannel = 4;	//顺序进行规则转换的ADC通道的数目
	
	
	ADC_Init(ADC1, &ADC_InitStructure);	//根据ADC_InitStruct中指定的参数初始化外设ADCx的寄存器   
 
 
 
 // https://blog.csdn.net/wsq_666/article/details/108828260
	RCC_ADCCLKConfig(RCC_PCLK2_Div6);   //设置ADC分频因子6 72M/6=12,ADC最大时间不能超过14M
		//设置指定ADC的规则组通道，一个序列，采样时间
		//数字1和2表示优先级，数字越小，优先级越大
		//注意，ADC_Channel_4和5要和对应的引脚PA4和PA5对应
		//PA4是因为前面设置了GPIOA和GPIO_Pin = GPIO_Pin_4;
		//根据以上的链接中的图片，ADC1中的通道4和5对应的PA4和PA5.
	ADC_RegularChannelConfig(ADC1, ADC_Channel_4,1, ADC_SampleTime_239Cycles5 );	 
  //ADC1,ADC1通道1,采样时间为239.5周期
	ADC_RegularChannelConfig(ADC1, ADC_Channel_5,2, ADC_SampleTime_239Cycles5 );	 
  //ADC1,ADC1通道2,采样时间为239.5周期
		 
	//2022年10月13日
	ADC_RegularChannelConfig(ADC1, ADC_Channel_6,3, ADC_SampleTime_239Cycles5 );	 
  //ADC1,ADC1通道1,采样时间为239.5周期
	ADC_RegularChannelConfig(ADC1, ADC_Channel_7,4, ADC_SampleTime_239Cycles5 );	 
  //ADC1,ADC1通道2,采样时间为239.5周期
	
 
  ADC_DMACmd(ADC1,ENABLE);	
  ADC_Cmd(ADC1,ENABLE);
 
	
	ADC_ResetCalibration(ADC1);	//使能复位校准  
	 
	while(ADC_GetResetCalibrationStatus(ADC1));	//等待复位校准结束
	
	ADC_StartCalibration(ADC1);	 //开启AD校准
 
	while(ADC_GetCalibrationStatus(ADC1));	 //等待校准结束
	
	ADC_SoftwareStartConvCmd(ADC1, ENABLE);		//使能指定的ADC1的软件转换启动功能	
	 
	//while(!ADC_GetFlagStatus(ADC1, ADC_FLAG_EOC ));//等待转换结束
 
 
}				  

void Adc_dma_Init()
{
   ADC_GPIO_CONFIG();
   ADC_MODE_CONFIG_();
}