<!--
 * @Author: Li Zhiliang
 * @Date: 2021-01-17 10:37:00
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2021-01-17 11:16:04
 * @FilePath: /feature-plugin/project/regexRule/README.md
-->

# 正则表达式

## <input> 标签输入限制

### 文本框只能输入数字代码(小数点也不能输入)

```js
<input onkeyup="this.value=this.value.replace(/\D/g,'')"  
onafterpaste="this.value=this.value.replace(/\D/g,'')"> 
```

### 只能输入数字,能输小数点.

```js
<input onkeyup="if(isNaN(value))execCommand('undo')" onafterpaste="if(isNaN(value))execCommand('undo')"> 
<input name=txt1 onchange="
	if(/\D/.test(this.value)){
	alert('只能输入数字');
	this.value='';}"> 
```

### 数字和小数点方法二

```js
<input type=text tvalue="" ovalue="" onkeypress="
	if(!this.value.match(/^[\+\-]?\d*?\.?\d*?$/))this.value=this.t_value;
		else this.tvalue=this.value;
	if(this.value.match(/^(?:[\+\-]?\d+(?:\.\d+)?)?$/))this.ovalue=this.value" 
		onkeyup="if(!this.value.match(/^[\+\-]?\d*?\.?\d*?$/))this.value=this.t_value;
		else this.tvalue=this.value;
	if(this.value.match(/^(?:[\+\-]?\d+(?:\.\d+)?)?$/))this.ovalue=this.value" 
		onblur="if(!this.value.match(/^(?:[\+\-]?\d+(?:\.\d+)?|\.\d*?)?$/))this.value=this.o_value;
		else{if(this.value.match(/^\.\d+$/))this.value=0+this.value;
	if(this.value.match(/^\.$/))this.value=0;this.ovalue=this.value}">
```

### 只能输入字母和汉字

```js
<input onkeyup="value=value.replace(/[\d]/g,'') "
		onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[\d]/g,''))" 
		maxlength=10 name="Numbers"> 
<input onkeyup="value=value.replace(/[^\a-zA-Z\u4E00-\u9FA5]/g,'')" 		onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\a-zA-Z\u4E00-\u9FA5]/g,''))" 
		maxlength=10 name="Numbers"> 
```

### 只能输入英文字母和数字,不能输入中文

```js
<input onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"> 
```

### 只能输入数字和英文

```js
<font color="Red">chun</font> 
<input onKeyUp="value=value.replace(/[^\d|chun]/g,'')"> 
```

### 小数点后只能有最多两位(数字,中文都可输入),不能输入字母和运算符号:

```js
<input onKeyPress="
	if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d$/.test(value))
	event.returnValue=false"> 
```

### 小数点后只能有最多两位(数字,字母,中文都可输入),可以输入运算符号:

```js
<input onkeyup="this.value=this.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"> 
```

### input的type设置为number后可以输入e

```js
<input type='number' onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )' />
```

### JS控制Input输入数字和小数点后两位

```js
function clearNoNum(value) {
    value = value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符   
    value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的   
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数   
    if (value.indexOf(".") < 0 && value != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
        value = parseFloat(value);
    }
}
```

### JS校验手机号和座机号的方法

```js
function $isPhoneAvailable(str) {
    let isMob=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    let isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
    if (isPhone.test(str) || isMob.test(str)) {
        return true;
    }else {
        return false;
    }
}
```

### 常用正则表达式

```js
// 匹配邮箱
let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$

// (新)匹配手机号
let reg = /^1[0-9]{10}$/;

// (旧)匹配手机号
let reg = /^1[3|4|5|7|8][0-9]{9}$/;

// 匹配8-16位数字和字母密码的正则表达式
let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;

// 匹配国内电话号码 0510-4305211
let reg = /\d{3}-\d{8}|\d{4}-\d{7}/;

// 匹配身份证号码
let reg=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

// 匹配腾讯QQ号
let reg = /[1-9][0-9]{4,}/;

// 匹配ip地址
let reg = /\d+\.\d+\.\d+\.\d+/;

// 匹配中文
let reg = /^[\u4e00-\u9fa5]*$/;

/^\\d+$/　　//非负整数（正整数 + 0）
/^[0-9]*[1-9][0-9]*$/　　//正整数
/^((-\\d+)|(0+))$/　　//非正整数（负整数 + 0）
/^-[0-9]*[1-9][0-9]*$/　　//负整数
/^-?\\d+$/　　　　//整数
let reg = /^([^0][0-9]+|0)$/;   if (reg.test(params.xzd2BorrowRate)) {   	params.xzd2BorrowRate += '.0';   }			//整数
/^\\d+(\\.\\d+)?$/　　//非负浮点数（正浮点数 + 0）
/^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$/　　//正浮点数
/^((-\\d+(\\.\\d+)?)|(0+(\\.0+)?))$/　　//非正浮点数（负浮点数 + 0）
/^(-(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/　　//负浮点数
/^(-?\\d+)(\\.\\d+)?$/　　//浮点数
replace(/[^0-9]/ig, "")		//只保留数字
```

## JS判断字符串是否全是空格

```js
let test = "   \n   ";
if(test.match(/^\s+$/)){
    console.log("all space or \\n")
}
if(test.match(/^[ ]+$/)){
    console.log("all space")
}
if(test.match(/^[ ]*$/)){
    console.log("all space or empty")
}
if(test.match(/^\s*$/)){
    console.log("all space or \\n or empty")
}
```

## JS提取字符串中连续的数字

```js
let str = "013d1we22ewfa33rr4rwq0dsf00dsf9fas999";

let getNum = function (Str,isFilter) {
　　　//用来判断是否把连续的0去掉
    isFilter = isFilter || false;
    if (typeof Str === "string") {
        // var arr = Str.match(/(0\d{2,})|([1-9]\d+)/g);
        //"/[1-9]\d{1,}/g",表示匹配1到9,一位数以上的数字(不包括一位数).
        //"/\d{2,}/g",  表示匹配至少二个数字至多无穷位数字
        var arr = Str.match( isFilter ? /[1-9]\d{1,}/g : /\d{2,}/g);
        console.log(arr);
        return arr.map(function (item) {
            //转换为整数，
            //但是提取出来的数字，如果是连续的多个0会被改为一个0，如000---->0，
            //或者0开头的连续非零数字，比如015，会被改为15，这是一个坑
            // return parseInt(item);
            //字符串，连续的多个0也会存在，不会被去掉
            return item;
        });
    } else {
        return [];
    }
}
console.log(getNum(str));//默认不加1，即不会把提取出来的0去掉
```

## JS获取项目根目录

```js
function getRootPath(){
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath=window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht=curWwwPath.substring(0,pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    return(localhostPaht+projectName);
}
```

## JS判断小数点后几位

```js
num.toString().split(".")[1].length
```

## JS截取数字小数点后N位

### 利用math.round

```js
var original=28.453
// 保留小数点后两位
var result = Math.round(original*100)/100;  //returns 28.45
// 保留小数点后一位
var result = Math.round(original*10)/10;  //returns 28.5
```

### 利用toFixed

```js
var original=28.453
// 保留小数点后两位
var result=original.toFixed(2); //returns 28.45
// 保留小数点后一位
var result=original.toFixed(1); //returns 28.5
```


