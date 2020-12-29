// 方法二： 使用babel插件
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
    prodPlugins.push('transform-remove-console')
}

module.exports = {

    presets: [],
    //发布产品时候的插件数组
    ...prodPlugins,
}