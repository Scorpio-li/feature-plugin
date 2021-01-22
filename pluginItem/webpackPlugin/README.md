# webpack

## 一、webpack 安装及基础常识

### 1、安装webpack

建议不要全局安装webpack,因为不同的项目webpack的版本号是不一样的。这样多个项目来回切换是很不方便的。

```shell
npm install wepack webpack-cli -g

# 项目内安装
npm install wepack webpack-cli -D
```

> 注意：webpack-cli的作用是我们可以在命令行里直接使用webpack

检查版本

```shell
npx webpack -v
```

查看 webpack 所有可以安装的版本号

```shell
npm info webpack
```

### 2、最简单的webpack.config.js的配置

```js
const path = require('path');

module.exports = {
	entry: {
	    main:'./src/index.js'
    },
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist')
	}
}
```

- 我们需要打包入口文件是./src/index.js,

- 最后输出的打包文件是在当前目录下dist/main.js

- 假如存在bundle/index.html，就可以通过script引入main.js文件了。当然这个也可以通过webpack自动化构建。

### 3、两种打包方式

#### 1) npx

```shell
npx webpack
```

npx 表示会在当前目录里寻找依赖变量 webpack

#### 2) script

在package.json里配置

```shell
"scripts": {
    "bundle": "webpack"
},
```

运行

```shell
npm run bundle
```

> 运行 npx webpack / npm run bundle 会先检查是否有配置文件webpack.config.js，如果没有就走默认配置，如果有就走配置文件

### 4、打包的详细参数

![打包参数](https://cdn.jsdelivr.net/gh/Scorpio-li/picture/document/img/webpack-detail.jpeg)

- Hash:表示这一次打包的唯一标识值

- Version:表示这一次打包的使用版本

- Time:表示当前打包整体耗时

- Asset:表示此次打包出现了bundle.js

- Size:表示该文件的大小

- Chunk Names 表示的是 entry里入口的key,默认为main,也可以任意改为 xxx,yyy

- Entrypoint main = bundle.js 表示入口文件 以及依次打包的文件[0][1][2]……


## 二、使用Loader打包资源

### 1、什么是loader？

webpack不能识别非js的模块，需要对于不同的模块提供不同的打包方案，于是要求助于loader。如：css-loader、sass-loader、file-loader、vue-loader、postcss-loader等等

### 2、打包图片

**file-loader**实现原理思路： 当发现代码引入图片模块，首先把图片移动到dist目录下并改了名字，得到了相对于dist的地址，作为返回值给到我们引入的变量之中

```js
module.exports = {
	entry: {
		main: './src/index.js'
	},
    module: {
        rules: [{
          test: /\.(jpg|png)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash].[ext]', // [name] [hash] [ext] 均为占位符
              outputPath: 'images/', // 打包出的结果放在images/目录下
              limit: 10240
            }
          }
        }]
    },
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist')
	}
}
```

### 3、打包CSS 或 SASS

- css-loader:会帮我们分析几个css的关系（互相引入）合并成一个css

- style-loader:当css-loader合并成了一个css,style-loader会把内容挂载到head部分

- sass-loader:解析sass成css

- postcss-loader:自动添加-webkit等前缀，兼容不同浏览器样式

使用了postcss-loader,需要在根目录创建postcss.config.js

```js
module.exports = {
  plugins: [
  	require('autoprefixer')
  ]
}
```

webpack.config.js中module配置

```js
module: {
    rules: [
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'images/',
            limit: 10240
          }
        }
      },
      {
        test: /\.(eot|ttf|svg)$/,
        use: {
          loader: 'file-loader'
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          'sass-loader',
          'postcss-loader'
        ]
      }]
  },
```

> Loader解析是有先后顺序的：从下到上，从右到左

### 4、CSS modules

```js
{
  test: /\.scss$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options:{
        importLoaders: 2,// 表示scss文件导入了scss文件依然走postcss-loader sass-loader
        modules:true // 开启css模块化
      }
    },
    'sass-loader',
    'postcss-loader'
  ]
}
```

modules开启为true后，就可以使用模块化CSS互不干扰。否则引入的CSS或者SASS的代码会造成全局污染

使用方式：

```js
import style from  './index.scss’;

var img = new Image();
img.src = avatar;
img.classList.add(style.avatar);
```

### 5、打包字体

在webpack.config.js配置

```js
{
    test: /\.(eot|ttf|svg)$/,
    use: {
        loader: 'file-loader'
    } 
},
```

配置下载：

```shell
cnpm install css-loader file-loader url-loader sass-loader postcss-loader -D

cnpm install autoprefixer -D
```

## 三、使用Plugins打包便捷

### 1、什么是Plugins?

plugins是在某个时刻(刚打包、打包结束，打包中间)做一件事

### 2、html-webpack-plugin

在打包结束时，在dist自动生成html，并且把打包的main.js自动引入html的script的标签

### 3、clean-webpack-plugin

在每次打包生成的dist文件前，先删除里面的内容

### 4、安装及配置两个plugin

```js
npm install html-webpack-plugin clean-webpack-plugin -D
```

webpack.config.js

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin’);

