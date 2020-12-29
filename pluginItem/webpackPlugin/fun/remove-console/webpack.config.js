/**
 * 去除console.log
 * */

const fs = require('fs')

class RemoveLogs {
    constructor(options) {
        this.options = options
    }

    apply(compiler) {
        console.log(compiler.options.output);
        // 在控制台看到 Hello from the custom plugin 这句话。这说明我们的自定义 Plugin 已经添加成功了。

        // 编译结束之后： compiler.hooks.done 类似于我们 DOM 操作中的 document.addEventListener('click', ()=>{}) 。也就是说我们想在编译结束后要做什么事。

        compiler.hooks.done.tap("RemoveLogs", stats => {
            try {
                this.removeAllLogs(stats);
            } catch (e) {
                console.log(e);
            }
        });
        // 加一个钩子函数来获取此时真实的 filename
        compiler.hooks.compilation.tap('HelloCompilationPlugin', compilation => {
            compilation.hooks.chunkIds.tap('HelloCompilationPlugin', (c) => {
                this.filename = Array.from(c)[0].name
            });
        });
    };
    removeAllLogs(stats) {
        const { path, filename } = stats.compilation.options.output;
        let filePath = (path + "/" + filename).replace(/\[name\]/g, this.filename);

        try {
            fs.readFile(filePath, "utf8", (err, data) => {
                const rgx = /console.log\(['|"](.*?)['|"]\)/;
                const newData = data.replace(rgx, "");
                if (err) console.log(err);
                fs.writeFile(filePath, newData, function(err) {
                    if (err) {
                        console.log(err)
                    }
                    console.log("all logs Removed");
                });
            });
        } catch (e) {
            console.error(e)
        }

    }
}

module.exports = {
    entry: './index.js',
    plugins: [new RemoveLogs()], // 方法一：用正则匹配来去除 console
}