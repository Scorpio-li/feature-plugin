# 实现循环遍历的放大

## 原生JS

### 1. While

While 语句包括一个循环条件和一段代码块，只要条件为真，就不断循环执行代码块。

```js
while (条件) { 执行代码; }; 
```

### 2. do...While

do...while 循环与 while 循环类似，唯一的区别就是先运行一次循环体，然后判断循环条件。

```js
do { 
    执行代码; 
} while (条件);
```

### 3. for

普通 for 循环，经常用的数组遍历。使用临时变量，将长度缓存起来，避免重复获取数组长度，当数组较大时优化效果才会比较明显。

```js
for(j = 0; j < arr.length; j++) {
    // 代码执行
}
```

### 4. for ... in

for…in 循环一般用于对象的遍历，不适用于遍历数组。

> 有一个坑需要注意： 任何对象都继承了Object对象，或者其它对象，继承的类的属性是默认不可遍历的，for... in 循环遍历的时候会跳过，但是这个属性是可以更改为可以遍历的，那么就会造成遍历到不属于自身的属性。

```js
var obj = {a: 1, b: 2, c: 3}; 

for (var i in obj) { 
    console.log('键名：', i); 
    console.log('键值：', obj[i]); 
} 
// 键名：a 键值：1 键名：b 键值：2
// 其中 obj为循环的对象， i 为对象中的“键名”。如果对象是数组，那么i就是索引。
```

如果继承的属性是可遍历的，那么就会被for...in循环遍历到。但如果只想遍历自身的属性，使用for...in的时候，应该结合使用hasOwnProperty() 方法，在循环内部判断一下，某个属性是否为对象自身的属性。否则就可以产生遍历失真的情况。

> 遍历数组的缺点：数组的下标 index 值是数字，for-in遍历的 index值"0","1","2"等是字符串。

### 5. for ... of

```js
for( let i of arr){
    console.log(i);
}
```

for...of 循环不仅支持数组，还支持大多数类数组对象，也支持字符串遍历。 for...of 它可以正确响应 break、continue 和 return 语句。

### 6. forEach

数组自带的循环，主要功能是遍历数组，实际性能比for还弱。

```js
arr.forEach(function(item, index){
  console.log('forEach遍历:' + index + '--' + item);
})
```

> forEach 不能使用 break 语句中断循环，也不能使用 return 语句返回到外层函数。

### 7. map()

map() 方法将数组的所有成员依次传入参数函数，然后把每一次的执行结果组成一个新数组返回。

```js
arr.map(function(value, index){
    console.log('map遍历:' + index + '--' + value);
});	 
// map遍历支持使用return语句，支持return返回值
var temp = arr.map(function(val, index){
  console.log(val); 
  return val * val;          
})
console.log(temp);
```

> 注意：map() 是返回一个新数组，而不会改变原数组。

### 8. filter()

filter() 方法用于过滤数组成员，满足条件的成员组成一个新数组返回。它的参数是一个函数，所有数组成员依次执行该函数，返回结果为true的成员组成一个新数组返回。该方法不会改变原数组。

```js
var arr = [73, 84, 56, 22, 100];
var newArr = arr.filter(item => item>80)
// 得到新数组 newArr = [84, 100],原数组arr没有改变。
```

### 9. every()

every() 是对数组中的每一项运行指定函数来判断数组成员是否符合某种条件，如果该函数对每一项返回true，则返回true。

```js
var arr = [ 1, 2, 3, 4, 5, 6 ]; 
arr.every( function( item, index, array ){ 
    return item > 3; 
}); 
// false
```

### 10. some()

some() 与上面得 every() 相反，如果该函数对任一项返回 true，则整个 some() 方法的返回值就是 true，否则返回 false。

```js
var arr = [ 1, 2, 3, 4, 5, 6 ]; 
arr.every( function( item, index, array ){ 
    return item > 3; 
}); 
// true
```

> 两者比较，some() 只要有一个是 true，便返回 true；而 every() 只要有一个是 false，便返回 false。

### 11. reduce() 和 reduceRight()

reduce() 方法和 reduceRight() 接收一个函数作为累加器，函数有四个参数，分别是：上一次的值，当前值，当前值的索引，数组。

它们的差别是，reduce() 是从左到右处理（从第一个成员到最后一个成员），reduceRight() 则是从右到左（从最后一个成员到第一个成员），其他完全一样。

```js
var total = [0, 1, 2, 3, 4];
// 这四个参数之中，只有前两个是必须的，后两个则是可选的。
total.reduce(function( previousValue, currentValue){
    return previousValue + currentValue;
});
//  如果要对累积变量指定初值，可以把它放在reduce方法和reduceRight方法的第二个参数。
total.reduce(function( a, b){
    return a + b;
}, 10);
// 上面的第二个参数相当于设定了默认值，处理空数组时尤其有用，可避免一些空指针异常。
```

### 12. find()

find() 方法返回数组中符合函数条件的第一个元素。否则返回 undefined。

```js
var stu = [{ name: '张三', }, { name: '王小毛', }, { name: '李四', age: 18}]
stu.find((item) => (item.name === '李四')) 
// {name: "李四", age: 18}
```

### 13. findIndex()

