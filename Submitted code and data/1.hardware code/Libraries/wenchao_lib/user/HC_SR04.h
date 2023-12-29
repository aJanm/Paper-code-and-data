#ifndef _HC_SR04_H_
#define _HC_SR04_H_

#include "sysinc.h"

#define HC_SR04_TIMERX TIM4

#define TRIG PAout(6)     //��Ҫ�ڳ�ʼ���������޸�GPIO��ʼ��
#define ECHO PAin(7)

//��ȡ������������������������50ms

#define MEDIAN_FILTER_LEN 3   //��ֵ�˲���������


void hc_sr04_init(void);
u16 get_hc_sr04_value(void);
u16 get_hc_sr04_value_by_median_filter(void);  //��ֵ�˲���õ���������þ���

#endif