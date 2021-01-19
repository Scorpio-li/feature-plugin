<!--
 * @Author: Li Zhiliang
 * @Date: 2021-01-15 18:29:08
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2021-01-16 11:02:00
 * @FilePath: /feature-plugin/functionModel/clickContent.md
-->
# JS判断点击区域

- 适用场景：显示页面弹窗时,用户点击页面其他地方弹窗自动关闭.

```js
// HTML exitContent.vue
<div id="facePanel">
	<div v-show="showFace">这是个弹窗</div>
</div>

// JavaScript
handleClick(e) {
	let facePanel = document.getElementById('facePanel')
	if(!facePanel.contains(e.target) && this.$refs.editContent.showFace){
	  this.$refs.editContent.showFace = false
	}
}
```

