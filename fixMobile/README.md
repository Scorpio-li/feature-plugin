<!--
 * @Author: Li Zhiliang
 * @Date: 2021-02-01 15:14:31
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2021-02-01 15:14:32
 * @FilePath: /feature-plugin/fixMobile/fillPit.md
-->
# 移动端H5坑位指南

- 提及的安卓系统包括Android和基于Android开发的系统

- 提及的苹果系统包括iOS和iPadOS

- 本文针对的开发场景是移动端浏览器，因此大部分坑位的解决方案在桌面端浏览器里不一定有效

- 解决方案若未提及适用系统就默认在安卓系统和苹果系统上都适用，若提及适用系统则会详细说明

- Webkit及其衍生内核在移动端浏览器市场占有率里达到惊人的97%，因此无需太过担心CSS3、ES6和浏览器新特性的兼容性

- 真正的开发环境都是基于webpack构建，因此代码演示都不会带上CSS前缀，除非该属性是Webkit独有才会带上-webkit-


