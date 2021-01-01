console.log('lib/create');

const program = require('commander')
const chalk = require('chalk')
const logSymbols = require('log-symbols')

console.log(chalk.green('这里是lib/create'))
console.log(logSymbols.success, chalk.red('这里是lib/create'))
    // const inquirer = require('inquirer')
program.usage('<project-name>').parse(process.argv)
console.log(program.args)