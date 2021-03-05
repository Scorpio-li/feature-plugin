<!--
 * @Author: Li Zhiliang
 * @Date: 2021-03-04 13:40:52
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2021-03-04 15:07:50
 * @FilePath: /feature-plugin/fixMobile/smallProgram/fillpit.md
-->
# 小程序开发填坑系列

## 1. 👻自定义动态Tabbar导航栏

在默认的小程序开发中，定义tabbar,需要在app.json中配置如下json：

```js
"tabBar": {
    ...
    "list": [
      {
        "text": "首页",
        "iconPath": "/public/images/index.png",
        "selectedIconPath": "/public/images/index-act.png",
        "pagePath": "pages/job/index"
      }
      ...
    ]
}
```

一经配置，无法修改。你可以调用setTabBarItem 设置按钮文字、图片路径；就是无法动态设置跳转地址、tabbar个数。

### 解决方案

我们需要新建一个中间页面，用来控制所有tabbar，把tabbar要关联的页面，都用组件的方式来写，这样，我们只要在这一个页面里，写个fix在底部的tabbar样式，点击不同tab，显示不同组件。

- json文件

```json
{
  "usingComponents": {
    "home" : "/pages/job/index",		// 首页
    "company" : "/pages/company/company",	// 公司
    "message" : "/pages/chat/index",	// 消息
    "mine" : "/pages/mine/index",	// 我的
    "tabbar" :  "/milfun/widget/custom-tab-bar", //自定义tabbar组件
  }
}
```

- wxml文件

```html
<!-- wxml中，把页面设置成组件 -->
<home wx:if="{{activeTab == 'home'}}">首页</home>
<company wx:if="{{activeTab == 'company'}}">公司</company>
<message wx:if="{{activeTab == 'message'}}">消息</message>
<mine wx:if="{{activeTab == 'mine'}}">我的</mine>

<!-- wxml中，自定义tabbar组件 -->
<tabbar list="{{tabList}}" bindmytab="tabChange"></tabbar>
```

- js文件

```js
Page({
  data: {
    activeTab:'home'	// company 、message、mine
  },
  onLoad: function (options) {
    let tmp = 1;	// 用来控制显示不同方案的tabbar
    if( tmp === 1 ){	// 显示第一套tabbar
      this.setData({
        tabList:[
          {
            "name": "...",
            "text": "...",
            "iconPath": "...",
            "selectedIconPath": "...",
            "pagePath": "..."
          },
          ...
        ]
      })
    }else{	// 显示第二套tabbar
		this.setData({
	        tabList:[{},...]
	    })
	  }
	}
})
```

### 页面改成组件写法

- 正常写法

```js
Page({
  data: {
  },
  onLoad: function (options) {
  },
  onShow: function (options) {
  },
  func1:function(e){
    console.log(e)
  },
  func2:function(e){
    console.log(e)
  },
})
```

- 组件写法

```js
Component({
  options: { // 为了使用全局css样式
      addGlobalClass: true,
  },
  data: {},
  /*
  * 组件被创建时调用，等同于上方的 onLoad
  */
  attached: function (options) {	
  },
  /*
  * 组件内部方法，等同于上方的自定义方法
  */
  methods: {
	func1:function(e){
	    console.log(e)
	},
	func2:function(e){
	    console.log(e)
	},
  }
})
```

## 2. 👻输入框弹起页面上滑

遇见上面这个问题，我们的解决方案是：手动设置输入框位置。

- js文件

```js
// 输入框获取焦点
foucus:function (e) {
   this.setData({typerHeight: e.detail.height})
},
// 输入框失去焦点
blur:function () {
   this.setData({typerHeight: 0})
},
```

- wxml文件

```html
<view class="tc-board"  style="bottom:{{typerHeight}}px" >
	......
</view>
```

这样，当输入框获取焦点时，会获取到键盘的高度，然后把输入框这个view的bottom样式，设置成你获取的高度，就完美的贴在输入框上方。当输入框失去焦点时，高度设置成0，输入框view又回到了页面的底部。

## 3. 👻异步请求回调 + Token验证

为了避免在业务中书写繁杂的if else语句嵌套，或者回调函数

```js
// 方法一
onLoad:function (e) {
   // if嵌套
   if(){
		if(){
			if(){ // do something }
		}
   }

   // 回调陷阱
   func1(data,func(){
		func2(data,func(){
			func3(data,func(){
				// do something
			})
		})
   })
}
```

我的做法是，为方法添加promise，举个栗子🥗：

```js
/**
 * 统一post请求接口
 * @param {*} e “url,data,contentType,noOuth”
 */
function post(e){
  // token 保存在缓存中，有需要时调取
  let header = { 'Content-Type': contentType, 'Authorization':'Bearer ' + getCache('accessToken') }

  // 封装在promise中
  return new Promise(function (resolve, reject) {
    wx.request({
      url:  config.domain + e.url , // domain统一放在config中
      data:e.data,
      method: 'POST',
      header: header,
      success: res => {
        // console.log(res)
        if(res.data.code == 200 ){
          resolve(res.data)		// 请求成功，返回数据
        }
        else{
          wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1500,
          });
          reject(res.data.msg)	// 请求出错，显示错误
        }
      },
      fail: res => {	// 请求失败
        wx.showToast({
          title:  '请求发送失败',
          icon: 'none',
          duration: 1500,
        });
      }
    })
  })
}
```

页面js文件

```js
// 方法一
onLoad:function (e) {
   fun.post({ url:'...',data:{...} })
   .then( res => console.log(res) )		// 步骤一
   .then( res => console.log(res) )		// 步骤二
   .then( res => console.log(res) )		// 步骤三
   .catch( res => console.log(res) )	// 捕捉异常
}
```

## 4. 👻接口统一管理

有了上述的post接口，我们在开发中会有很多的请求接口，如果都写在页面中，难以管理，如有修改，要一个个页面找过去，比较麻烦，我的做法是：

在模块目录下新建一个js，用来保存所有接口信息。为什么在模块下呢？因为考虑到可能有不同的分包、如果都写在一起会太多，分太细又带来管理的不便，具体如何，请根据具体项目来操作。

- api接口统一管理文件

```js
/**
 * 该模块下所有接口
 * 接口参数：
 *  url: just url
 *  contentType: default:false( use urlencoded ) or true( use json )
 *  noOuth: default:false( hase Authorization ) or true( no Authorization )
 */
const constApi = {
	// 获取用户信息
	getUserInfo : {		// 定义接口调用的名字
		url: 'api/v1/userinfo'
	},
	// 获取用户设置
	getUserSetting: {
		url: 'api/v1/usersetting',
		outh:true	// 需要鉴权
	}
}

/**
 * 对外接口统一调用
 * @param {*} name  在api文件中的key
 * @param {*} data  要post的数据
 */
const http = async function(key,data){
    let api = constApi[key];
    let response = await fun.post({
        url:api.url,
        data:data,
        contentType:api.contentType,
        outh:api.noOuth
    })
    return response
}

export default http
```

- 使用方法

```js
// 导入api文件
import Api from './api-index.js'

onLoad:async function (e) {
	// 用法一
	Api('getUserInfo ',{
		userId:1,
		userPwd:123456,
		...
	})
	.then( res => console.log(res) )
	...

	// 用法二
	let tmp = await Api('getUserInfo',{...})
	this.setData({ list: tmp })
},
```

到时候如果接口修改了，或者地址更换了，就不用满大街去找那些页面用到了接口，一个个修改。只需要在api-index.js中，统一修改和管理了。



