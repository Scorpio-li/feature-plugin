<!--
 * @Author: Li Zhiliang
 * @Date: 2021-03-03 11:54:34
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2021-03-03 13:56:00
 * @FilePath: /feature-plugin/project/echarts/tools.md
-->

## 1、Y坐标文字过长被遮挡

解决办法：设置 grid 配置项的 left 为任意数值后，图表会计算y轴宽度并自适应

```js
grid: { 
    left: 0, // 与容器左侧的距离
    right: 0, // 与容器右侧的距离 
    bottom: "3%", 
    top: "0", 
    containLabel: true // grid 区域是否包含坐标轴的刻度标签 
}
```

## 2、X轴标签过长，展示不全

解决办法：旋转角度，倾斜展示或者省略号表示

```js
xAxis: {
  axisLabel: {
    color: "#5e6877", // x轴字体颜色
    interval: 0, // 0 强制显示所有标签,默认auto
    rotate: 20 // 刻度标签旋转的角度
  }
}

// 省略号表示
xAxis: {
  axisLabel: {
	    formatter: function (value) {
	        if (value.length > 6) {
	            return value.substring(0, 6) + "...";
	        } else {
	            return value;
	        }
	    }
	}
}
```

## 3、legend图例内容过长，与图表发生重叠

解决办法：格式化换行

```js
legend: {
  type: 'scroll', // 可滚动翻页的图例，当图例数量较多时可以使用
  orient: 'vertical',
  textStyle: {
      lineHeight: 20
  },
  formatter: function(sStr) { // 需要配合textStyle.lineHeight设置行高，不然换行后行间距太小
      var str = "";
      var l = 0;
      var schar;
      for (var i = 0; schar = sStr.charAt(i); i++) {
          str += schar;
          // /[^\x00-\xff]/ 匹配双字节字符，如中文、全角符号，其它单字节字符如字母、数字、半角符号
          l += schar.match(/[^\x00-\xff]/) ? 2 : 1;
          if (l > 10) {
              // 只有原字符串内容长度大于需要换行的长度临界点，才需要换行
              str += (sStr.length > str.length) ? '\n' : '';
              l = 0;
          }
      }
      return str;
  }
}
```

## 4、tooltip显示内容较多时，超出屏幕，显示不全

解决办法：添加 confine 属性

```js
tooltip: {
    confine: true // 是否将 tooltip 框限制在图表区域内
}
```

## 5、折线图整体数据值偏大，显示范围幅度不明显

解决办法：添加 scale 属性，设置 Y轴 不是从 0 开始

```js
yAxis: {
    type: 'value',
    scale: true // 按比例显示
}
```

## 6、移动端柱形图内容较多，配置屏幕旋转

解决办法：在容器标签上添加一个旋转的 class 样式（版本（4.8.0），显示没有问题）

```js
.horizontalScreen {
    transform: rotate(90deg);
    transform-origin: bottom left;
    position: absolute;
    top: -100vw;
    height: 100vw;
    width: 100vh;
    background-color:#FFF;
    z-index: 100;
}
```

## 7、柱形图默认宽度自适应，导致多条数据与单条数据宽度显示不一致

解决办法：增加 barMaxWidth 属性，设置一个最大宽度值

```js
series: [
  {
  	type: 'bar',
	barMaxWidth: 30 // 可以是绝对值例如 40 或者百分数例如 '60%'，百分数基于自动计算出的每一类目的宽度。
  }
]
```

## 8、图表响应式缩放

解决办法：监听浏览器窗口的 resize 方法，可以添加多个图表

```js
window.addEventListener('resize', () => { 
    myChart.resize();  
    // myChart2.resize();  
    // myChart3.resize();
})
```

## 9、图表内容过多，一屏或者容器显示不下

解决办法：可以增加滑块缩放滚动，加上 dataZoom 配置

```js
dataZoom: [
  {
    show: true,
    startValue:  startOffset, // 数据窗口范围的起始数值
    endValue: endOffset // 数据窗口范围的结束数值
  },
  {
    type: 'inside'
  }
]
```

## 10、legend设置单选

解决办法：增加 selectedMode 属性，设置为 single

```js
legend: {
    data:[],
    selectedMode: 'single',
}
```

## 11、实现折线图局部虚线

解决办法：series 中两组数据 name 相同，data 数据部分，实现或者虚线无值的部分用空来占位。

```js
option = {
  xAxis: {
    type: 'category',
    data: ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    name: '产量',
    data: [820, 932, '', '', 930, 1200, 1000, 1110, '', ''],
    type: 'line',
    itemStyle: {
      normal: {
        lineStyle: {
          width: 2
        }
      }
    }
  },
  {
    name: '产量',
    data: ['', 932, 800, 900, 930, '', '', 1110, 1200, 900],
    type: 'line',
    itemStyle: {
      normal: {
        lineStyle: {
          width: 2,
          type: 'dashed'
        }
      }
    }
  }
  ]
};
```

## 12、柱状图实现重合并且以虚线展示

