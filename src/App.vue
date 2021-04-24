<!--
 * @Author: mrYang
 * @Date: 2021-03-16 00:05:55
 * @LastEditors: mrYang
 * @LastEditTime: 2021-04-24 14:56:04
 * @Description: file content
-->
<template>
  <div id="app">
    <!-- 路由占位符 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #3a6666;
  margin-top: 60px;
  transform: scale(1);
}
</style>
