<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/Arthur.jpg" alt="" />
        <span>基于vue和ElementUI实现的的后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button></el-header
    >
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
          <!-- 折叠按钮 -->
          <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        ><!-- router	是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
        <!-- default-active	当前激活菜单的 index -->
        
          <!-- 一级菜单 -->
          <!-- <el-submenu index="1" v-for="item in menulist" :key="item.id"> -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <!-- <el-menu-item :index="subItem.id + ''" v-for="subItem in item.children" :key="subItem.id"> -->
            <el-menu-item :index="'/' + subItem.path + ''" v-for="subItem in item.children" 
            :key="subItem.id" @click="saveNavState('/' + subItem.path + '')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      //左侧菜单数据
      menulist: [],
      //菜单后端的id设置图标
      iconsObj:{
          '125':'iconfont icon-user',
          '103':'iconfont icon-tijikongjian',
          '101':'iconfont icon-shangpin',
          '102':'iconfont icon-danju',
          '145':'iconfont icon-baobiao'
      },
      //是否折叠
      isCollapse: false,
      //被激活的链接地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath') 
  },
  methods: {
    logout() {
      window.sessionStorage.clear() // 清空token
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus') // 解构赋值
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    //点击按钮，切换菜单的折叠与展开
    toggleCollapse(){
        this.isCollapse =! this.isCollapse
    },
    //保存导航链接的激活样式状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between; //靠边对齐
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 6px;
      cursor: pointer;
    }
  }
  img {
    height: 6vh;
    border: 1px solid white;
    border-radius: 50%;
    margin: 8px;
    cursor: pointer;
  }
  button {
    margin: 10px;
  }
}
.el-aside {
  background-color: #545c64;
  .el-menu{
      text-align: left;
      border-right: none
  }
}
.el-main {
  background-color: #eaedf1;
}

.iconfont {
    margin-right: 10px;
}

.toggle-button{
    background-color:gray;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
