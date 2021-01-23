var addConfig = [{
        // 测试生成表格页
        open: true, // 参与生成 false表示改配置不参与生成页面
        helloworld: false, // 是否是空白页
        desc: '自动生成表格页', // 页面描述
        name: 'autoTablepage', // 页面名称
        getlist: {
            // 表格数据请求相关
            method: 'GET',
            url: 'http://test.req/getlist',
        },
    },
    {
        // 测试生成空白页
        open: true,
        helloworld: true,
        desc: '自动生成空白页面',
        name: 'autoHellopage',
    },
]
module.exports = addConfig