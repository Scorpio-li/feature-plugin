<!--
 * @Author: Li Zhiliang
 * @Date: 2021-01-05 18:01:16
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2021-01-05 18:01:18
 * @FilePath: /feature-plugin/functionModel/readSchedule/README.md
-->
## 用JS达到实时进度提示效果

- 滚动距离：document.documentElement.scrollTop || document.body.scrollTop;

- 获取文档真实高度：document.documentElement.scrollHeight;

- 获取浏览器窗口可视高度：document.documentElement.clientHeight;

> 这里需要注意的是：scrollTop指的是啥？页面滚动条纵坐标位置。也就是页面相对于窗口显示区左上角的Y坐标。所以有的地方也用下面的API代替：window.pageYOffset

