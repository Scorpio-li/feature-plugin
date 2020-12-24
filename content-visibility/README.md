# 缺陷

## 兼容性

content-visibility是chrome85今年新增的特性，所以目前兼容性还不高，但是相信兼容性的问题在不久的将来会得到解决。

## 部分元素导致浏览器渲染出问题

当元素的部分内容如 img 标签这种，元素的高度是有图片内容决定的，因此在这种情况下，如果使用content-visibility，则可见视图外的img初始未渲染，高度为0，随着滚动条向下滑动，页面高度增加，会导致滚动条的滚动有问题。

```html
<html>
  <head>
    <title>content-visibility</title>
    <style type="text/css">
      .card {
        margin-bottom: 10px;
        content-visibility: auto;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <img
        src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1057266467,784420394&fm=26&gp=0.jpg"
        alt="小狗"
      />
      <!-- ... -->
      <!-- 此处省略n个card内容 -->
      <!-- ... -->
      <img
        src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1057266467,784420394&fm=26&gp=0.jpg"
        alt="小狗"
      />
    </div>
  </body>
</html>
```

- 解决此问题，如果在已知元素高度的情况下，可以使用contains-intrinsic-size属性，为上面的card添加：contains-intrinsic-size：312px;，这会给内容附一个初始高度值。（如果高度不固定也可以附一个大致的初始高度值，会使滚动条问题相对减少）。

```css
    <style type="text/css">
      .card {
        margin-bottom: 10px;
        content-visibility: auto;
        contain-intrinsic-size: 312px; // 添加此行
      }
    </style>
```
