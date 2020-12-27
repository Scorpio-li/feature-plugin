# 由axios如何cancel请求想到的如何防止多次重复请求数据覆盖问题

首先声明一个map对象，用来储存处于pending状态的请求以及取消该请求的方法，我这边使用的是请求类型加上请求地址作为key值，取消请求的方法作为value值，别问我为什么要加个请求类型，因为遇到过请求地址一样，类型不一样的接口

以及定义CancelToken构造函数

```js
import axios from 'axios'

let pendingQueue = new Map()
let CancelToken = axios.CancelToken
```

定义判断请求是否在队列中，如果在就执行取消请求的**judgePendingFunc**方法，以及将已执行过的请求从队列中删除的**removeResolvedFunc**方法，这两个方法接收的参数都是axios的config

```js
// 判断请求是否在队列中，如果在就对队列中的该请求执行取消操作
const judgePendingFunc = function(config) {
  if (pendingQueue.has(`${config.method}->${config.url}`)) {
    pendingQueue.get(`${config.method}->${config.url}`)() //注意这里的括号不要漏掉
  }
}
// 删除队列中对应已执行的请求
const removeResolvedFunc = function(config) {
  if (pendingQueue.has(`${config.method}->${config.url}`)) {
    pendingQueue.delete(`${config.method}->${config.url}`)
  }
}
```

在request拦截器中添加如下代码

```js
// 请求发起之前先调用removeResolvedFunc方法
judgePendingFunc(config)
// 将pending队列中的请求设置为当前
config.cancelToken = new CancelToken(cb => {
  // cb就是取消该请求的方法，调用它就能cancel掉当前请求
  pendingQueue.set(`${config.method}->${config.url}`, cb)
})
```

在response拦截器中添加

```js
// 调用removeResolvedFunc在队列中删除执行过的请求
removeResolvedFunc(response.config)
```

[完整代码](./axios.js)

- 使用

```js
import axios from '@/plugins/axios'

/**
 * 接收请求所需要配置的参数
 * @param { Object } queryParams
 */
export const testGet1 = queryParams => {
  return axios.get('/path/path', queryParams)
}
export const testGet2 = queryParams => {
  // 配置特殊情况修改接收返回值类型为blob（多用于下载文件）
  return axios.get('/path/path', queryParams, { responseType: 'blob' })
}
export const testPost1 = queryParams => {
  return axios.post('/path/path', queryParams)
}
export const testPost2 = queryParams => {
  // 配置特殊情况延长超时时间（多用于上传大文件）
  return axios.post('/path/path', queryParams, { timeout: 2 * 60 * 60 * 1000 })
}
```

# 两个工具（repeat-request-minder和repeat-request-minder-webpack-plugin）来辅助我们避免重复的请求

## repeat-request-minder

repeat-request-minder就是封装了上述功能的一个npm包，使用起来很简单

```shell
npm i --save-dev repeat-request-minder
```

```js
import repeatRequestMinder from 'repeat-request-minder';
repeatRequestMinder();
```

调用后就可以自动监控项目中是否有重复的请求，并给出提示了。不设置的话默认会显示toast提示，显示时长为3秒。

```js
repeatRequestMinder({
  isShowToast: true,
  toastTime: 10000
});
```

也可以传入isShowToast和toastTime来控制是否显示toast提示以及提示显示的时长。

## repeat-request-minder-webpack-plugin

由于上面说到的包需要在代码中调用，然而我们有时候可能不想这个功能对于业务有侵入性。

于是基于repeat-request-minder做了一个webpack插件，此插件的作用就是在代码打包好了之后，给入口代码插入一段立即执行函数，调用repeat-request-minder的代码。

用这个webpack插件的话，我们就仅需要在webpack的开发配置中引入这个插件，就可以实现在开发过程中监控重复请求并给开发者提示了。 

```shell
npm i --save-dev repeat-request-minder-webpack-plugin
```

```js
const RepeatRequestMinderWebpackPlugin = require('repeat-request-minder-webpack-plugin');
new RepeatRequestMinderWebpackPlugin({
  chunk: 'index',
}),
```

其中的chunk参数为webpack中entry的名字，填上你希望插入此功能的entry名即可。

```js
new RepeatRequestMinderWebpackPlugin({
  chunk: 'index',
  isShowToast: true,
  toastTime: 10000
}),
```






