# H5与APP之间的交互

移动端网页运行在手机应用内嵌的浏览器引擎中，这个没有 UI 的内核容器统称 WebView，即 iPhone 的 UIWebView（iOS 2.0–12.0）、WKWebView（iOS 8.0+，macOS 10.10+）和 Android 的 WebView。总之，WebView 就是在手机应用中运行和展示网页的界面和接口（神奇的是，英文 Interface，既可以翻译成 “界面” 也可以翻译成“接口”）。

H5 与原生应用的交互都是通过原生应用中的 WebView 实现的。通过这个环境，H5 可以调用原生应用注入其中的原生对象的方法，原生应用也可以调用 H5 暴露在这个环境中的 JavaScript 对象的方法，从而实现指令与数据的传输。

- 比如，在 Android 应用中，WebView类有一个公有方法addJavascriptInterface，签名为：

```js
public void addJavascriptInterface (Object object, String name)
```

- 判断访问终端

```js

//判断访问终端
function browserVersion(){
    var u = navigator.userAgent;
    return {
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
        iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
        weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
        qq: u.match(/\sQQ/i) == " qq" //是否QQ
    };

```

- **IOS容器**: 在IOS客户端中, 苹果发布iOS8的时候，新增了一个WKWebView组件容器

- **Android容器**: 在安卓客户端中，webView容器与手机自带的浏览器内核一致，多为android-chrome。不存在兼容性和性能问题。

- **RN容器**: 在react-native开发中，从rn 0.37版本开始官方引入了组件，在安卓中调用原生浏览器，在IOS中默认调用的是UIWebView容器。从IOS12开始，苹果正式弃用UIWebView，统一采用WKWebView。


## 1. 基础接口

所谓基础接口，就是首先要规定原生应用和 JS 分别在 WebView 里注入 / 暴露一个什么对象：

- **NativeBridge**：原生应用注入到 WebView 中的对象

- **JSBridge**：JS 暴露在 WebView 中的对象

并约定在这两个对象上分别可以调用什么方法：

- NativeBridge.callNative(action, params, whoCare)

- JSBridge.callJS(action, params, whoAmI)

**NativeBridge**.callNative是由 JS 调用向 Native **传递指令或数据的方法，而JSBridge**.callJS则是由 Native 调用向 JS 传递指令或数据的方法。方法签名中的参数含义如下：

- action：字符串，希望 Native/JS 执行的操作

- params：JSON 对象，要传给 Native/JS 的数据

- whoCare：数值，表示 JS 希望哪个端响应

- whoAmI：数值，表示哪个端调用的 JS

基础接口只有两个对象和两个方法，JS 与 App 间的互操作则通过action和params来扩展和定义。

## 2. 实现模式

对于 JS 而言，虽然这里只定义了一个对象一个方法，但实践中，可以把action对应方法的实现附加到JSBridge上，只要把callJS实现为一个分发方法即可，比如：

```js
window.JSBridge = {}
window.JSBridge.callJS = function({action, params, whoAmI}) {
  return window.JSBridge[action](params, whoAmI)
}
```

这样，所有对callJS的调用，都会转化成对JSBridge上相应action方法的调用，优点是只需一行代码。

另一种实现方式是通过switch...case语句实现调用分发，比如:

```js
function callJS (action, params, whoAmI) {
  params = JSON.parse(JSON.stringify(params))
  switch (action) {
    case 'showSkill':
      const category = params.category
      JSBridge.showSkill(category)
      break
    case 'showSkillDetail':
      const id = params.id
      JSBridge.showSkillDetail(id)
      break
    case 'otherAction':
      // some code
      break
    default:
  }
}
// JS暴露给应用的通用接口
const SpkJSBridge = {}
// 全部接口
JSBridge.callJS = callJS
```

这样实现的优点是所有方法一目了然，当然同样也是把所有相关接口都附加到同一个JSBridge对象上。

## 3. 单向调用

由 JS 发起的单向调用 App 的操作，主要涉及加载 URL 和切换到原生界面，可对应如下action：

- loadUrl：加载另一个 URL

- loadContent：跳转到原生界面

1. **loadUrl**调用的参考协议如下：

```js
NativeBridge.callNative({
    action: 'loadUrl',
    params: { url },
    whoCare: 0
})
```

这里**NativeBridge**是 App 的原生对象，其callNative方法被调用时，会收到一个对象（字典 / 映射）参数。根据这个参数的action属性的值，App 可知需要执行的操作是加载 URL。于是再取得params属性中的url，发送请求即可。

2. loadContent调用的参考协议如下：

