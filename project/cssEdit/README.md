# CSS常用技巧

## 1-1. 设置input 的placeholder的字体样式

- 设置input占位符的样式

```css
input::-webkit-input-placeholder {    /* Chrome/Opera/Safari */
    color: red;
}
input::-moz-placeholder { /* Firefox 19+ */  
    color: red;
}
input:-ms-input-placeholder { /* IE 10+ */
    color: red;
}
input:-moz-placeholder { /* Firefox 18- */
    color: red;
}

<input type="text" placeholder="请设置用户名">
```

- 设置input聚焦时的样式

```css
input:focus {   
  background-color: red;
}
```

- 取消input的边框

```css
border: none;
outline: none;
```

- Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CSS高级常见技巧汇总</title>
  <style type="text/css">
    input::-webkit-input-placeholder {    /* Chrome/Opera/Safari */
      color: red;
    }
    input::-moz-placeholder { /* Firefox 19+ */
      color: red;
    }
    input:-ms-input-placeholder { /* IE 10+ */
      color: red;
    }
    input:-moz-placeholder { /* Firefox 18- */
      color: red;
    }
    input:focus {
      background-color: red;
    }
    input{
      border: none;
      outline: none;
    }
  </style>
</head>
<body>
<input type="text" placeholder="请设置用户名">
</body>
</html>
```

## 1-2. 单行和多行文本超出省略号

```css
// 单行文本出现省略号
width: 300px;
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
word-break: break-all;

// 多行文本出现省略号
display: -webkit-box; /*重点，不能用block等其他，将对象作为弹性伸缩盒子模型显示*/
-webkit-box-orient: vertical; /*从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）*/
-webkit-line-clamp: 3; /*行数，超出三行隐藏且多余的用省略号表示...*/
line-clamp: 3;
word-break: break-all;
overflow: hidden;
max-width: 100%;
```

## 1-3. 负边距使用技巧

> 规律: 左为负时，是左移，右为负时，是左拉。上下与左右类似

## 1-4. 隐藏滚动条或更改滚动条样式

```css
.scroll-container {
   width: 500px;
   height: 150px;
   border: 1px solid #ddd;
   padding: 15px;
   overflow: auto;     /*必须*/
 }

 .scroll-container::-webkit-scrollbar {
   width: 8px;
   background: white;
 }

 .scroll-container::-webkit-scrollbar-corner,
   /* 滚动条角落 */
 .scroll-container::-webkit-scrollbar-thumb,
 .scroll-container::-webkit-scrollbar-track {      /*滚动条的轨道*/
   border-radius: 4px;
 }

 .scroll-container::-webkit-scrollbar-corner,
 .scroll-container::-webkit-scrollbar-track {
   /* 滚动条轨道 */
   background-color: rgba(180, 160, 120, 0.1);
   box-shadow: inset 0 0 1px rgba(180, 160, 120, 0.5);
 }

 .scroll-container::-webkit-scrollbar-thumb {
   /* 滚动条手柄 */
   background-color: #00adb5;
 }
```

## 1-5. 纯CSS绘制三角形

```css
/* 正三角 */
.up-triangle {
   width: 0;
   height: 0;
   border-style: solid;
   border-width: 0 25px 40px 25px;
   border-color: transparent transparent rgb(245, 129, 127) transparent;
 }

 /* 倒三角 */
 .down-triangle {
   width: 0;
   height: 0;
   border-style: solid;
   border-width: 40px 25px 0 25px;
   border-color:  rgb(245, 129, 127) transparent transparent transparent;
 }
 div:last-child {
   margin-top: 1rem;
 }
