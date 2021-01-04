console.log('lib/create');

const program = require('commander')
const chalk = require('chalk')
const logSymbols = require('log-symbols')
const ora = require('ora')
const inquirer = require('inquirer')

const spinner = ora('正在下载模板')

console.log(chalk.green('这里是lib/create'))
console.log(logSymbols.success, chalk.red('这里是lib/create'))

spinner.start()
spinner.fail()
spinner.succeed()

getInquirer().then((res) => {
    console.log(res)
})

function getInquirer() {
    return inquirer.prompt([{
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


program.usage('<project-name>').parse(process.argv)
console.log(program.args)