对于数组中的每个元素，findIndex() 方法都会调用一次回调函数（采用升序索引顺序），直到有元素返回 true。只要有一个元素返回 true，findIndex() 立即返回该返回 true 的元素的索引值。如果数组中没有任何元素返回 true，则 findIndex() 返回 -1。

findIndex() 不会改变数组对象。

```js
[1,2,3].findIndex(x => x === 2 );  // 1
[1,2,3].findIndex(x => x === 4 );  // -1
```

### 14. ES6 新增：entries()，keys() 和 values()

entries()，keys() 和 values() —— 用于遍历数组。它们都返回一个遍历器对象，可以用 for...of 循环进行遍历。

唯一的区别是 keys() 是对 键名 的遍历、values()是对 键值 的遍历，entries() 是对 键值对 的遍历。

```js
// keys() 键名 的遍历
for (let i of ['a', 'b'].keys()) {
    console.log(i);  // 0  1
}
// values() 键值 的遍历
for (let item of ['a', 'b'].values()) {
    console.log(item);  // a  b
}
// entries() 键值对 的遍历
for (let [index, item] of ['a', 'b'].entries()) {
    console.log(index, item);
    // 0 "a"    1 "b"
}
```

## jQuery实现遍历：

### 1. jQuery.grep()

$.grep() 函数使用指定的函数过滤数组中的元素，并筛选符合条件的元素，组成新的数组，并返回。

```js
var arr = [ 1, 9, 3, 8, 6, 1, 5, 9, 4, 7, 3, 8, 6, 9, 1 ];
arr = jQuery.grep(arr, function( item, index ) {
// function 中两个参数，一是当前迭代的数组元素，二是当前迭代元素在数组中的索引。
     if( item !== 5 && index > 4){
       // 返回元素不为5，且索引大于4的数组
       return true;
      }
});
console.log(arr) // (9) [1, 9, 4, 7, 3, 8, 6, 9, 1]
```

### 2. jQuery.each()

$.each() 函数用于遍历指定的对象和数组。

```js
jQuery.each([52, 97], function(index, value) {
    console.log(index + ': ' + value);
    // 0: 52   // 1: 97
});
```

### 3. jQuery.inArray()

$.inArray() 函数在数组中查找指定值，并返回它的索引值（如果没有找到，则返回-1）。

```js
var anArray = ['one', 'two', 'three'];
var index = $.inArray('two', anArray);
console.log(index); //返回该值在数组中的键值，返回1
console.log(anArray[index+1]); // three
```

### 4. jQuery.map()

$.map() 函数用于使用指定函数处理数组中的每个元素(或对象的每个属性)，并将处理结果封装为新的数组返回。

```js
$(function () { 
    var arr = ['0','1','2','3','4','S','6'];
    var values = $.map(arr, function(value){
    var result = new Number(value);
        return isNaN(result) ? null : result; // 如果不是NaN就返回result值
    });
    // 遍历打印新返回的values
    for (key in values) {
        console.log(values[key]) // 0, 1, 2, 3, 4, 6
    }
})
```

## 常用循环遍历方法性能比较

```js
var num = 10000;  // 数组大小
var itemNum = 1000;  // 迭代次数  100/1000/10000/100000
var array = [];  // 初始化数组
for (var i = 0 ; i < num ; i++ ){
    array[i] = i + 1;
}
var len = array.length;

console.log("迭代次数: " + itemNum);

// 正常for循环
console.time('正常for循环');
for(var j = 0 ; j < itemNum ; j ++) {
    for(var k = 0 ; k < len ; k ++) {
        array[k] + 1;
    }
}
console.timeEnd('正常for循环');


// 倒序for循环
console.time('倒序for循环');
for(let j = 0; j < itemNum; j ++){
    for(let k = len - 1 ; k --;)
    {
        array[k] + 1;
    }
}
console.timeEnd('倒序for循环');


// while循环
console.time('while循环');
for(let j = 0; j < itemNum; j ++){   
    let k = 0;
    while(k < len){
        array[k] + 1;
        k ++;
    }
}
console.timeEnd('while循环');


// for-in循环
console.time('for-in循环');
for(let j = 0; j < itemNum; j ++){
    for(let k in array){
        array[k] + 1;
    }
}
console.timeEnd('for-in循环');


// for each 循环
console.time("for-each循环");
for(let j =0; j <itemNum; j ++){
    array.forEach((item) => {
        item + 1;
    });
}
console.timeEnd("for-each循环");


// Duff's Device 算法是一种循环体展开技术，它使得一次迭代中实际执行了多次迭代的操作。
console.time("Duff's Device");
for(let k = 0; k < itemNum; k ++){
    let j = len % 8;
    let tempLen = len-1;
    while(j){
        j--;
        array[tempLen--] + 1;
    }
    j = Math.floor(len / 8);
    while(j){
        j--;
        array[tempLen --] + 1;
        array[tempLen --] + 1;
        array[tempLen --] + 1;
        array[tempLen --] + 1;
        array[tempLen --] + 1;
        array[tempLen --] + 1;
        array[tempLen --] + 1;
        array[tempLen --] + 1;
    }
}
console.timeEnd("Duff's Device");
```