```

## 1-6. 虚线框绘制技巧

```css
.dotted-line {
  width: 800px;
  margin: auto;
  padding: 20px;
  border: 1px dashed transparent;
  background: linear-gradient(white, white) padding-box, repeating-linear-gradient(-45deg, red 0, #ccc .25em, white 0, white .75em);
}
<p class="dotted-line">庭院深深，不知有多深？杨柳依依，飞扬起片片烟雾，一重重帘幕不知有多少层。</p>
```

## 1-7. 卡券效果制作

```css
.coupon {
 width: 300px;
  height: 100px;
  line-height: 100px;
  margin: 50px auto;
  text-align: center;
  position: relative;
  background: radial-gradient(circle at right bottom, transparent 10px, #ffffff 0) top right /50% 51px no-repeat,
  radial-gradient(circle at left bottom, transparent 10px, #ffffff 0) top left / 50% 51px no-repeat,
  radial-gradient(circle at right top, transparent 10px, #ffffff 0) bottom right / 50% 51px no-repeat,
  radial-gradient(circle at left top, transparent 10px, #ffffff 0) bottom left / 50% 51px no-repeat;
  filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, .2));
}
.coupon span {
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
  color: red;
  font-size: 50px;
  font-weight: 400;
}
```

```html
<p class="coupon">
 <span>200</span>优惠券
</p>
```

## 1-8. 表格边框合并

```css
table{
  border-collapse: collapse;
}
```

## 1-9. 图片相关

### object-fit

它能够指定可替换元素的内容（也就是图片）该如何适应它的父容器的高宽。

- 利用 object-fit: cover，使图片内容在保持其宽高比的同时填充元素的整个内容框。

```css
ul li img {
    width: 150px;
    height: 100px;
    object-fit: cover;
}
```

- object-fit 还有一个配套属性 object-position，它可以控制图片在其内容框中的位置。（类似于 background-position），m默认是 object-position: 50% 50%，如果你不希望图片居中展示，可以使用它去改变图片实际展示的 position 。

```css
ul li img {
    width: 150px;
    height: 100px;
    object-fit: cover;
    object-position: 50% 100%;
}
```

### 考虑屏幕 dpr -- 响应式图片

img 标签是有提供相应的属性 srcset 让我们进行操作的。

```html
<img src='photo@1x.png'
   srcset='photo@1x.png 1x,
           photo@2x.png 2x,
           photo@3x.png 3x' 
/>
```

srcset 新增了新的 w 宽度描述符

```html
<img 
        src = "photo.png" 
        srcset = “photo@1x.png 300w,
                       photo@2x.png 600w,
                       photo@3x.png 1200w,
>
```

### 图片丢失

1. 利用图片加载失败，触发 img 元素的 onerror 事件，给加载失败的 img 元素新增一个样式类

2. 利用新增的样式类，配合 img 元素的伪元素，展示默认兜底图的同时，还能一起展示 img 元素的 alt 信息

```css
<img src="test.png" alt="图片描述" onerror="this.classList.add('error');">

img.error {
    position: relative;
    display: inline-block;
}

img.error::before {
    content: "";
    /** 定位代码 **/
    background: url(error-default.png);
}

img.error::after {
    content: attr(alt);
    /** 定位代码 **/
}
```

## 2.0 交互设计优化

### 滚动优化

1. 滚动平滑：使用 scroll-behavior: smooth 让滚动丝滑

使用 scroll-behavior: smooth，可以让滚动框实现平稳的滚动，而不是突兀的跳动。看看效果，假设如下结构：

```js
<div class="g-container">
  <nav>
    <a href="#1">1</a>
    <a href="#2">2</a>
    <a href="#3">3</a>
  </nav>
  <div class="scrolling-box">
    <section id="1">First section</section>
    <section id="2">Second section</section>
    <section id="3">Third section</section>
  </div>
</div>
```

```css
{
    scroll-behavior: smooth;
}
```

2. 使用 scroll-snap-type 优化滚动效果

sroll-snap-type 可能算得上是新的滚动规范里面最核心的一个属性样式。属性定义在滚动容器中的一个临时点（snap point）如何被严格的执行

这个属性规定了一个容器是否对内部滚动动作进行捕捉，并且规定了如何去处理滚动结束状态。让滚动操作结束后，元素停止在适合的位置。

```css
/* simple */
* {
  overflow: auto;
}

/* normal */
* {
  overflow: auto;
  sroll-snap-type: x mandatory;
}

/* Children Element */
* {
  sroll-snap-align: center;
}
```

### 点击优化

1. 优化手势 -- 不同场景应用不同 cursor
  
  - 按钮可点击: cursor: pointer
  
  - 按钮禁止点击：cursor: not-allowed
  
  - 等待 Loading 状态：cursor: wait
  
  - 输入框：cursor: text;
  
  - 图片查看器可放大可缩小：cursor: zoom-in/ zoom-out
  
  - 提示：cursor: help;

2. 点击区域优化 -- 伪元素扩大点击区域

在不改变按钮原本大小的情况下去增加他的点击热区呢？

这里，伪元素也是可以代表其宿主元素来响应的鼠标交互事件的。借助伪元素可以轻松帮我们实现，我们可以这样写：

```css
.btn::befoer{
  content:"";
  position:absolute;
  top:-10px;
  right:-10px;
  bottom:-10px;
  left:-10px;
}
```

3. 快速选择优化 -- user-select: all

快速单击两次，可以选中单个单词，快速单击三次，可以选中一整行内容。但是如果有的时候我们的核心内容，被分隔符分割，或者潜藏在一整行中的一部分，这个时候选取起来就比较麻烦。

利用 user-select: all，可以将需要一次选中的内容进行包裹，用户只需要点击一次，就可以选中该段信息：

```css
.g-select-all {
    user-select: all
}
```

4. 选中样式优化 -- ::selection

CSS 还有提供一个 ::selection 伪类，可以控制选中的文本的样式（只能控制color, background, text-shadow），进一步加深效果。

5. 添加禁止选择 -- user-select: none

有快速选择，也就会有它的对立面 -- 禁止选择。

对于一些可能频繁操作的按钮，可能出现如下尴尬的场景：文本按钮的快速点击，触发了浏览器的双击快速选择，导致文本被选中：

```css
{
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
}
```

