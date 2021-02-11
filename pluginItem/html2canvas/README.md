# html2canvas

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

## [html2canvas](http://html2canvas.hertzen.com/)(前端快照功能)

- html2canvas提供将dom绘制到canvas

- file-saver：提供将Blob导出为本地文件

- 整体流程：dom => html2canvas => canvas => blob => file-saver => image

```js
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

const dom = document.getElementById('html-to-canvas')
html2canvas(dom, {
  useCORS: true,
})
  then(canvas => {
    const blob = canvas.toBlob((blod: Blob | null) => {
      if (blob) {
        saveAs(blob, 'html2canvas.png')
      }
    })
  })
```

- 问题：

1. 跨域：由于canvas对于图片资源的同源限制，如果画布中包含跨域的图片资源则会污染画布，如上对于CORS介绍中用讲到使用drawImage将Images/video画面绘制到canvas需要配合CORS使用。可以通过配置useCORS: true，且img标签配置crossOrigin = 'anonymous'支持CORS。

2. 资源加载不全：图片资源在生成快照是还未完全加载，造成快照内容不全，通过Promise.all保证图片资源加载完成，并开启快照生成功能。

```js
// 加载图片
const toBlobURL = (url: string) => {
  return new Promise((resolve, reject) => {
    const canvasDom = window.document.createElement('canvas')
    const ctx = canvasDom.getContext('2d')
    const img = window.document.createElement('img')
    img.crossOrigin = 'anonymous'
    img.src = url
    
    img.onload = () => {
      canvasDom.width = img.width
      canvasDom.height = img.height
      ctx!.drawImage(img, 0, 0)

   	  canvasDom.toBlob((blob: Blob | null) => {
        if (blob) {
          const blobURL = URL.createObjectURL(blob)
    	  resolve(blobURL)
    	} else {
          reject()
        }
        })
      }

   img.onerror = () => {
     reject()
    }
  })
}

// 加载内容
const imgLists = imgContainerDom.querySelectorAll('img')
Promise.all(
  Array.from(imgLists).map((imgDom, i) => {
     return toBlobURL(imgDom.src)
  }),
)
  .then(res => {
    for (let i = 0; i < imgLists.length; i++) {
      imgLists[i].src = (res as any)[i]
  	}
  })
  .catch((e) => {
    console.log('enter error handle')
    console.log(e)
  })
```

3. 微信导出不成功：issues：https://github.com/niklasvh/html2canvas/issues/2205 建议使用"html2canvas": "1.0.0-rc.4"

> 在亲自调研了html2canvas库并使用的过程中, 笔者发现了很多问题, 比如如果样式中出现%单位, 或者有一些图片背景的问题, 导致html2canvas并没有很好的work, 而且渲染还原度和清晰度都有问题, 所以笔者暂时没有深入研究(不过这些问题可以通过修改库本身解决)
