<!--
 * @Author: mrYang
 * @Date: 2021-03-17 22:54:38
 * @LastEditors: mrYang
 * @LastEditTime: 2021-04-24 15:05:55
 * @Description: file content
-->
<template>
  <div>
    <h3>这是基于VUE全家桶和ElementUI实现的后台管理系统</h3>
    <p>作者：杨威</p>
    <p>
      基于Vue-cli构建的，vue+ElementUI组件化的，主要使用ES6语法，以及使用ES8新加入的async/await新特性解决回调地狱问题，和Babel等实现的项目。全局使用axios发起Ajax请求，通过调用现成的基于node的后端api，实现前端项目的业务逻辑。
      登录时为请求标头添加token令牌指定不同用户间的操作，调用腾讯云服务器的后台数据库验证数据表中存在的用户后进入主页面，若用户退出则清空sessionStorage的缓存。
      主页面是通过vue-router构建的SPA，还实现了路由的懒加载，用到多种常用ElementUI组件，诸如Form,
      Cascader, Upload, Progress, Dialog,
      MessageBox等。对后端发起post,delete,put,get的请求实现页面的基本增删改查功能。
      使用Git工具控制版本，使用基于vue-cli中的webpack打包构建项目，搭建了简单的express服务器，安装了ssl证书，80端口已经开放，可直接访问网站DEMO。
    </p>
    <a
      href="https://github.com/mryang166/vue_shop"
      style="text-decoration: none"
      >项目路径： https://github.com/mryang166/vue_shop
    </a>
    <br />
    <a href="www.yangwei.xyz" style="text-decoration: none"
      >网站： www.yangwei.xyz</a
    >
  </div>
</template>
