<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <input type="button" value="点击下载" @click="handleDownload">
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  methods: {
    handleDownload() {  
      axios({    
        method: 'post',    
        url: "http://localhost:3000/download",    
        data: {      
          test: "test data"    
        },
        responseType: "arraybuffer" // arraybuffer是js中提供处理二进制的接口
      }).then(response => {      
          console.log(response.data) 
          // 将二进制数据生成一个文件url，用URL.createObjectURL生成url时需要传入Blob类型的参数。
          // 生成了url后就是模拟a标签来下载。
          // 用返回二进制数据创建一个Blob实例          
          let blob = new Blob([response.data], {            
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
          }) // for .xlsx files          

          // 通过URL.createObjectURL生成文件路径          
          let url = window.URL.createObjectURL(blob)          

          // 创建a标签          
          let ele = document.createElement("a")          
          ele.style.display = 'none'          

          // 设置href属性为文件路径，download属性可以设置文件名称          
          ele.href = url          
          ele.download = "测试文件"          

          // 将a标签添加到页面并模拟点击          
          document.querySelectorAll("body")[0].appendChild(ele)          
          ele.click()          

          // 移除a标签          
          ele.remove() 
      })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