plugins: [new HtmlWebpackPlugin({
  template: 'src/index.html' // 参考模板为 src/index.html
}), new CleanWebpackPlugin(['dist'])],
```

## 四、Entry 和 Output 配置

前面的都是单入口，单出口的配置。

### 1、多入口，多出口

```js
entry: {
     main: './src/index.js’，
     sub: './src/index.js'
},
plugins: [new HtmlWebpackPlugin({
     template: 'src/index.html'
}), new CleanWebpackPlugin(['dist'])
],
output: {
     filename: '[name].js',
     path: path.resolve(__dirname, 'dist')
}
```

最后的结果是html 里会引入两个js文件

```js
<script scr=“./main.js"></script>
<script scr=“./sub.js"></script>
```

### 2、把打包的JS上传到CDN

```js
entry: {
    main: './src/index.js’，
    sub: ‘./src/index.js'
},
plugins: [new HtmlWebpackPlugin({
     template: 'src/index.html'
}), new CleanWebpackPlugin(['dist'])
],
output: {
     publicPath: 'http://cdn.com.cn', // 最后打包出来是http://cdn.com.cn、main.js
     filename: '[name].js',
     path: path.resolve(__dirname, 'dist')
}
```

html引入的script 会自动加上publicPath路径

```js
<script scr=“http://cdn.com.cn/main.js"></script>
<script scr=“http://cdn.com.cn/sub.js"></script>
```

## 五、SourceMap

### 1、什么是SourceMap

先举个例子：
打开浏览器发现代码报错了。。。。现在知道dist目录下main.js 文件 96行出错。
用了sourceMap之后（它是一个映射关系），于是知道dist目录下main.js文件96行实际上对应的是src目录下index.js文件中的第1行

> 使用了sourceMap 打包速度是会变慢的。同时dist里多了一个xx.js.map文件，原理一个vlq集合

### 2、配置SourceMap

在webpack.config.js 里 devtool

```js
devtool: 'cheap-module-eval-source-map',
```

常用的几个source-map的前缀：

- **Inline**:inline-source-map 是把xx.js.map内容直接打包到xx.js里，用data url形式的方式放在末尾,会告诉你第几行第几列除了问题，很耗费性能

- **Cheap**:添加cheap-inline-source-map 可以精确到每一行不精确到每一列出错 ，可以降低打包时间，提高性能

- **Module**:如果要管第三方模块代码的映射可以加上module，可以加上cheap-module-inline-source-map

- **Eval**:eval是打包最快的方式 ，通过eval是执行效率最快、性能最好的方式，但是如果代码复杂的话，提示的内容可能不够全面，用eval的方式执行JS代码

### 3、最佳实践

开发环境：提示全，打包速度快

```js
mode: 'development',
devtool: 'cheap-module-eval-source-map',
```

生产环境：提示效果会更好

```js
mode: 'production',
devtool: 'cheap-module-source-map',
```

## 六、webpackDevServer

### 1、如何解决每次手动打包，手动启动浏览器刷新页面更新代码？

- webpack —watch：在package.json 里 script 添加

```js
"watch": "webpack --watch"
```

> **优点**：监听到源代码改变，会自动打包 **缺点**：需要手动刷新页面

- webpack-dev-server

在package.json 里 script 添加

```js
"start": "webpack-dev-server",
```

在devDependencies安装

```js
"webpack-dev-server": "^3.1.10"
```
> **优点**：监听到源代码改变，会自动打包，自动启动服务器，自动更新浏览器

> 注意使用了webpack-dev-server打包后就不会目录里有dist了，而是放在电脑某个内存里，可以提高效率。

### 2、如何启动时自动打开浏览器

在webpack.config.js配置

```js
devServer: {
     contentBase: './dist',
     open: true, // 默认启动开启浏览器
     port: 8080, // 端口设置为8080
},
```

## 七、热更新 HMR(HOT MODULE REPLACE)

配置如下

```js
// webpack.config.js

