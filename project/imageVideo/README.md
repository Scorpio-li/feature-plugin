# 移动端video的痛点

其实移动对于video标签极度不友好，为了用户体验度避免浪费用户的流量，移动端浏览器只能让用户触发事件去播放video。如点击播放按钮或者监听document的触摸事件，在Safari、 谷歌浏览器、QQ浏览器均有各类奇葩问题无法实现完美自动播放的效果；

# 移动端video的局限：

- iOS下不能自动播放，需要至少touch一次屏幕，这个有时候还挺烦人的，例如我们想做一个H5 app闪屏的时候就蛋疼了。

- 不能在中间穿插棒棒的交互效果，例如，需要视频某一帧暂停，鼠标hover或者touch的时候，当前画面有交互效果，就很不好处理。

- 播放的速率不能随心所欲控制，视频完成也就定死了。

- 如果有些信息是动态的，需要与用户信息关联，则视频方案也会面临很大的调整，因为总不可能每一个用户生成一个不一样的视频，需要辅助额外手段满足需求（例如CSS覆盖定位）。

# 序列图片视频化技术高性能实现方法:

1. 图片DOM对象预加载，放在内存中；

2. 播放开始，页面append当前图片DOM，同时移除上一帧DOM图片（如果有），保证页面中仅有一个图片序列元素； 对，很简单，没什么高超的技巧，但就是这种实现策略，对页面的开销是最小的，最终运行体验是最好的。
