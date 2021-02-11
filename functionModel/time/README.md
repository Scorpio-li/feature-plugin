<!--
 * @Author: Li Zhiliang
 * @Date: 2021-01-17 10:58:28
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2021-01-17 10:58:28
 * @FilePath: /feature-plugin/functionModel/time/README.md
-->
# 时间处理

## 计算时间戳

```js
let date1=new Date();  //开始时间  
let date2=new Date();    //结束时间  
let date3=date2.getTime()-date1.getTime()  //时间差的毫秒数  
------------------------------------------------------------
//计算出相差天数  
var days=Math.floor(date3/(24*3600*1000))   
//计算出小时数   
var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数  
var hours=Math.floor(leave1/(3600*1000))  
//计算相差分钟数  
var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数  
var minutes=Math.floor(leave2/(60*1000))  
//计算相差秒数  
var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数  
var seconds=Math.round(leave3/1000)  
alert(" 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒")
```

## 倒计时处理

- moment.js

```js
        /**
            * 基于moment.js 实现的倒计时计算
            * @param endTime {String,Date} - 倒计时结束时间
            * @param maxUnit {String} - [maxUnit = "year"] 最大单位
            * @param startTime {String,Date} - 倒计时开始时间，默认为当前时刻
            * @return {Object}  - 计算完成后返回的年月日时分秒数值
         */
        function countDownTime(endTime, maxUnit = "year", startTime) {
            let aUnitArr = ["year", "month", "day", "hour", "minute", "second"]
            let iMaxIndex = aUnitArr.indexOf(maxUnit);
            let end = moment(endTime);
            let start = moment(startTime);
            let result = {}
            if (start - end > 0) {
                throw new Error("开始时间不能晚于结束时间")
            }
            //过滤掉大于最大单位的单位
            aUnitArr = aUnitArr.filter((item, index) => index >= iMaxIndex)
            result[maxUnit] = end.diff(start, maxUnit);
            if (aUnitArr.length > 1) {
                aUnitArr.reduce((previous, current) => {
                    // 结束时间不断减去高位单位时间
                    end = end.subtract(result[previous], previous);
                    result[current] = end.diff(start, current);
                    return current
                });
            }
            return result
        };
```

- 原生js实现

```js
        function countDownTime2(endTime, maxUnit = "year", startTime) {
            let end = new Date(endTime);
            let start = startTime ? new Date(startTime) : new Date();
            if (start - end > 0) {
                throw new Error("开始时间不能晚于结束时间")
            }
            let aUnitArr = [
                {
                    value: "second",
                    interval: 60,
                    secNum: 1 //该单位有多少秒，计算该单位最大差值用到
                },
                {
                    value: "minute",
                    interval: 60,
                    secNum: 60
                },
                {
                    value: "hour",
                    interval: 24,
                    secNum: 60 * 60
                },
                {
                    value: "day",
                    secNum: 60 * 60 * 24
                },
                {
                    value: "month",
                    interval: 12
                },
                {
                    value: "year",
                },
            ]
            let endList = getTimeList(end);
            let startList = getTimeList(start);
            const iMaxIndex = aUnitArr.findIndex(item => maxUnit === item.value);
            // 当最大单位为日时分秒时过滤。月份最大单位需根据年份反算所以不能过滤掉年份
            if (iMaxIndex > -1 && iMaxIndex < 4) {
                aUnitArr = aUnitArr.filter((item, index) => index <= iMaxIndex);
            }
            let result = {};
            aUnitArr.forEach((item, index) => {
                if (index === iMaxIndex && iMaxIndex < 4) {
                    result[item.value] = Math.floor((end - start) / item.secNum / 1000);
                    return
                }
                if (endList[index] - startList[index] >= 0) {
                    result[item.value] = endList[index] - startList[index];
                } else {
                    endList[index + 1]--;
                    result[item.value] = item.value === "day" ? 
                    	countDiffDays(start, startList[index], endList[index]) : endList[index] + item.interval - startList[index];
                }
            })
            // 最大单位是月份时特殊处理
            if (maxUnit === "month") {
                result.month += result.year * 12
                delete result.year
            }
            return result;
        }
        function getTimeList(t) {
            return [t.getSeconds(), t.getMinutes(), t.getHours(), t.getDate(), t.getMonth() + 1, t.getFullYear()];
        }
        // 计算日期差值。开始时间本月剩余天数+结束时间当月日期数
        function countDiffDays(time, startDay, endDay) {
            let curDate = new Date(time);
            let curMonth = curDate.getMonth();
            /* 这里将时间设置为下个月之前，需要把日期设置小一点，否则极端情况，如果当天日期大于下一个月的总天数，月份会设置为下下个月 */
            curDate.setDate(1)
            curDate.setMonth(curMonth + 1);
            curDate.setDate(0);//日期设置为前一个月的最后一天
            let restDays = curDate.getDate() - startDay;
            return restDays + endDay;
        };
```