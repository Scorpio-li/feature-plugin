const ora = require('ora');
const chalk = require("chalk");
const logSymbols = require('log-symbols');
const download = require('download-git-repo');
const {
    spawnSync
} = require("child_process");

module.exports = function(target, downLoadURL) {
    let {
        error
    } = spawnSync("git", ["--version"]);
    if (error) {
        let downurl = downLoadURL.replace("direct:", "");
        console.log(logSymbols.warning, chalk.yellow("未添加Git环境变量引起，添加Git与git管理库的环境变量即可；"))
        console.log(logSymbols.info, chalk.green('或直接到模板地址下载：', downurl));
        return Promise.reject(error);
    }

    return new Promise((resolve, reject) => {
        const spinner = ora(`正在下载模板`)
        spinner.start();
        console.log(downLoadURL)
        download(downLoadURL, target, {
            clone: true
        }, (err) => {
            if (err) {
                let errStr = err.toString()
                spinner.fail();
                reject(err);

                if (errStr.includes("status 128")) {
                    console.log('\n', logSymbols.warning, chalk.yellow("Git默认开启了SSL验证，执行下面命令关闭后再重试即可；"))
                    console.log(logSymbols.info, chalk.green("git config --global http.sslVerify false"))
                }
            } else {
                spinner.succeed();
                resolve(target);
            }
        })
    })
}

// 下载模板时校验输入的文件目录名：

function checkProjectName(projectName) {
    let next = null;
    if (list.length) {
        if (
            list.filter((name) => {
                const fileName = path.resolve(process.cwd(), path.join(".", name));
                const isDir = fs.statSync(fileName).isDirectory();
                return name.indexOf(projectName) !== -1 && isDir;
            }).length !== 0
        ) {
            console.error(logSymbols.error, chalk.red(`项目${projectName}已经存在`));
            return Promise.resolve(false);
        }
        next = Promise.resolve(projectName);
    } else if (rootName === projectName) {
        next = inquirer
            .prompt([{
                name: "buildInCurrent",
                message: "当前目录为空，且目录名称和项目名称相同，是否直接在当前目录下创建新项目？",
                type: "confirm",
                default: true,
            }, ])
            .then((answer) => {
                return Promise.resolve(answer.buildInCurrent ? "." : projectName);
            });
    } else {
        next = Promise.resolve(projectName);
    }

    return next;
}