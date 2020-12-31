# 脚手架

1. 初始化一个package.json文件： yarn init

2. 有了这个文件之后通过编辑器打开这个目录，紧接着我们需要在package.json中添加一个bin字段，用于去指定一下我们cli应用的入口文件, 我们这里叫cli.js

```json
{
  "name": "sample-cli",
  "bin": "cli.js",
  ...
}
```

3. 再然后我们添加这个cli.js文件，跟以往我们在Node中书写的文件有所不同，cli的入口文件必须要有一个特定的文件头, 也就是在这个文件顶部写上这样一句话 #! /usr/bin/env node 我们在这个文件中console.log一句话。

```js
#! /usr/bin/env node

console.log('cli working')
```

> 如果说你的操作系统是linux或者mac系统你还还需要去修改这个文件的读写权限，把他修改成755，这样才可以作为一个cli的入口文件。

4. 通过yarn link 将这个模块映射到全局: yarn link

5. 这时候我们就可以在命令行使用sample这样一个命令, 通过执行这个命令我们的console.log成功打印出来，表示代码执行了。也就意味着我们这个cli基础就已经ok了。



