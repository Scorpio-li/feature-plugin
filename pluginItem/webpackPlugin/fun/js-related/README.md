## js语法检查之eslint

- 场景需求：我们往往需要统一代码书写规范，例如检查出一些语法错误、格式不规范等问题并自动帮我们修改大部分的错误。

- 实现：语法检查最常用的工具是eslint。在webpack中如果想要使用eslint工具，需要下载eslint-loader  和eslint这两个依赖即(cnpm i  eslint-loader eslint -D)

> 注意点：我们只想检查自己写的源代码，并且相对来说第三方的库(例如node_modules下的文件)是不用检查的，所以我们需要设置eslint的检查规则。即我们需要在在package.json中设置'eslintConfig',规定好eslint检查规则。

> 注意点：在这里我们使用的eslint检查规则是airbnb风格指南(语言规范)，也可以使用其他的检查规则，使用airbnb风格指南(语言规范)需要再引入三个依赖即(eslint-config-airbnb-base、eslint-plugin-import、eslint)，所以需要下载cnpm i eslint-config-airbnb-base、eslint-plugin-import、eslint -D

```js
"eslintConfig": {
  "extends": "airbnb-base",
  "env": {
    "browser": true
  }
},
```

- 该webpack.config.js的配置代码如下：

```js
const { resolve } = require('path');

//引入插件'html-webpack-plugin'
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    // 打包后自动创建build/js/built.js
    filename: 'js/built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          // 自动修复eslint的错误
          fix: true
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 以谁为模板
      // 复制 './src/index.html' 文件
      // 并自动引入 打包输出的所有资源（JS/CSS/IMG/iconFont）
      template: './src/index.html'
    })
  ],
  //这里是开发模式的原因是好观察
  mode: 'development'
};
```



