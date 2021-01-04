# 前端脚手架教程

## 初始化项目

npm init初始化一个项目；初始化成功之后会根据输入的配置生成一个package.json文件：

## 添加脚手架命令和命令入口文件（test）

**脚手架命令**：在package.json中添加bin配置来指定自己定义的命令对应的可执行文件的位置，代码如下：

```js
{
  "name": "test",
  "version": "1.0.0",
  "description": "",
  "bin": {
    "test": "bin/test.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

**命令入口文件**：根据package.json中的bin配置，我们在项目根目录下新增bin文件夹，并且在该文件夹下新建·test.js，代码如下：

```js
#!/usr/bin/env node
console.log('test')
```

第一行是必须添加的，是指定这里用node解析这个脚本。默认找/usr/bin目录下，如果找不到去系统环境变量查找。

**link到全局**：项目根目录下执行如下命令npm link，执行成功之后我们再查看我们全局npm的目录，这个时候我们会发现，多了几个项，细心地你肯定会发现，多出来的文件命名就是我们在package.json中配置的bin键：

对比上面失败的效果，你会发现这次系统识别了test命令，而且控制台输出了test。到这里上面的疑问应该都解开了：执行npm link，将当前的代码在npm全局目录下留个快捷方式，npm检测到package.json里面存在一个bin字段，它就同时在全局npm包目录下生成了一个可执行文件：

1. npm link，链接到全局

2. bin配合npm link，生成命令文件

3. "test": "bin/test.js"，cmd执行test，根据配置会去执行bin/test.js这个文件


## 添加命令

别人脚手架有的功能，我们也得有，例如：-V(--version) -H(--help)等。

### commander

首先我们先安装下需要的commander库，然后为我们的test命令添加最基础的版本号查看命令:

```js
#!/usr/bin/env node
const program = require('commander')
program
	.version(`version is ${require('../package.json').version}`)
	.parse(process.argv)
```

此外还可以添加.**description** .**usage** .**option** .**action** .**command**等；下面我们来重点说下.command和.action方法：其中，command允许我们注册一个命令（类似于vue create），代码如下：

```js
program
    .version(`Version is ${require('../package.json').version}`)
    .description('A simple CLI for building initialize project include Wechat applet, Vue, Egg (nodejs)')
    .usage('<command> [options]')
    .command('create')
    .option("-l --list", "project list", listOption)
    .action((name, cmd) => {
    	console.log(111)
        require('../lib/create')
    })
    .parse(process.argv)
```

- 输入 test create 测试：

```js
program
    .version(`Version is ${require('../package.json').version}`)
    .command('create')
    .action((name, cmd) => {
        console.log(111)
    })
    .parse(process.argv)
```

我们注册的create命令，配合action方法打印出来111，其中我们可以在action中执行别的js文件，模块化开发我们的create命令，如下代码输入text create将会去执行lib/create.js：

```js
.action((name, cmd) => {
        require('../lib/create')
    })
```

- lib/create.js

```js
const program = require('commander')
const inquirer = require('inquirer')
program.usage('<project-name>').parse(process.argv)
console.log(program.args)
```

- test create saa dfasas:

```js
[ 'create', 'saa', 'dfasas' ]
```




### chalk

chalk包的作用是修改控制台中字符串的样式：例如字体样式，字体颜色，背景颜色等。

```js
const chalk = reuqire('chalk')

console.log(chalk.green('这里是lib/create'))
console.log(chalk.red('这里是lib/create'))
```

### log-symbols

为各种日志级别提供着色的符号（类似下载成功的√）

```js
const logSymbols = require('log-symbols')

console.log(logSymbols.success)
```

### ora

显示下载中，可以设置样式等；有start，fail，succeed方法等。 

```js
const ora = require('ora')

const spinner = ora('正在下载模板')

spinner.start()
spinner.fail()
spinner.succeed()
```

### inquirer命令交互

这个库是我们可以和用户交互的工具；我们定义了两个问题：项目名称和版本号，create.js中写入以下代码：

```js
const inquirer = require('inquirer')
getInquirer().then((res) => {
	console.log(res)
})
function getInquirer() {
	return inquirer.prompt([
		{
			name: 'projectName',
			message: 'project name',
			default: 'project',
		},
		{
			name: 'projectVersion',
			message: '项目版本号',
			default: '1.0.0',
		},
	])
}
```

### download-git-repo

该模块用于下载git上的模板项目，类似于vue-cli初始化一样，也是在git上下载一份代码回来本地完成开发环境搭建。下面代码封装了下载的代码，作用是根据传入的git地址克隆目标地址的代码到本地：

