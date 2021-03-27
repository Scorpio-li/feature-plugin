<template>
  <div class="wrapper">
    <div class="web-file">
      <!-- 操作栏 -->
      <div class="operate-box nowrap flex justify-between">
        <div class="flex btn-list">
          <div class="page-btn">
            <el-button
              type="default"
              @click="changePdfPage(0)"
              :disabled="currentPage == 1"
              size="mini"
            >
              上一页
            </el-button>
            <div class="page-count">
              <div v-show="pageCount">{{ currentPage }} / {{ pageCount }}</div>
            </div>
            <el-button
              type="default"
              @click="changePdfPage(1)"
              :disabled="currentPage == pageCount"
              size="mini"
            >
              下一页
            </el-button>
          </div>
          <div id="mask-print">
            <el-button type="default" @click="printPdf" icon="el-icon-printer" size="mini">
              打印
            </el-button>
          </div>
          <div id="mask-setting">
            <el-button
              type="default"
              @click="attributeEdit"
              icon="el-icon-setting"
              size="mini"
            >
              遮罩属性设置
            </el-button>
          </div>
          <div id="mask-add">
            <el-button type="default" @click="addMask" size="mini">添加遮罩</el-button>
          </div>
          <el-button type="text" @click="guide" icon="el-icon-info">
            帮助
          </el-button>
        </div>
        <div class="flex btn-list">
          <div id="mask-back">
            <el-button
              type="default"
              @click="stepBack"
              icon="el-icon-arrow-left"
              size="mini"
            >
              回退
            </el-button>
          </div>
          <div id="mask-clear">
            <el-button
              type="danger"
              @click="clearClean"
              icon="el-icon-refresh-left"
              size="mini"
            >
              撤销
            </el-button>
          </div>
          <el-button @click="goBack" size="mini">返回原文页</el-button>
        </div>
      </div>
      <!-- pdf翻页 -->
      <div v-show="pageCount && pageCount > 0"></div>
      <div class="pdf-box" id="pdf" ref="baseMap" v-if="showPdfBoxFlag">
        <!-- pdf预览 -->
        <pdf
          ref="pdf"
          :src="pdfsrc"
          :page="currentPage"
          @num-pages="pageCount = $event"
          @page-loaded="pageLoaded"
          @loaded="loadPdfHandler"
        ></pdf>
        <div
          class="manager_detail"
          id="manager_detail"
          :class="{ 'accurate-choice': accurateChoiceFlag }"
        >
          <!-- 画布 -->
          <canvas
            id="canvas"
            ref="imgContent"
            :width="canvasObj.width"
            :height="canvasObj.height"
            style="
              position: absolute;
              width: 100%;
              height: 100%;
              left: 0;
              top: 0;
              cursor: crosshair;
            "
          ></canvas>
        </div>
      </div>
    </div>
    <attribute-set
      :title="attribute.title"
      @close="attribute.show = false"
      @ok="setAttribute"
      v-if="attribute.show"
      ref="attribute"
    />
  </div>
