const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//引入压缩css的插件'optimize-css-assets-webpack-plugin'
//cnpm i optimize-css-assets-webpack-plugin -D
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

// 设置nodejs环境变量让css兼容规则以开发环境的配置来做
// process.env.NODE_ENV = 'development';

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
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new MiniCssExtractPlugin({
            // 对输出的css文件进行重命名
            filename: 'css/built.css'
        }),
        // 压缩css
        new OptimizeCssAssetsWebpackPlugin()
    ],
    mode: 'development'
};