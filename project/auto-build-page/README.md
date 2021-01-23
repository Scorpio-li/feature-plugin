# 前端工程化-自动生成页面

## 编辑配置文件

我们在auto-page文件夹下新建一个addConfig.js文件，里面存放我们定义的配置：

```js
var addConfig = [
  {
    // 测试生成表格页
    open: true, // 参与生成 false表示改配置不参与生成页面
    helloworld: false, // 是否是空白页
    desc: '自动生成表格页', // 页面描述
    name: 'autoTablepage', // 页面名称
    getlist: {
      // 表格数据请求相关
      method: 'GET',
      url: 'http://test.req/getlist',
    },
  },
  {
    // 测试生成空白页
    open: true,
    helloworld: true,
    desc: '自动生成空白页面',
    name: 'autoHellopage',
  },
]
module.exports = addConfig
```

## 按照配置文件生成页面.vue文件

- 我们在auto-page文件夹下新建一个template-table.vue文件，存放我们的表格页模版，我们使用的是element-ui组件：

```vue
<template>
  <div class="deduction">
    <header>%title%</header>
    <main>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template v-slot="props">
            <pre v-html="formatOther(props.row)"></pre>
          </template>
        </el-table-column>
        <el-table-column v-for="(item,index) in tableDataHeader" :key="index" :prop="item.prop" :label="item.col">
          <template slot-scope="scope">
            {{scope.row[scope.column.property]}}
            <!-- {{scope.row}}
            {{scope.column.property}} -->
            <!-- 渲染对应表格里面的内容 -->
          </template>
        </el-table-column>
      </el-table>
    </main>
  </div>
</template>

<script>
import axios from "axios";
const CONFIG={
  method:"%method%",
  geturl:"%geturl%",
};
export default {
  data() {
    return {
      tableData: [],
      tableDataHeader: [],

    };
  },
  methods: {
    formatOther(row) {
      return JSON.stringify(row, null, 2);
    },
    getList(params={}) {
      axios({
        method: CONFIG.method,
        url: CONFIG.geturl,
        data: params
      }).then(res=>{ // 后端返回的数据需要按照这种格式
        console.log(res);
        this.tableData=res.data.tableData;
        this.tableDataHeader=res.data.tableDataHeader;
      });
    }
  },
  mounted(){
    this.getList();
  }
};
</script>
```

- 在auto-page文件夹下新建一个build-page.js文件，里面写的是整个自动化操作的代码

```js
var addConfig = require('./addConfig')
var fs = require('fs')
var path = require('path')
var shell = require('shelljs')

shell.echo('>>>>>>')
shell.echo('开始新建页面')
addConfig.forEach((ele) => {
  if (ele.open) {
    buildPage(ele)
  }
})
```

## 添加路由

接下来是添加路由，在此之前我们还是需要添加一个路由的模板文件，在auto-page文件夹下新建一个template-route.txt文件：

```
{
  path: '%path%',
  component: Home,
  name: '%name%',
  redirect: { path: '%repath%' },
  children: [
    {
      path: '%repath%',
      component: (resolve) =>
        require(['%requirepath%'], resolve),
      name: '%name2%'
    }
  ]
},
```

新建了一个addRoute.js文件，然后在routes.js文件中引入，和原来的合并以下即可

## 在package.json文件里面的scripts里面添加运行的脚本