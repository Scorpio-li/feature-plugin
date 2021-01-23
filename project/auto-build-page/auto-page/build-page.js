var addConfig = require('./addConfig')
var fs = require('fs')
var path = require('path')
var shell = require('shelljs')

shell.echo('>>>>>>')
shell.echo('开始新建页面')
addConfig.forEach((ele) => {
    if (ele.open) {
        buildPage(ele)
    }
})

// 我们循环配置文件里面的配置，支持生成多个页面。对文件的操作我们直接使用node的fs模块完成。 

// 读取模板文件，并根据配置文件，对模板文件里面的变量进行替换：

function buildPage(config) {
    var paths = path.resolve(`./src/views/${config.name}`)
    shell.echo('页面地址:' + paths)
    fs.mkdir(paths, { recursive: false }, function() {
        var str = ''
        if (config.helloworld) {
            // 新建空白页，读取空白页模版
            str = handleStr(
                fs.readFileSync(path.resolve('./auto-page/template-helloworld.vue'), 'utf-8'),
                config
            )
        } else {
            str = handleStr(
                fs.readFileSync(path.resolve('./auto-page/template-table.vue'), 'utf-8'),
                config
            )
        }
        // 写入文件
        fs.writeFileSync(paths + '/index.vue', str)
        shell.echo('开始新增路由……')
        addRou(`./views/${config.name}/index.vue`, config)
    })
}



// function makeDir(dirpath, callback) {
//     if (!fs.existsSync(dirpath)) {
//         var pathtmp;
//         dirpath.split("/").forEach(function(dirname) {
//             if (pathtmp) {
//                 pathtmp = path.join(pathtmp, dirname);
//             } else {　　　　　　　　　 //如果在linux系统中，第一个dirname的值为空，所以赋值为"/"
//                 if (dirname) {
//                     pathtmp = dirname;
//                 } else {
//                     pathtmp = "/";
//                 }
//             }
//             if (!fs.existsSync(pathtmp)) {
//                 if (!fs.mkdirSync(pathtmp)) {
//                     return false;
//                 } else {
//                     callback()
//                 }
//             }
//         });
//     } else {
//         // deleteFolderFiles(dirpath);
//     }
//     return true;
// }



// 根据配置文件替换%包起来的变量：
function handleStr(str, config) {
    if (config.helloworld) {
        return str
    }
    console.log('str', str)
    str = str.replace('%title%', config.desc)
    str = str.replace('%method%', config.getlist.method)
    str = str.replace('%geturl%', config.getlist.url)
    return str
}

// 书写添加路由的操作，我们先读取路由模板：

function addRou(paths, config) {
    var templateStr = handleRouStr(
            fs.readFileSync(path.resolve('./auto-page/template-route.txt'), 'utf-8'),
            config,
            paths
        )
        // 添加到路由文件
    addToConf(templateStr)
}

function handleRouStr(str, config, paths) {
    str = str.replace(/%path%/g, `/${config.name}`)
    str = str.replace(/%name%/g, config.desc)
    str = str.replace(/%name2%/g, `${config.desc}首页`)
    str = str.replace(/%repath%/g, `/${config.name}/index`)
    str = str.replace(/%requirepath%/g, paths)
    return str
}

// 将路由添加到vue项目src下的routes.js文件里面：

function addToConf(str) {
    str += '// add-flag' // 添加的位置标记
    var confStr = handleConfRouStr(fs.readFileSync(path.resolve('./src/router/addRoute.js'), 'utf-8'), str)
    fs.writeFileSync(path.resolve('./src/router/addRoute.js'), confStr)
    shell.echo('路由添加成功!')
    shell.echo('结束生成页面')
    shell.echo('>>>>>>')
}

function handleConfRouStr(ori, str) {
    ori = ori.replace('// add-flag', str)
    return ori
}