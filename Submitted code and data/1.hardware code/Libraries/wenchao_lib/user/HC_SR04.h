#ifndef _HC_SR04_H_
#define _HC_SR04_H_

#include "sysinc.h"

#define HC_SR04_TIMERX TIM4

#define TRIG PAout(6)     //需要在初始化函数中修改GPIO初始化
#define ECHO PAin(7)

//获取超声波距离可能最长会阻塞程序50ms

#define MEDIAN_FILTER_LEN 3   //中值滤波采样长度


void hc_sr04_init(void);
u16 get_hc_sr04_value(void);
u16 get_hc_sr04_value_by_median_filter(void);  //中值滤波后得到超声波测得距离

#endif
