<!--
 * @Author: Li Zhiliang
 * @Date: 2021-03-01 17:48:08
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2021-03-02 13:57:02
 * @FilePath: /feature-plugin/project/dataType.md
-->
# 数据类型

JavaScript 数据类型分为 基础数据类型和引用数据类型

其中基础数据类型有：undefined、Null、Boolean、Number、 String、Symbol、BigInt

引用数据类型（Object）有：RegExp、Math、Date、Function、Array

- 基础数据类型存储在 **栈内存 ，**在被引用或者拷贝的事就，会创建一个完全相等的变量；

- 引用类型存储在**堆内存，**存储的是地址，多个应用指向同一个地址时会相互引用。

![](https://cdn.jsdelivr.net/gh/Scorpio-li/picture/document/jimi/data-memory.png)

![](https://cdn.jsdelivr.net/gh/Scorpio-li/picture/document/jimi/datatype.png)

## 数据类型检测

对于数据类型的检测一般有 typeof 、instanceof 等

1. typeOf 会返回一个字符串，表示未经计算的操作数类型。

```js
typeof 1 // number
typeof '1' // string
typeof null // Object
typeof undefined // undefined
typeof true // Boolean
typeof {} // Object
typeof []; // Object
typeof Symbol() // Symbol
typeof function f() {} // function
```

如上图所示：typeof 可以判断出 undefined、Boolean、Number、 String、Symbol 等数据类型，但是 null 的 typeof 是 Object ,这是 js 中 的一个 bug ，并不表示 null  就是引用类型，并且 null 本身也不是对象。因此 typeof 判断 null  返回的结果是有问题的，一定要注意，不能作为判断 null  的方法。

引用类型的数据，用  typeof 来判断的话，除了 function 是 OK 的，其他的都是 Object，是无法判断出来的。

2. instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例的原型链上。

当我们 new 一个对象的时候，那么这个新的对象就是在它原型链上面的对象了，通过 instanceof 我们能够去判断这个对象是否是之前那个构造函数生成的对象，这样基本上就可以判断出这个新对象的数据类型。

```js
const p = new Person();
console.log(p instanceof Person); // true
const str = '1111';
console.log(str instanceof String); // false
const str1 = new String('456');
console.log(str1 instanceof String); // true
console.log([] instanceof Array); // true
console.log([] instanceof Object); // true
```

自己实现一个 instanceof

```js
function _instanceof(left, right) {
    // 1. 首先判断 left 是不是基础数据类型，如果是基础数据类型，直接返回 false
    if (typeof left !== 'object' || typeof left === null) {
        return false;
     } 
    // 2. 获取 left 的 proto  
    // const leftProto = left.__proto__; 
    const leftProto = Object.getPrototypeOf(left); 
    while (true) {
        // 3. 如果 leftProto 为 null，说明 left 为 Object.prototype , leftProto 就找到了原型链的末端，还未找到，直接发返回false
        if (leftProto === null) {
            return false;
        } 
        if (leftProto === right.prototype) {
            return true;
         }
        // 4. 如果没有找到，继续往原型链上层搜寻
        leftProto = Object.getPrototypeOf(leftProto);  
    }
}
```

![](https://cdn.jsdelivr.net/gh/Scorpio-li/picture/document/jimi/object-prototype.jpeg)

- 下面总结一下 typeof 和 instanceof 的区别
    
    1. instanceof 可以 准确的判断复杂引用数据类型，但是不能准确的判断基础数据类型
    
    2. typeof 虽然可以判断基础数据类型（null 除外）,但是引用类型数据 中除了 function 外，其他的不能判断。

3. Object.prototype.toSring,该方法返回一个表示该对象的字符串。

每个对象都有一个 toString() 方法，当该对象被表示为一个文本值时，或者一个对象以预期的字符串方式引用时自动调用。默认情况下，toString() 方法被每Object 对象继承。如果此方法在自定义对象中未被覆盖，toString()返回 "[object type]"，其中 type 是对象的类型。

```js
function getObjectType(obj) {
    // 判断是否是基础类型 
    if (typeof obj !== 'object') {
        return typeof obj;
    } 
    // 对于typeof返回结果是object的，再进行如下的判断，正则返回结果  
    return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1');
}
```

## 数据类型转换规则总结

### 其它类型（原始值）转换为Object

使用Object([value])

### 其它数据类型转换为Boolean

统一遵循以下规则：只有**0、NaN、null、undefined、''**（空字符串）这五个值会变为false，其余都是转换为true
转换方法：

- Boolean([value])

- !![value]

- ![value] 转换为布尔类型取反

- 条件判断  例如：if(1){}，括号中的条件会转换

注意：

- A||B，A&&B不会转换，返回值是A或B中的一个

- 还有全等的等号两边不会转换，等号两边只是为了判断两个值是否相等

```js
console.log(!![])//true
console.log(!!-1)//true
```

### 把其它数据类型转换为String

分为显示转换和隐式转换。

显示转换使用String方法，隐式转换是+号运算，+号两边有一边出现字符串，就会把另一边也转换为字符串并且拼接

以上两种方法在转换时都遵循以下规则：

- 如果是原始值转换则是相当于直接用引号包起来（注意： Bigint会去除n）

- 如果是对象转换则比较特殊，下面详细说

#### 原始值转换

规则：原始值转换是直接用引号包起来（注意： Bigint会去除n） 使用String方法

```js
String(1)//"1"
String(false)//"false"
String(null)//"null"
String(undefined)//"undefined"
String(Symbol(1))//"Symbol(1)"
String(12312312312323534523423423n)//"12312312312323534523423423"
```

使用+拼接

```js
1+''//"1"
false+''//"false"
null+''//"null"
undefined+''//"undefined"
Symbol(1)+''//"Symbol(1)"
12312312312323534523423423n+''//"12312312312323534523423423"
```

> 注意： Bigint会去除n

#### 对象转换

规则：不是所有对象都是字符串拼接

- 先去调取对象的 Symbol.toPrimitive 属性值，如果没有这个属性

- 再去调取对象的valueOf() 获取原始值，如果不是原始值

- 再去调用对象的 toString() 转换为字符串「如果是想转换为数字，则还会调用Number处理」

```js
console.log(10 + [10, 20]);  //->"1010,20"
```

### 其他类型转化为Number

分为Number()型和parser型转换

- Number([val])

- parseInt([val])/parseFloat（[val]）

#### Number()型转换

可以直接手动调用Number([val])进行转换，也可用于隐式转换。

隐式转换有以下几种情况会调用Number()

- isNaN([val])

- 数学运算+ - * / %（特殊情况：+在出现字符串的情况下不是数学运算，是字符串拼接）

- 在==比较的时候，有些值需要转换为数字再进行比较

Number()的转换机制如下

- 字符串->数字 ： ''（空字符串）变为0，字符串中只要出现非有效数字字符结果就是NaN

- 布尔->数字 ： true变为1  false变为0

- null->数字： 0

- undefined->数字：NaN

- Symbol->数字：报错

- BigInt->数字：正常转换

- 对象遵循 Symbol.toPrimitive=>valueOf=>toString=>Number 的规则，会先经过前三步转化为字符串，再调用Number方法

```js
Number('')//0
+''//0
-""//-0
*''// Uncaught SyntaxError: Unexpected token '*'
1*''//0
1/''//Infinity

Number('1xxx')//NaN

+true//1
-true//-1
+false//0
-false//-0
Number(true)//1

Number(null)//0
Number(undefined)//NaN
+null//0
+undefined//NaN

Symbol(1)+1//Uncaught TypeError: Cannot convert a Symbol value to a number

Number(182391823798473394859034n)//1.8239182379847338e+23
Number(BigInt(10))//10
182391823798473394859034n+1//Uncaught TypeError: Cannot mix BigInt and other types, use explicit conversions

182391823798473394859034n+1n//182391823798473394859035n
```

#### parser型转换

parseInt([val])/parseFloat（[val]）

parseInt机制：先转化为字符串，从字符串左侧第一个字符开始，查找有效数字字符，遇到非有效数字字符就停止查找，不论后面是否还有数字字符，都不再找了，把找到的有效数字字符转换为数字，如果一个都没找到，结果就是NaN.parseFloat会多识别一个小数点

```js
parseInt('')//NaN
Number('')//0
isNaN('') //false   isNaN(0)
parseInt(null) //NaN
Number(null)// 0
isNaN(null)false   isNaN(0)
parseInt('12px')//12
Number('12px')//NaN
isNaN('12px')//true
```

### JS中验证两个值是否相等

1. ==：相等

如果两边的类型不一样，首先会隐式转化为相同的类型，然后再做比较，规则如下（注意，只有==左右不一样才会进行转换，===类型不一样直接就是false）

2. ===：绝对相等

「要求两边的类型和值都要相等 例如：switch case」

3. Object.is([val],[val])




