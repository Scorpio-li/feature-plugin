module.exports = plop => {
    plop.setGenerator('component', {
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
    });
}