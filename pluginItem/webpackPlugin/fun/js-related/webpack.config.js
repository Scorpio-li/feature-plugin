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
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'eslint-loader',
            options: {
                // 自动修复eslint的错误
                fix: true
            }
        }]
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