const webpack = require('webpack’);

devServer: {
     contentBase: './dist',
     open: true,
     port: 8080,
     hot: true, // 开启热更新的功能
     hotOnly: true // 即使HMR不生效，也不更新浏览器    
},

plugins: [
     new HtmlWebpackPlugin({
      template: 'src/index.html'
     }), 
     new CleanWebpackPlugin(['dist']),
     new webpack.HotModuleReplacementPlugin() // 配置热更新plugins 
],
```

同时必须添加模块更新的代码。例如有两个模块，当改变了number模块，就更新number，counter模块不改变

```js
// index.js
import counter from './counter';
import number from './number';


counter();
number();


if(module.hot) {
 module.hot.accept('./number', () => {
  document.body.removeChild(document.getElementById('number'));
  number();
 })
}
```

css可以不写 module.hot判断 是因为css-loader已经实现了。如果一些特别的模块，就需要自己写一个module.hot来判断

## 八、Babel处理ES6语法

### 1、安装依赖

```shell
npm install babel-loader @babel/core @babel/preset-env -D
```

- babel-loader : 提供识别模块的打包工具

- @babel/core : 识别js代码转化为AST抽象语法树，编译转化成新的语法

- @babel/preset-env : 把ES6代码转化为ES5语法，提供了翻译规则

### 2、打包方式(二选一)

1. 安装@babel/profill

```shell
npm install -save-dev @babel/profill
```

> 缺点：这个会出现全局污染

配置规则

```js
rules:[{
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  options:{
    presets: [['@babel/preset-env', {
      targets: {
        chrome: "67",
      },
      useBuiltIns: 'usage' // 表示做polyfill 根据业务代码来加对应的代码，可以减少打包的体积
    }]]
  }
}],
```

> 注意：useBuiltIns: 'usage' 表示按需引入

2. 安装 @babel/plugin-transform-runtime

```shell
npm install -save-dev @babel/plugin-transform-runtime @babel/runtime @babel/runtime-corejs2
```

> **优点**：可是使用闭包的方式不影响其他环境变量

配置 创建.babelrc

```js
{
 "plugins": [["@babel/plugin-transform-runtime", {
  "corejs": 2, // 使用了2 就需要安装 @babel/runtime-corejs2
    "helpers": true,
    "regenerator": true,
    "useESModules": false
 }]]
}
```

webpack.config.js

```js
{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader'
}
```

## 九、打包React代码

### 1、安装依赖

@babel/preset-react ： 可以解析JSX

```shell
npm install --save-dev @babel/preset-react
```

webpack.config.js

```js
{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
}
```

创建.babelrc

```js
{
  "presets": [
    [
      "@babel/preset-env", {
        "targets": {
          "chrome": "67"
        },
        "useBuiltIns": "usage"
      }
    ],
    "@babel/preset-react"
  ]
}
```

> 注意：先解析react的语法，然后再把ES6语法解析为ES5。presets是自下而上，自右边而左来解析的.