解决办法：barGap 表示不同系列的柱间距离，默认为30%，通过设置 barGap 为 -100% 可以让柱形图实现重合。

```js
option = {
  xAxis: {
    data: ['a', 'b', 'c', 'd'],
    axisTick: { show: false }
  },
  yAxis: {
    splitLine: { show: false }
  },
  animationDurationUpdate: 1200,
  series: [{
    type: 'bar',
    itemStyle: {
      normal: {
        color: 'transparent',
        barBorderColor: 'tomato',
        barBorderWidth: 2,
        barBorderRadius: 0,
        borderType: "dotted"
      }
    },
    silent: true,
    barWidth: 40,
    barGap: '-100%', // 柱子重叠
    data: [60, 60, 60, 60]
  }, {
    type: 'bar',
    barWidth: 40,
    z: 10,
    data: [45, 60, 13, 25]
  }]
};
```

## 13、实现多Y轴展示

解决办法：给 yAxis 对象设置多组数组，分别代表不同 Y轴；在 series 中配置时，每项需配置 yAxisIndex，不设置改参数，默认为0。

```js
// 通过多Y轴，来实现多个维度对比来看数据的变化
var colors = ['#5793f3', '#d14a61', '#675bba'];
option = {
  color: colors,
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  legend: {
    data: ['蒸发量', '降水量', '平均温度']
  },
  xAxis: [
    {
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: '蒸发量',
      min: 0,
      max: 250,
      position: 'right',
      axisLine: {
        lineStyle: {
          color: colors[0]
        }
      },
      axisLabel: {
        formatter: '{value} ml'
      }
    },
    {
      type: 'value',
      name: '降水量',
      min: 0,
      max: 250,
      position: 'right',
      offset: 80,
      axisLine: {
        lineStyle: {
          color: colors[1]
        }
      },
      axisLabel: {
        formatter: '{value} ml'
      }
    },
    {
      type: 'value',
      name: '温度',
      min: 0,
      max: 25,
      position: 'left',
      axisLine: {
        lineStyle: {
          color: colors[2]
        }
      },
      axisLabel: {
        formatter: '{value} °C'
      }
    }
  ],
  series: [
    {
      name: '蒸发量',
      type: 'bar',
      data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
    },
    {
      name: '降水量',
      type: 'bar',
      yAxisIndex: 1,
      data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
    },
    {
      name: '平均温度',
      type: 'line',
      yAxisIndex: 2,
      data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
    }
  ]
};
```

## 14、图表在旧容器上重新渲染不出来问题

解决办法：首先，官方文档也有说明，创建一个 ECharts实例，返回 echartsInstance，不能在单个容器上初始化多个 ECharts实例。
Echarts 每次实例化都会在容器标签上产生一个唯一的 echartsInstance ID，那可以重新渲染之前把容器标签的 _echarts_instance_ 属性移除，重新 echarts.init 后就会自动生成一个新的 echartsInstance ID ，此后图表就可以正常渲染了。

```js
var chartEle = document.getElementById('chartId');
chartEle.removeAttribute('_echarts_instance_'); // 移除容器标签的 '_echarts_instance_' 实例属性，使用echarts.init重新生成一个新的实例ID
var myChart = echarts.init(chartEle);
myChart.setOption(option);
```

## 15、图表上添加点击跳转

解决办法：Echarts实例上可以添加监听鼠标事件，鼠标事件包括 'click'、'dblclick'、'mousedown'、'mousemove'、'mouseup'、'mouseover'、'mouseout'、'globalout'、'contextmenu'。

```js
myChart.on('click', function(params) {
    window.open(params.data.url);
});
```

## 16、图表上添加水印

解决办法：Echarts实例上可以添加监听鼠标de 事件，鼠标事件包括 'click'、'dblclick'、'mousedown'、'mousemove'、'mouseup'、'mouseover'、'mouseout'、'globalout'、'contextmenu'。

```js
// 在前端设置样式然后添加到背景中             
var waterMarkText = 'ECHARTS';  //水印名称
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');  //水印画布
canvas.width = canvas.height = 100;  //水印高宽
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.globalAlpha = 0.2; //水印透明度
ctx.font = '20px Microsoft Yahei';  //水印字体 
ctx.translate(50, 50);   //水印完整性
ctx.rotate(-Math.PI / 4);
ctx.fillText(waterMarkText, 0, 0);//水印显示情况

//在option中添加水印背景
option = {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    backgroundColor: {
        type: 'pattern',
        image: canvas,
        repeat: 'no-repeat'
    },
    series: [{
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
    }]
};
```

## 17、图表上添加工具栏

内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具。

```js
option = {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true}, 
            dataZoom : {show: true}, // 区域缩放
            dataView : {show: true, readOnly: false}, // 数据预览
            magicType : {show: true, type: ['line', 'bar']}, // 切换类型
            restore : {show: true}, // 刷新
            saveAsImage : {show: true} // 保存
        }
    },
    series: [{
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
    }]
};
```