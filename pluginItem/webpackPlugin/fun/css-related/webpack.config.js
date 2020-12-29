// 使用'mini-css-extract-plugin'插件并使用 MiniCssExtractPlugin.loader这个来取代原先的'style-loade'
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
        rules: [{
            test: /\.css$/,
            use: [
                // 'style-loader'的作用是创建style标签，将样式放入
                // 下面这个loader取代style-loader。
                // 下面这个loader的作用：提取build/js/built.js中的css内容成单独文件
                MiniCssExtractPlugin.loader,
                // 将css文件整合到js文件中
                'css-loader'
            ]
        }]
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