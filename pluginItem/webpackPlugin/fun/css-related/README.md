# CSS 相关配置

## 1. 提取css成单独文件

- 在webpack开发环境下我们往往不会让源目录中css文件在打包后单独生成一个css文件，但是这往往会使得打包后包含这些css文件内容的js文件体积臃肿，甚至可能出现闪屏现象，因为因为它的工作原理时是先加载js文件再去加载css文件。

- **场景需求**：在webpack生产环境下我们往往会需要让源目录中css文件在打包后单独生成一个css文件

- 之前通过'css-loader'和'style-loader'将css代码统一整合进自动给构建出的js文件中，通过自动创建 style 的方式自动引入css样式，现在我们需要单独的生成css文件。

- 我们可以使用配合插件'mini-css-extract-plugin'来完成我们的需求，这可以让源目录中css文件在打包后单独生成一个css文件(并且保持输出后的目录结构与源目录结构一致)，并且让构建后目录中的build/index.html通过自动创建link的方式引入css样式。

```html
<link href="css/built.css" rel="stylesheet">
```

- 构建后目录中的build/index.html通过自动创建link的方式引入css样式，这样子就不会出现闪屏现象了。

```js
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader'的作用是创建style标签，将样式放入
          // 下面这个loader取代style-loader。
          // 下面这个loader的作用：提取build/js/built.js中的css内容成单独文件
          MiniCssExtractPlugin.loader,
          // 将css文件整合到js文件中
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      // 对输出的css文件进行重命名
      filename: 'css/built.css'
    })
  ],
  mode: 'development'
};
```

### 总结提取css成单独文件的方式：

1. MiniCssExtractPlugin.loader

2. css-loader

3. new MiniCssExtractPlugin的配置

## 2. css的兼容性处理

- 场景需求：我们在书写CSS页面时往往会遇到书写的的代码在一些浏览器下不兼容的问题，这会导致页面的样式加载不出来，因此我们在生产环境下需要对css做相应的兼容性处理。

### 解决方案：

1. 我们在这里使用postcss来处理css的兼容性问题。在webpack下想要使用postcss的功能需要借助使用'postcss-loader'这个Loader和这个Loader的插件'postcss-preset-env'来实现css的兼容性处理。

- 第一步：下载'postcss-loader'和'postcss-preset-env'即(cnpm i postcss-loader postcss-preset-env -D)

> 注意点：Loader的两种写法：一种是使用Loader的默认配置写法(不修改其任何配置)，一种是使用自定义配置写法(修改其相关配置)

```js
<!-- 默认配置写法 -->
module: {
rules: [
{
test: /\.css$/,
use: [
'css-loader'
]
}
]
}
```

```js
<!-- 自定义配置写法 -->
module: {
rules: [
{
test: /\.css$/,
use: [
MiniCssExtractPlugin.loader,
//使用 'css-loader'的默认配置写法
'css-loader',

// 使用对象的写法来修改loader的配置
{
loader: 'postcss-loader',
options: {
ident: 'postcss',
plugins: () => [
// 使用postcss的插件
require('postcss-preset-env')()
]
}
}
]
}
]
}
```

- 注意点：'postcss-preset-env'可以识别具体的环境从而加载指定的配置使得css精确的兼容到指定的浏览器的版本

- 注意点：'postcss-preset-env'可以帮postcss找到package.json中browserslist里面的配置，然后通过这个'browserslist'里面的配置加载指定的css兼容性样式

- 在package.json中去配置browserslist，告知如何兼容css样式，书写的格式可以参考下面的写法(更多的配置可以在github上搜索关键字"browserslist")：

```js
"browserslist": {
"development": [
"last 1 chrome version",
"last 1 firefox version",
"last 1 safari version"
],
"production": [
">0.2%",
"not dead",
"not op_mini all"
]
},
```

- 注意点："development"是开发环境，而"production"是生产环境

- 注意点：在第二步中运行命令webpack后默认是看生产环境，即在package.json中配置的"production"会默认生效。注意这里是默认看生产环境(即"production")的配置，而不是去看webpack.config.js的mode配置，也就是说与webpack.config.js的mode配置是无关的。

- 注意点：如果我们想要让css兼容规则以开发环境的配置来做(即以package.json中配置的"development"的规则来兼容)，需要单独设置nodejs的环境变量(即在webpack.config.js中添加process.env.NODE_ENV = 'development')

```js
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// 设置nodejs环境变量让css兼容规则以开发环境的配置来做
// process.env.NODE_ENV = 'development';

module.exports = {
entry: './src/js/index.js',
output: {
filename: 'js/built.js',
path: resolve(__dirname, 'build')
},
module: {
rules: [
{
test: /\.css$/,
use: [
MiniCssExtractPlugin.loader,
//使用 'css-loader'的默认配置
'css-loader',
{
loader: 'postcss-loader',
options: {
ident: 'postcss',
plugins: () => [
// 使用postcss的插件
require('postcss-preset-env')()
]
}
}
]
}
]
},
plugins: [
new HtmlWebpackPlugin({
template: './src/index.html'
}),
new MiniCssExtractPlugin({
filename: 'css/built.css'
})
],
mode: 'development'
};
```

## 压缩css文件

### 实现方式之一：

引入压缩css的插件'optimize-css-assets-webpack-plugin'。(即cnpm i optimize-css-assets-webpack-plugin -D)并使用，执行webpack命令后即见效果。

```js
// webpack.config.js配置代码
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//引入压缩css的插件'optimize-css-assets-webpack-plugin'
//cnpm i optimize-css-assets-webpack-plugin -D
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

// 设置nodejs环境变量
// process.env.NODE_ENV = 'development';

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                // postcss的插件
                require('postcss-preset-env')()
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/built.css'
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin()
  ],
  mode: 'development'
};
```