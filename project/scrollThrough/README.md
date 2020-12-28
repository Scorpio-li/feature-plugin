# 解决 移动端 弹窗 滚动穿透问题

在移动端的H5页面中，我们经常会遇到 “点击按钮-->弹窗-->选择选项” 这样的场景。而在选项过多出现滚动条时，滚动滚动条至容器的底部或者顶部。再往上或往下拖动滚动条时，滚动动作会出现穿透，这时候底部的body也会一起滚动。

问题总结：内容在滚动到容器的顶部或者底部时，再向上或向下 强行滚动 ，则出现滚动穿透

## 解决方案

1. 使用js去控制和改变css

```js
1. 弹窗出现
	1.1. 记录点击出现弹窗按钮位置的scrollTop
	1.2. 给body样式{'overflow': 'hidden'}
2. 弹窗关闭
	2.1. 取消body样式{'overflow': 'hidden'}
	2.2. 给body样式{'top': scrollTop}
    
优点：实现简单快捷
缺点：在弹窗一开一关的时间段，如果弹窗不是沾满整个窗口，则会看到body闪烁
```

2. 使用js去控制弹窗内容区的默认滚动事件

```js
1. 弹窗出现
    1.1. 监听内容容器layoutBox的touchstart和touchmove事件
    1.2. 监听touchstart事件，得知手指开始滚动内容区的起始位置targetY
    1.3. 监听touchmove事件，得知滚动内容区的过程中，变化的位置newTargetY
    1.4. 拿到 内容滚动到容器顶部的距离 scrollTop / 内容可滚动的高度 scrollHeight / 当前容器的高度 clientHeight
    1.5. 在滚动到顶部和滚动到底部时，阻止内容容器的默认行为。（关键点）
2. 弹窗正常关闭

优点：从出现滚动穿透问题的源头出发，把问题解决，js实现不存在ios兼容问题
缺点：实机验证，个别品牌的机型存在兼容性问题
```

3. 弹窗内容区禁止滚动，使用js模拟滚动条

```js
1. 弹窗出现 
  1.1. 监听touchmove事件，全程阻止默认行为 
  1.2. 监听touchstart和touchmove事件记录手指的移动距离，使用transform: translate3d()属性，实现内容滚动 
2. 弹窗正常关闭

优点：js实现不存在ios兼容问题
缺点：ios上丢失了原生滚动条的回弹体验
```

## 初步实现

```js
/**
 * @author cunhang_wei
 * @description 解决弹窗内容区滚动穿透到body的问题
 * @param $refs.layoutBox 需要事先指定 内容容器
 */

export default {
    data () {
        return {
            targetY: 0
        }
    },

    mounted () {
        if (this.$refs.layoutBox) {
            this.$el.addEventListener('touchstart', this.handleTouchstart)
            this.$el.addEventListener('touchmove', this.handleTouchmove, false)
        }
        
    },

    methods: {
        handleTouchstart (e) {
            this.targetY = Math.floor(e.targetTouches[0].clientY) // 手指起始触摸位置
            console.log('handleTouchstart', this.targetY)
        },
        handleTouchmove (e) {
            let layoutBox = this.$refs.layoutBox // 内容容器
            let newTargetY = Math.floor(e.targetTouches[0].clientY) // 手指滑动中触摸位置
            let sTop = layoutBox.scrollTop // 内容滚动到容器顶部的高度
            let sHeight = layoutBox.scrollHeight // 内容的可滚动高度
            let cliHeight = layoutBox.clientHeight // 当前内容容器的高度
            if (sTop <= 0 && newTargetY - this.targetY > 0 && e.cancelable) {
                console.log('下拉到页面顶部')
                e.preventDefault()
            } else if (sTop >= sHeight - cliHeight && newTargetY - this.targetY < 0 && e.cancelable) {
                console.log('上翻到页面底部')
                e.preventDefault()
            }
        }
    }，
    
    beforeDestroy () {
        if (this.$refs.layoutBox) {
            this.$el.removeEventListener('touchstart', this.handleTouchstart)
            this.$el.removeEventListener('touchmove', this.handleTouchmove)   
        }
    }
}
```

写完后发现每一次控制弹窗的滚动穿透，都需要引入这个 mixin 文件，未免有些累赘，查看了Vue的官方文档，发现了一种更好的办法，那就是 全局指令

## 写法优化：

写成一个全局指令 no-through

```js
/**
 * @author cunhang_wei
 * @description 解决弹窗内容区滚动穿透到body的问题（覆盖率90%）
 * @description 用法
 * <ul v-no-through>
 *	<li></li>
 *	<li></li>
 * </ul>
 **/

import state from 'src/vuex/modules/home/state'
export default {
    name: 'no-through',

    bind: function (el, binding) {
        const handleTouchstart = function (event) {
        	// 使用vuex的保存一个全局变量
            state.targetY = Math.floor(event.targetTouches[0].clientY) // 手指起始触摸位置
        }
        const handleTouchmove = function (event) {
            let newTargetY = Math.floor(event.targetTouches[0].clientY) // 手指滑动中触摸位置
            let sTop = el.scrollTop // 内容滚动到容器顶部的高度
            let sHeight = el.scrollHeight // 内容的可滚动高度
            let cliHeight = el.clientHeight // 当前内容容器的高度
            if (sTop <= 0 && newTargetY - state.targetY > 0 && event.cancelable) {
                console.log('下拉到页面顶部')
                event.preventDefault()
            } else if (sTop >= sHeight - cliHeight && newTargetY - state.targetY < 0 && event.cancelable) {
                console.log('上翻到页面底部')
                event.preventDefault()
            }
        }
        el.addEventListener('touchstart', handleTouchstart)
        el.addEventListener('touchmove', handleTouchmove, false)
    },

    unbind: function (el, binding) {
        // 重置全局变量 targetY
        state.targetY = 0
    }
}

// 最后再去 main.js 注册为全局指令，即可使用。
```