```js
NativeBridge.callNative({
  action: "loadContent",
  params: {
    type: "album",
    content: {
      album_id: "1"
    }
  },
  whoCare: 0
})
```

这里通过params向 App 传递了必要参数，App 负责切换到相应的原生界面。

- can_back：询问 JS 是否返回前是否需要用户确认

```js
JSBridge.callJS({
  action: "can_back",
  params: {},
  whoAmI: 1/2
})
```

can_back用于 App 询问 JS：在返回上一级界面前，是否弹窗提示用户？

返回值中的can如果是true，则直接返回，不提示；如果是false，则弹出一个确认框，请用户确认。另一个值target是与 App 约定的返回目标，比如prev表示返回上一级，top表示返回顶级，等等。

## 4. 双向调用

双向调用是 JS 先调用 App，然后 App 在完成操作后再调用 JS，双向通常都需要传递数据。双向调用主要涉及 JS 调用 App 原生组件和用户点击右上角按钮，可对应如下**action**：

- **loadComponent**：调用原生组件

- **displayNextButton**：显示 “下一步”“保存” 或“完成”按钮

loadComponent的参考协议如下：

```js
NativeBridge.callNative({
  action: 'loadComponent',
  params: {
    type: 'location',
    value,
    callbackName: 'set_location'
  },
  whoCare: 0
})
```

在这个例子中，涉及 JS 调用 App 显示其实现的城市选择组件：type: 'location'，用户选择完城市之后，App 再调用set_location，将用户选择的城市名称传给 JS：

```js
JSBridge.callJS({
  action: 'set_location',
  params: {
    value: '北京市朝阳区',
  },
  whoAmI: 1/2
})
```

根据具体业务场景，可能存在如下三种情况：

1. 当前 WebView 不需要显示右上角按钮，比如详情页；

2. 当前 WebView 需要显示 “下一步” 或“保存”按钮，但需要禁用变灰；

3. 当前 WebView 需要显示 “下一步” 或“保存”按钮，允许用户点击。

displayNextButton协议的参考实现如下：

```js
NativeBridge.callNative({
  action: "displayNextButton",
  params: {
    name: "下一步",
    enable: false,
    callbackName: "save_form"
  },
  whoCare: 0
})
```

以上代码示例表明，JS 调用 App，告诉 App 显示 “下一步” 按钮，但是要禁用变灰，因为enable: false。如果传递的是enable: true，那么用户就可以点击 “下一步” 按钮了。点击之后，App 再调用 JS 的save_form。最后，如果不想显示按钮，可以传递name: ''。


## 5. h5向ios客户端发送消息

在ios中，并没有现成的api让js去调用native的方法，但是UIWebView与WKWebView能够拦截h5内发起的所有网络请求。所以我们的思路就是通过在h5内发起约定好的特定协议的网络请求，如<span style="color:red;">'jsbridge://bridge2.native?params=' + encodeURIComponent(obj)</span>然后带上你要传递给ios的参数；然后在客户端内拦截到指定协议头的请求之后就阻止该请求并解析url上的参数，执行相应逻辑

### 在H5中发起这种特定协议的请求方式分两种：

1. 通过localtion.href；

通过location.href有个问题，就是如果我们连续多次修改window.location.href的值，在Native层只能接收到最后一次请求，前面的请求都会被忽略掉。

2. 通过iframe方式；

使用iframe方式，以唤起Native;以唤起分享组件为例

```js
// h5 js code 将它封装一下
  function createIframe(url){
    var url = 'jsbridge://getShare?title=分享标题&desc=分享描述&link=http%3A%2F%2Fwww.douyu.com&cbName=jsCallClientBack';
    var iframe = document.createElement('iframe');
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.display = 'none';
    iframe.src = https://segmentfault.com/a/url;
    document.body.appendChild(iframe);
    setTimeout(function() {
        iframe.remove();
    }, 100);
  }
```

我们在请求参数中加上了cbName=jsCallClientBack，这个jsCallClientBack为JS调用客户端所定义的回调函数，在业务层jsBridge封装中，我们传入一个匿名函数作为回调，底层将这个函数绑定在window的jsbridge对象下并为其定义一个独一无二的key，这个key就是jsCallClientBack，客户端在处理完逻辑后，会通过上面已经介绍过的方法来回调window下的方法。

> ps: 在将回调绑定在window下时，特别注意要使用bind保持函数内this的原有指向不变

## IOS客户端调用H5方法

Native调用Javascript语言，是通过UIWebView组件的stringByEvaluatingJavaScriptFromString方法来实现的，该方法返回js脚本的执行结果。

```js
// IOS swift code
 webview.stringByEvaluatingJavaScriptFromString("window.methodName()")
```

