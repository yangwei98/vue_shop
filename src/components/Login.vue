<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- px为label占位长度 -->
        <!-- 用户名 -->
        <el-form-item prop="username"
          ><!-- prop的验证规则 -->
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单的验证规则
      loginFormRules: {
        // 验证用户名格式
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击充值按钮充值登录表单
    resetLoginForm() {
      // console.log(this);
      this.$refs.loginFormRef.resetFields() // loginFormRef为上面自定义的表单引用对象
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        // validate为Boolean值，验证是否通过   ((valid) => )只有一个形参可以去括号
        // console.log(valid)
        if (!valid) return
        // const result = await this.$http.post('login', this.loginForm);//this.loginForm为参数对象
        const { data: res } = await this.$http.post('login', this.loginForm) // {data:res解构赋值到res}
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        // console.log('登录成功')
        this.$message.success('登录成功')
        // 1.将登录成功之后 token，保存到客户端的 会话期间保存机制sessionStorage（持久化保存机制localStorage） 中
        // 1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
        // 1.2 token只应在网站打开期间生效，所以将token保存在 sessionStorage中
        console.log(res)
        window.sessionStorage.setItem('token', res.data.token) // 把token保存在sessionStorage
        // 2.通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
/* scoped为组件独占样式 */
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); //x-y 平移 -50%

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%); //再xy移动自身50%(盒子高度130px)
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box; //防止超出，表单默认为content
}

.btns {
  display: flex; //弹性盒模型
  justify-content: flex-end; //容器结尾对齐（右对齐）
}
</style>
