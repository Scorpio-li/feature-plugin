<!--
 * @Author: Li Zhiliang
 * @Date: 2021-01-17 10:58:28
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2021-04-06 22:39:00
 * @FilePath: /feature-plugin/functionModel/time/README.md
-->
# 时间处理

## 当前标准时间

```js
function format(fmt) {
    const date = new Date()
    const o = {
        "Y+": date.getFullYear(),
        "M+": date.getMonth() + 1,     // 月
        "D+": date.getDate(),          // 日
        "h+": date.getHours(),         // 时
        "m+": date.getMinutes(),       // 分
        "s+": date.getSeconds(),       // 秒
        "W": date.getDay()             // 周
    }
    for (var k in o) {
       if (new RegExp("("+ k +")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, () => {
                if (k === 'W') {                                    // 星期几
                    const week = ['日', '一', '二', '三', '四', '五', '六']
                    return week[o[k]]
                } else if (k === 'Y+' || RegExp.$1.length == 1) {    // 年份 or 小于10不加0
                    return o[k]
                } else {
                    return ("00"+ o[k]).substr(("" + o[k]).length)  // 小于10补位0
                }
            })
        }
    }
    return fmt
}
format('星期W')                  // 星期日
format("YYYY-MM-DD hh:mm:ss")   // 2021-03-21 20:24:32
format("MM/DD/YYYY hh:mm")      // 03-21-2021 20:24
format("MM/DD/YYYY hh:mm")      // 03-21-2021 20:24 
format("YYYY年MM月DD日 hh:mm:ss 星期W") // 2021年03月21日 20:30:14 星期日
```

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

```js
const time = (timestemp) => {
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = month * 12;
    const diffValue = new Date().getTime() - timestemp; // 当前时间戳-原时间戳=相差时间

    // 如果本地时间小于变量时间
    if (diffValue <= 0) {
        return '现在'
    }

    // 计算差异时间的量级
    const yearC = diffValue / year;
    const monthC = diffValue / month;
    const weekC = diffValue / (7 * day);
    const dayC = diffValue / day;
    const hourC = diffValue / hour;
    const minC = diffValue / minute;

    // 从大到小排序 满足1以上即成立
    const map = {
        [yearC]: '年',
        [monthC]: "月",
        [weekC]: "周",
        [dayC]: "天",
        [hourC]: "小时",
        [minC]: "分钟",
    }
    for (let i in map) {
        if (i >= 1) {
            return `${parseInt(i)}${map[i]}前`
        }
    }
}
time(new Date().getTime()                // 现在
time(new Date('2021-1-11').getTime()     // 2月前
time(new Date('2021-2-22').getTime()     // 3周前
time(new Date('2020-3-11').getTime()     // 1年前
time(new Date('2019-3-11').getTime()     // 2年前
time(new Date(1616330071538).getTime()   // 1小时前
```

### 时间戳转换

- 获取当前时间戳

```js
new Date().getTime()    // 精确到毫秒
new Date().valueOf()    // 精确到毫秒
Date.parse(new Date())  // 精确到秒

// 第一个得到：1616330071538
```

- 转换

```js
function format(fmt, timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date()
    // ....
}
const a = format("YYYY-MM-DD hh:mm:ss")
const b = format("YYYY年MM月DD日 hh:mm:ss 周W", 1616330071538)
// a: 2021-03-21 20:48:30
// b: 2021年03月21日 20:34:31 周日
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

## 时间的范围

```js
// 第一种 很简单
function time(beginTime, endTime){
    const timeNow = new Date().getHours()
    return timeNow >= beginTime && timeNow < endTime
}
time(8, 20)