它其实就是执行了一个字符串化的js代码，调用了window下的一个对象，如果我们要让native来调用我们js写的方法，那这个方法就要在window下能访问到。但从全局考虑，我们只要暴露一个对象如JSBridge给native调用就好了。

## H5调用Android客户端方法

在安卓webView中有三种调用native的方式：

1. 通过schema方式，客户端使用shouldOverrideUrlLoading方法对url请求协议进行解析。这种js的调用方式与ios的一样，使用iframe来调用native方法。

通过在webview页面里直接注入原生js代码方式，使用addJavascriptInterface方法来实现。

```js
// android JAVA code
  class JSInterface {
    @JavascriptInterface
    public String getShare() {
        //...
        return "share";
    }
}
webView.addJavascriptInterface(new JSInterface(), "AndroidNativeApi");
```

在页面的window对象里注入了AndroidNativeApi对象。在js里可以直接调用原生方法。

2. 使用prompt,console.log,alert方式，这三个方法对js里是属性原生的，在android webview这一层是可以重写这三个方法的。一般我们使用prompt，因为这个在js里使用的不多，用来和native通讯副作用比较少。

```js

 // android JAVA code
class WebChromeClient extends WebChromeClient {
    @Override
    public boolean onJsPrompt(WebView view, String url, String message, String defaultValue, JsPromptResult result) {
        // 重写window下的prompt，通过result返回结果
    }
    @Override
    public boolean onConsoleMessage(ConsoleMessage consoleMessage) {

    }
    @Override
    public boolean onJsAlert(WebView view, String url, String message, JsResult result) {

    }

} 
```

> 一般而言安卓客户端选用1、2方案中的一种进行通信，从前端层面来讲，推荐客户端都使用schema协议的方式，便于前端jsBridge底层代码的维护与迭代。

## Android客户端调用H5方法

在安卓APP中，客户端通过webview的loadUrl进行调用:

```js
// android JAVA code
 webView.loadUrl("javascript:window.jsBridge.getShare()");
```

H5端将方法绑定在window下的对象即可，无需与IOS作区分

## H5调用RN客户端

N的webView组件实际上就是对原生容器的二次封装，因此我们不需要直接通过schema协议来通信，只需要使用浏览器postMessage、onMessage来传递消息即可，类似于iframe，而真正的通信过程RN已经帮我们做了

```js
// h5 js code
window.postMessage(data);
// rn js code
<WebView
      ref="webView"
      source={require('../html/index.html')}
      injectedJavaScript={'window.androidConfig = {}'}    // 通过这个props可以在webView初始化时注入属性方法
      onMessage={e => {
          let { data } = e.nativeEvent;
        //...
      }} />
```

## RN客户端调用H5

```js
this.refs.webView.postMessage({
    cbName: 'xxx',
    param: {}
}); 
```

## 前端jsBridge的封装

```js
class JsBridge {
    static lastCallTime
    constructor() {
        if (UA.isReactNative()) {
           document.addEventListener('message', function(e) {
               window.jsClientCallBack[e.data.cbName](e.data.param);
           });
         }
    }
    // 通用callNtive方法
    callClient(functionName, data, callback) {
        // 避免连续调用
        if (JsBridge.lastCallTime && (Date.now() - JsBridge.lastCallTime) < 100) {
            setTimeout(() => {
                this.callClient(functionName, data, callback);
            }, 100);
            return;
        }
        JsBridge.lastCallTime = Date.now();
    
        data = data || {};
        if (callback) {
            const cbName = randomName();
            Object.assign(data, { cbName });
            window.jsClientCallBack[cbName] = callBack.bind(this);
        }
    
        if (UA.isIOS()) {
            data.forEach((key, value) => {
                try {
                    data[key] = JSON.stringify(value);
                } catch(e) { }
            });
            var url = 'jsbridge://' + functionName + '?' parseJSON(data);
            var iframe = document.createElement('iframe');
            iframe.style.width = '1px';
            iframe.style.height = '1px';
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);
            setTimeout(() => {
                iframe.remove();
            }, 100);
        } else if (UA.isAndroid()) {    //  这里安卓客户端使用的是上面说的第二种通信方法
            window.AndroidNativeApi && 
            window.AndroidNativeApi[functionName] && 
            window.AndroidNativeApi[functionName](JSON.stringify(data));
        } else if (UA.isReactNative()) {     //rn的<webView>组件可以设置props.userAgent来让H5识别
            window.postMessage(
              JSON.stringify(data);
            );
        } else {
            console.error('未获取platform信息，调取api失败');
        }
    }
    // 业务层自定义方法
    getShare(data, callBack) {
            //..
    }
}
```