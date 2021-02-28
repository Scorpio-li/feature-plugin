<!--
 * @Author: Li Zhiliang
 * @Date: 2020-12-30 17:13:08
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2020-12-30 17:26:59
 * @FilePath: /feature-plugin/functionModel/pageLayout/README.md
-->

# 网页布局

## 1. 水平垂直居中（Middle）

### 1.1 Flex布局

```html
<!-- HTML -->
<div class="flex__container">
    <div class="flex__item"></div>
</div>

/* CSS */
.flex__container {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

- 水平垂直

```html

<!-- HTML -->
<div class="flex__container">
    <div class="flex__item"></div>
</div>

/* CSS */
.flex__container {
    display: flex; // 或inline-flex
    justify-content: center;
}

.flex__item {
    align-self: center;
}
```

- 使用place-content: center让Flex项目实现水平垂直居中：

```html
.flex__container {
    display: flex;
    place-content: center;
}

.flex__item {
    align-self: center;
}
```

- 这种方式特别适应于让Icon图标在容器中水平垂直居中，不同的是在Icon图标容器上显示设置display: inline-flex

```html
<!-- HTML -->
<div class="flex__container">
    <svg> </svg>
</div>

/* CSS */
.flex__container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
```

- 多个元素实现水平垂直居中

```html
<!-- HTML -->
<div class="flex__container">
    <div class="avatar">:)</div>
    <div class="media__heading"></div>
    <div class="media__content"></div>
    <div class="action"></div>
</div>

/* CSS */
.flex__container  {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
```

```html
<!-- HTML -->
<div class="flex__container">
    <div class="flex__item"></div>
</div>

/* CSS */
.flex__container {
    display: flex; // 或inline-flex
    justify-content: center;
}

.flex__item {
    align-self: center;
}
```

- 多个项目

```css
.flex__container {
    display: flex; // 或inline-flex
    justify-content: center;
}

.flex__container > * {
    align-self: center;
}
```

### 1.2 Grid布局

```html
<!-- HTML -->
<div class="grid__container">
    <div class="grid__item"></div>
</div>

/* CSS */
.grid {
    display: grid; // 或 inline-grid
    place-items: center
}
```

- 多个子元素

```css
<!-- HTML -->
<div class="grid__container">
    <div class="avatar">:)</div>
    <div class="media__heading"></div>
    <div class="media__content"></div>
    <div class="action"></div>
</div>
```

```css
<!-- HTML -->
<div class="grid__container">
    <div class="grid__item">
        <h3>Special title treatment</h3>
        <p>With supporting text below as a natural lead-in to additional content.</p>
        <div class="action">Go somewhere</div>
    </div>
</div>

/* CSS */
.grid__container {
    display: grid;
    place-items: center;
    grid-template-columns: repeat(2, 1fr);
    gap: 2vh;
}


.grid__item {
    display: grid;
    place-items: center;
}
```

## 2. 全屏布局

通常而言是左右两栏，左侧定宽，右侧自适应剩余宽度，当然，会有一个最小的宽度。那么，它的布局应该是这样：

```css
<div class="g-app-wrapper">
    <div class="g-sidebar"></div>
    <div class="g-main"></div>
</div>

.g-app-wrapper {
    display: flex;
    min-width: 1200px;
}
.g-sidebar {
    flex-basis: 250px;
    margin-right: 10px;
}
.g-main {
    flex-grow: 1;
}
```