// 第二种 升级版
function times(beginTime, endTime){
    const bDate = beginTime.split(':')
    const eDate = endTime.split(':')
    
    const o = {}
    const s = ['nDate', 'bDate', 'eDate']

    for (let i of s) {
        o[i] = new Date()
        let hours, minute;
        if (i == 'nDate') {
            hours = o[i].getHours()
            minute = o[i].getMinutes()
        } else {
            const arr = i == 'bDate' ? bDate : eDate
            hours = arr[0]
            minute = arr[1] || 0
        }
        o[i].setHours(hours)
        o[i].setMinutes(minute)
    }
    // 当前、开始、结束，三者的时间戳进行对比，答案就很清晰明了
    return o.nDate.getTime() - o.bDate.getTime() > 0 && o.nDate.getTime() - o.eDate.getTime() < 0
}
// 两种都支持
console.log(times('8', '22'))
console.log(times('8:30', '22:54')) // 例如：客服上班时间（08:00-20:00）（08:30-20:30）
```

## 前后七天日期

```js
// 后七天日期
function getAfterDate(){
    let date = new Date().getTime(), 
        result = [], 
        newDate, 
        month, 
        day;
    for (let i = 1; i < 8; i++) {
        newDate = date + i * 24 * 60 * 60 * 1000
        month = new Date(newDate).getMonth() + 1
        day = new Date(newDate).getDate()
        result.push(month + '-' + day)
    }
    return result
}
// ['3-23', '3-24', '3-25', '3-26', '3-27', '3-28', '3-29']
```

```js
// 前七天日期
function getBeforeDate(){
    let date = new Date().getTime(), 
        result = [], 
        newDate, 
        month, 
        day;
    for (let i = 7; i > 0; i--) {
        newDate = date - i * 24 * 60 * 60 * 1000
        month = new Date(newDate).getMonth() + 1
        day = new Date(newDate).getDate()
        result.push(month + '-' + day)
    }
    return result
}
// ['3-15', '3-16', '3-17', '3-18', '3-19', '3-20', '3-21']
```

- 是否七天内日期

```js
/**
 * @param {String} tcimestamp => '2020-05-08 19:46'
 */
function a (timestamp) {
    timestamp = new Date(timestamp).getTime()
    const endTime = 24 * 60 * 60 * 1000 * 7
    const currentTime = new Date().setHours(0, 0, 0, 0)
    return currentTime <= timestamp && currentTime + endTime > timestamp
}

console.log(a('2021-3-23')) // true
console.log(a('2021-3-29')) // true
console.log(a('2021-3-30')) // false
```

## 无敌且文艺、随意搭配

```js
/**
 * @param {String} tcimestamp => '2020-05-08 19:46'
 */
function dateFormat(timestamp) {
    const w = new Date(timestamp).getDay()  // 获取周

    // 解析时间为数组
    timestamp = timestamp.toString().replace(/-|\:|\/|\ /g, ',').split(',')
    
    const week = ['日', '一', '二', '三', '四', '五', '六']
    const month = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
    const weekEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const monthEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    const opt = ['Y', 'M', 'D', 'h', 'm', 'W'].reduce((t, v, i) => {
        t[v] = v === 'W' ? w : timestamp[i]
        return t
    }, {})

    // 日
    let st = 'st',
        nd = 'nd',
        rd = 'rd',
        th = 'th',
        obj = {
            1: st,
            2: nd,
            3: rd,
            21: st,
            22: nd,
            23: rd,
            31: st
        };

    let day = opt.D + (obj[opt.D] ? obj[opt.D] : th)
    day = day.startsWith(0) ? day.slice(1) : day    // 去除前面的0

    const time = {
        date: `${opt.Y}/${opt.M}/${opt.D} ${opt.h}:${opt.m}`,
        time: `${opt.h}:${opt.m}`,
        year: opt.Y,
        month: {
            on: opt.M,
            cn: month[Number(opt.M) - 1],
            en: monthEn[Number(opt.M) - 1]
        },
        day: {
            on: opt.D,
            en: day
        },
        week: {
            on: week[opt.W],
            en: weekEn[opt.W]
        }
    }
    return time
}
console.log(dateFormat('2020-05-08 19:46'))
```

```json
{
    date: '2020/05/30 19:46',
    time: '19:46',
    year: '2020',
    month: { on: '05', cn: '五', en: 'May' },
    day: { on: '08', en: '8th' },
    week: { on: '五', en: 'Friday' }
}
```