</template>
<script>
import { fabric } from "fabric";
import pdf from "vue-pdf";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import AttributeSet from "./AttributeSet";
// 引导页的功能
import Driver from "driver.js"; // import driver.js
import "driver.js/dist/driver.min.css"; // import driver.js css
import steps from "./steps";
export default {
  components: {
    pdf,
    AttributeSet,
  },
  props: {
    pdfsrc: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      canvas: null,
      context: "",
      bgImage: null,
      pageCount: 1, // pdf文件总页数
      currentPage: 1,
      clickFlag: false,
      clickTimer: -1,
      canvasObj: {
        width: 0,
        height: 0,
      },
      json: [],
      basecoordinate: [], //基础坐标数组
      xycoordinate: [], // 左上角的坐标数组
      isMasic: true,
      squareEdgeLength: 20, //马赛克大小
      mouse: {
        started: false,
        x: 0,
        y: 0,
      },
      accurateChoiceFlag: false,
      imgUrl: "",
      // maskPic: "/static/img/fabric/mask.png",
      makeGridObject: {
        beginX: 0,
        beginY: 0,
      },
      makeList: [],
      fillColor: "",
      attribute: {
        show: false,
        title: "属性设置",
        loading: false,
        style: "1", //0代表颜色，1代表马赛克
      },
      driver: null,
      showPdfBoxFlag: false,
    };
  },
  computed: {},
  created() {
    fabric.Object.prototype.setControlsVisibility({
      bl: false, // 左下
      br: false, // 右下
      mb: false, // 下中
      ml: false, // 中左
      mr: false, // 中右
      mt: false, // 上中
      tl: false, // 上左
      tr: false, // 上右
      mtr: false, // 旋转控制键
    });
    this.showPdfBoxFlag = true;
  },
  mounted() {
    this.driver = new Driver({
      //此处为api
      animate: true,
      opacity: 0.5,
      allowClose: false,
      doneBtnText: "完成",
      closeBtnText: "关闭",
      nextBtnText: "下一步",
      prevBtnText: "上一步",
      onReset: (Element) => {
        //这里写逻辑回调
      },
    });
  },
  methods: {
    goBack() {
      this.$emit('back');
    },
    guide() {
      this.driver.defineSteps(steps);
      this.driver.start();
    },
    setAttribute(item) {
      this.attribute.style = item.styleValue;
      this.fillColor = item.styleValue == "0" ? "#fff" : "";
      this.squareEdgeLength = item.maskValue;
      this.drawMake();
    },
    attributeEdit() {
      this.attribute.show = true;
      this.$nextTick(() => {
        let item = {
          styleValue: this.attribute.style,
          maskValue: this.squareEdgeLength,
        };
        this.$refs.attribute.initData(item);
      });
    },
    addMask() {
      this.mouse.started = true;
      this.initCanvasObjAndEvent();
      this.accurateChoiceFlag = true;
    },
    // 返回上一步
    stepBack() {
      if (this.makeList.length > 0) {
        this.makeList.splice(this.makeList.length - 1, 1);
        this.drawMake();
      }
    },
    // 初始化画布对象
    initCanvasObjAndEvent() {
      if (!this.canvas) {
        this.canvas = new fabric.Canvas("canvas");
        let imgContent = this.$refs.imgContent;
        this.context = imgContent.getContext("2d");
        let that = this;
        this.pageTransformedIntoCanvas((pageData, PDF) => {
          let Img = new Image();
          Img.src = pageData;
          that.bgImage = Img;
          Img.onload = () => {
            that.context.drawImage(Img, 0, 0);
            that.context.save();
          };
        });
        this.canvas.on("mouse:down", function (e) {
          that.mousedown(e);
        });
        //鼠标抬起事件
        this.canvas.on("mouse:up", function (e) {
          that.mouseup(e);
        });
        // 移动画布事件
        this.canvas.on("mouse:move", function (e) {
          that.mousemove(e);
        });
      }
    },
    pageLoaded(e) {
      this.currentPage = e;
      this.canvasObj.width = document.getElementById("pdf").offsetWidth;
      this.canvasObj.height = document.getElementById("pdf").offsetHeight;
    },
    // pdf加载时
    loadPdfHandler(e) {
      // this.currentPage = 1; // 加载的时候先加载第一页
    },
    // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
    changePdfPage(val) {
      if (this.clickFlag) return;
      this.clickFlag = true;
      this.clickTimer = setTimeout(() => {
        this.clickFlag = false;
      }, 500);
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--;
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++;
      }
      if(this.canvas)this.canvas.clear();
      this.canvas = null;
      this.showPdfBoxFlag = false;
      this.$nextTick(() =>{
        this.showPdfBoxFlag = true;
      })
    },
    // 鼠标事件
    mousedown(e) {
      if (!this.mouse.started) {
        return false;
      }
      let mouse = this.canvas.getPointer(e.e);
      // this.mouse.started = true;
      let x = mouse.x;
      let y = mouse.y;
      this.mouse = {
        ...this.mouse,
        x,
        y,
      };
      this.makeGridObject = {
        beginX: x,
        beginY: y,
      };
    },
    mousemove(e) {
      if (!this.mouse.started) {
        return false;
      }
      var mouse = this.canvas.getPointer(e.e);
      var w = Math.abs(mouse.x - this.mouse.x),
        h = Math.abs(mouse.y - this.mouse.y);
      if (!w || !h) {
        return false;
      }
    },
    mouseup(e) {
      if (!this.mouse.started) {
        return false;
      }
      this.mouse.started = false;
      this.accurateChoiceFlag = false;
      let endX = e.offsetX;
      let endY = e.offsetY;
      // 马赛克遮罩
      let { beginX, beginY } = this.makeGridObject;
      var mouse = this.canvas.getPointer(e.e);
      var w = Math.abs(mouse.x - beginX),
        h = Math.abs(mouse.y - beginY);
      let obj = {
        beginX,
        beginY,
        w,
        h,
      };
      this.makeList.push(obj);
      this.drawMake();
    },
    pageTransformedIntoCanvas(callback) {
      let that = this;
      html2canvas(document.getElementById("pdf"), {
        allowTaint: true,
        useCORS: true,
      }).then(function (canvas) {
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;
        //竖向打印
        let imgWidth = 595.28;
        let imgHeight = (592.28 / contentWidth) * contentHeight;
        let pageHeight = (contentWidth / 592.28) * 841.89;
        let leftHeight = contentHeight;
        let position = 0;
        if (contentWidth > contentHeight) {
          //横向打印
          imgWidth = 841.89;
          imgHeight = (841.89 / contentWidth) * contentHeight;
        }
        let pageData = canvas.toDataURL("image/jpeg", 1.0);
        let PDF;
        if (contentWidth <= contentHeight) {
          //竖向打印
          PDF = new jsPDF("", "pt", "a4");
        } else {
          //    横向打印
          PDF = new jsPDF("l", "pt", "a4");
        }
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
            leftHeight -= pageHeight;
            position -= 841.89;
            if (leftHeight > 0) {
              PDF.addPage();
            }
          }
        }
        let datauri = PDF.output("dataurlstring");
        let base64 = datauri.split("base64,")[1];
        callback(pageData, PDF);
      });
    },
    drawMake() {
      if(!this.canvas)return;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.drawImage(this.bgImage, 0, 0);
      this.context.save();
      // if (this.canvas) this.canvas.clear();
      this.makeList.forEach((item) => {
        let { beginX, beginY, w, h } = item;
        this.makeGrid(beginX, beginY, w, h);
      });
    },
    clearClean() {
      if (this.canvas) this.canvas.clear();
    },
    printPdf() {
      let base64 = "";
      let datauri = "";
      let that = this;
      this.pageTransformedIntoCanvas((pageData, PDF) => {
        let blob = PDF.output("blob");
        that.print(blob);
      });
    },
    print(blob) {
      var date = new Date().getTime();
      var ifr = document.createElement("iframe");
      ifr.style.frameborder = "no";
      ifr.style.display = "none";
      ifr.style.pageBreakBefore = "always";
      ifr.setAttribute("id", "printPdf" + date);
      ifr.setAttribute("name", "printPdf" + date);
      ifr.src = window.URL.createObjectURL(blob);
      document.body.appendChild(ifr);
      this.doPrint("printPdf" + date);
      window.URL.revokeObjectURL(ifr.src); // 释放URL 对象
    },
    doPrint(val) {
      var ordonnance = document.getElementById(val).contentWindow;
      setTimeout(() => {
        ordonnance.print();
      }, 100);
    },
    makeGrid(beginX, beginY, rectWidth, rectHight) {
      const row = Math.round(rectWidth / this.squareEdgeLength) + 1;
      const column = Math.round(rectHight / this.squareEdgeLength) + 1;
      for (let i = 0; i < row * column; i++) {
        let x = (i % row) * this.squareEdgeLength + beginX;
        let y = parseInt(i / row) * this.squareEdgeLength + beginY;
        this.setColor(x, y);
      }
    },
    setColor(x, y) {
      const imgData = this.context.getImageData(
        x,
        y,
        this.squareEdgeLength,
        this.squareEdgeLength
      ).data;
      let r = 0,
        g = 0,
        b = 0;
      for (let i = 0; i < imgData.length; i += 4) {
        r += imgData[i];
        g += imgData[i + 1];
        b += imgData[i + 2];
      }
      r = Math.round(r / (imgData.length / 4));
      g = Math.round(g / (imgData.length / 4));
      b = Math.round(b / (imgData.length / 4));
      this.drawRect(
        x,
        y,
        this.squareEdgeLength,
        this.squareEdgeLength,
        `rgb(${r}, ${g}, ${b})`,
        2,
        `rgb(${r}, ${g}, ${b})`
      );
    },
    drawRect(
      x,
      y,
      width,
      height,
      fillStyle,
      lineWidth,
      strokeStyle,
      globalAlpha
    ) {
      this.context.beginPath();
      this.context.rect(x, y, width, height);
      this.context.lineWidth = lineWidth;
      if (this.fillColor) {
        fillStyle = this.fillColor;
        strokeStyle = this.fillColor;
      }
      this.context.strokeStyle = strokeStyle;
      fillStyle && (this.context.fillStyle = fillStyle);
      globalAlpha && (this.context.globalAlpha = globalAlpha);
      this.context.fill();
      this.context.stroke();
    },
  },
};
</script>
<style lang="scss" scoped>
.btn-list {
  & > div {
    margin-right: 10px;
  }
  & > div:last-child {
    margin-right: 0;
  }
}
.page-btn {
  text-align: center;
  display: flex;
  align-items: center;
  .page-count {
    min-width: 50px;
    margin: 0 10px;
  }
}
.pdf-box {
  position: relative;
}
.manager_detail {
  position: absolute;
  top: 0;
  left: 0;
}
.web-file {
  width: 65%;
  min-width: 900px;
  margin: 0 auto;
  .pdf-box {
    width: 100%; // height: 55vh;
    overflow: hidden;
  }
}
.accurate-choice {
  cursor: crosshair;
}
</style>

