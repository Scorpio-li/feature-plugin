const addRoute = [

    {
  path: '/autoTablepage',
  component: Home,
  name: '自动生成表格页',
  redirect: { path: '/autoTablepage/index' },
  children: [
    {
      path: '/autoTablepage/index',
      component: (resolve) =>
        require(['./views/autoTablepage/index.vue'], resolve),
      name: '自动生成表格页首页'
    }
  ]
},
{
  path: '/autoTablepage',
  component: Home,
  name: '自动生成表格页',
  redirect: { path: '/autoTablepage/index' },
  children: [
    {
      path: '/autoTablepage/index',
      component: (resolve) =>
        require(['./views/autoTablepage/index.vue'], resolve),
      name: '自动生成表格页首页'
    }
  ]
},
{
  path: '/autoTablepage',
  component: Home,
  name: '自动生成表格页',
  redirect: { path: '/autoTablepage/index' },
  children: [
    {
      path: '/autoTablepage/index',
      component: (resolve) =>
        require(['./views/autoTablepage/index.vue'], resolve),
      name: '自动生成表格页首页'
    }
  ]
},
{
  path: '/autoHellopage',
  component: Home,
  name: '自动生成空白页面',
  redirect: { path: '/autoHellopage/index' },
  children: [
    {
      path: '/autoHellopage/index',
      component: (resolve) =>
        require(['./views/autoHellopage/index.vue'], resolve),
      name: '自动生成空白页面首页'
    }
  ]
},
// add-flag
    // 不能删除
]

export default addRoute