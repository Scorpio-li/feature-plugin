<!--
 * @Author: Li Zhiliang
 * @Date: 2020-12-31 14:17:12
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2020-12-31 14:17:14
 * @FilePath: /feature-plugin/pluginItem/plob/README.md
-->
# Plob

小型的脚手架工具，是一款主要用于去创建项目中特定类型文件的小工具，类似于Yeoman中的sub generator, 不过它一般不会独立去使用，一般我们会把Plop集成到项目当中。

## Plop的基本使用

- 安装

```shell
yarn add plop --dev
```

安装过后我们在项目的跟目录下新建一个plopfile.js文件，这个文件是plop工作的一个入口文件，需要导出一个函数，而且这个函数可以接收一个叫plop的对象，并且这个对象提供了一系列工具函数，用于去帮我们创建生成器的任务。

```js
module.exports = plop => {
    plop.setGenerator('component', {});
}
```

plop有个成员叫setGenerator, 接收两个参数，第一个参数是生成器的名字，第二个参数是生成器的一些选项。

在配置选项中我们需要指定一下生成器的参数

```js
{
    description: '生成器的描述',
    prompts: [ // 发出的命令行问题
        {
            type: 'input',
            name: 'name',
            message: 'component name',
            default: 'MyComponent'
        }
    ],
    actions: [ // 问题完成后的动作
        {
            type: 'add', // 添加一个全新的文件
            path: 'src/components/{{name}}/{{name}}.js', // 指定添加的文件会被添加到哪个具体的路径, 可以通过双花括号的方式使用命令行传入的变量
            templateFile: 'plop-templates/component.hbs', // 本次添加文件的母版文件是什么, 一般我们会把母版文件放在plop-template目录中，可以通过handlebars去创建模板文件.hbs
        }

    ]
}
```

在安装Plop模块的时候plop提供了一个CLI程序，可以通过yarn启动这个程序。 

```shell
yarn plop ; // 生成器的名字
```
