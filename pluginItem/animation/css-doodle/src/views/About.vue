<!--
 * @Author: Li Zhiliang
 * @Date: 2021-02-01 15:35:03
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2021-02-01 15:46:59
 * @FilePath: /feature-plugin/pluginItem/animation/css-doodle/src/views/About.vue
-->
<template>
  <div class="about">
    <h1>This is an animation page</h1>
    <div class="g-container">
      <!-- 改变元素大小 -->
      <div class="g-box" v-for="index in 10" :key="index + (new Date()).getTime()"></div>
    </div>
    <div class="g-container">
      <!-- 改变元素颜色 -->
      <div class="g-box-color" v-for="item in 10" :key="item + ((new Date()).getTime()+100)"></div>
    </div>
    <div class="g-container">
            <!-- 改变元素角度 -->
      <div class="g-box-transform" v-for="index in 10" :key="index"></div>
    </div>
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss">
  .g-container {
    position: relative;
    display: inline-block;
    margin: 50px;
    width: 300px;
    height: 300px;
}
.g-box, .g-box-color, .g-box-transform {
    position: absolute;
    top:50%;
    left: 50%;
    margin-left: -150px;
    margin-top: -150px;
    width: 100%;
    height: 100%;
    border: 1px solid #000;
}

.g-box-color {
  margin-left: 150px;
}

.g-box-transform {
  margin-left: 450px;
}
</style>

<style lang="scss" scoped>
  $count: 10;
  @for $i from 1 to $count + 1 {
      .g-box:nth-child(#{$i}) {
          --width: #{$i * 30}px;
          width: var(--width);
          height: var(--width);
          margin-left: calc(var(--width) / -2);
          margin-top: calc(var(--width) / -2);
      }
  }
  $count-color: 10;
  @for $i from 1 to $count-color + 1 {
    .g-box-color:nth-child(#{$i}) {
        --width: #{$i * 30}px;
        width: var(--width);
        height: var(--width);
        margin-left: calc(var(--width) / -2);
        margin-top: calc(var(--width) / -2);
        border-color: hsla(
          calc(#{$i * 25}),
          50%,
          65%,
          1
        );
        background: hsla(
            calc(#{$i * 25}),
            50%,
            65%,
            1
        );
        z-index: #{$count - $i};
    }
  }
  $count-transform: 10;
  @for $i from 1 to $count-transform + 1{
    .g-box-transform:nth-child(#{$i}) {
      --width: #{$i * 30}px;
        width: var(--width);
        height: var(--width);
        margin-left: calc(var(--width) / -2);
        margin-top: calc(var(--width) / -2);
        border-color: hsla(
          calc(#{$i * 25}),
          50%,
          65%,
          1
        );
        background: hsla(
            calc(#{$i * 25}),
            50%,
            65%,
            1
        );
        z-index: #{$count - $i};
        transform: rotate(#{$i * 7}deg);
    }
  }

</style>
