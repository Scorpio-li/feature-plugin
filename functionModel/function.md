<!--
 * @Author: Li Zhiliang
 * @Date: 2021-01-25 14:03:07
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2021-01-25 14:09:09
 * @FilePath: /feature-plugin/functionModel/function.md
-->
# 一行 JS 实现功能的代码

## 1. 获取一个随机布尔值 (true/false)

```js
const randomBoolean = () => Math.random() >= 0.5;
console.log(randomBoolean());
// Result: a 50/50 change on returning true of false
```

## 2. 检查日期是否为工作日

```js
const isWeekday = (date) => date.getDay() % 6 !== 0;
console.log(isWeekday(new Date(2021, 0, 11)));
// Result: true (Monday)
console.log(isWeekday(new Date(2021, 0, 10)));
// Result: false (Sunday)
```

## 3. 反转字符串

```js

```

## 4. 检查当前 Tab 页是否在前台

```js
const isBrowserTabInView = () => document.hidden;
isBrowserTabInView();
// Result: returns true or false depending on if tab is in view / focus
```

## 5. 检查数字是否为奇数

```js
const isEven = num => num % 2 === 0;
console.log(isEven(2));
// Result: true
console.log(isEven(3));
// Result: false
```

## 6. 从日期中获取时间

```js
const timeFromDate = date => date.toTimeString().slice(0, 8);
console.log(timeFromDate(new Date(2021, 0, 10, 17, 30, 0))); 
// Result: "17:30:00"
console.log(timeFromDate(new Date()));
// Result: will log the current time
```

## 7. 保留小数点（非四舍五入）

```js
const toFixed = (n, fixed) => ~~(Math.pow(10, fixed) * n) / Math.pow(10, fixed);
// Examples
toFixed(25.198726354, 1);       // 25.1
toFixed(25.198726354, 2);       // 25.19
toFixed(25.198726354, 3);       // 25.198
toFixed(25.198726354, 4);       // 25.1987
toFixed(25.198726354, 5);       // 25.19872
toFixed(25.198726354, 6);       // 25.198726
```

## 8. 检查元素当前是否为聚焦状态

```js
const elementIsInFocus = (el) => (el === document.activeElement);
elementIsInFocus(anyElement)
// Result: will return true if in focus, false if not in focus
```

## 9. 检查浏览器是否支持触摸事件

```js
const touchSupported = () => {
  ('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch);
}
console.log(touchSupported());
// Result: will return true if touch events are supported, false if not
```

## 10. 检查当前用户是否为苹果设备

```js
const isAppleDevice = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
console.log(isAppleDevice);
// Result: will return true if user is on an Apple device
```

## 11. 滚动到页面顶部

```js
const goToTop = () => window.scrollTo(0, 0);
goToTop();
// Result: will scroll the browser to the top of the page
```

## 12. 获取所有参数平均值

```js
const average = (...args) => args.reduce((a, b) => a + b) / args.length;
average(1, 2, 3, 4);
// Result: 2.5
```

## 13. 转换华氏度/摄氏度。

```js
const celsiusToFahrenheit = (celsius) => celsius * 9/5 + 32;
const fahrenheitToCelsius = (fahrenheit) => (fahrenheit - 32) * 5/9;
// Examples
celsiusToFahrenheit(15);    // 59
celsiusToFahrenheit(0);     // 32
celsiusToFahrenheit(-20);   // -4
fahrenheitToCelsius(59);    // 15
fahrenheitToCelsius(32);    // 0
```

## 

```js

```

## 

```js

```