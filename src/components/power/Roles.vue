<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/roles' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button class="add-role" type="primary" @click="addRoleButton"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 循环最外层children，索引为0（第一行）时加上上边框样式 -->
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              ><!-- 栅格系统24列空间 -->
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <!-- {{item1.authName}} -->
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                  <i class="el-icon-caret-right"></i>
                </el-tag>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for循环嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                      <i class="el-icon-caret-right"></i>
                    </el-tag>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
              查看数据
              {{ scope.row }}
            </pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      // 所有权限的数据
      rightslist: [],
      addDialogVisible: false,
      editDialogVisible: false,
      setRightDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称' },
          { min: 2, max: 10, message: '长度在2到10个字符' }
        ],
        roleDesc: []
      },
      // 编辑角色
      editForm: {},
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称' },
          { min: 2, max: 10, message: '长度在2到10个字符' }
        ]
      },
      // 树型控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 选中的checkbox的id
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolelist = res.data
      //   console.log(this.rolelist)
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      // console.log(this.$refs)
    },
    addRoleButton() {
      this.addDialogVisible = true
    },
    addRole() {
      // 表单验证通过后提交
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        console.log(this.addForm)
        const { data: res } = await this.$http.post('roles', this.addForm)
        // console.log(res)
        if (res.meta.status !== 201) {
          // 201 201 201!!!!!!!
          return this.$message.error('添加角色失败')
        }
        this.addDialogVisible = false
        this.getRolesList()
        this.$message.success('添加角色成功')
      })
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    async showEditDialog(id) {
      // console.log(id)
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 提交修改角色信息
    editRoleInfo() {
      // console.log(this.editForm)
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'roles/' + this.editForm.roleId,
          this.editForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改角色失败！')
        }
        this.editDialogVisible = !this.editDialogVisible
        this.getRolesList()
        this.$message.success('修改角色成功！')
      })
    },
    // 删除角色
    async removeRoleById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      ).catch((err) => err)
      // }).catch(err => {
      //     return err
      // })

      // 如果用户确认删除，返回字符串为confirm
      // 如果用户取消删除，返回字符串为cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }

      const { data: res } = await this.$http.delete('roles/' + id)
      // console.log(this.editForm.roleId)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      this.getRolesList()
    },
    // 根据id删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        '此操作将取消该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
      // console.log(rightId)
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('取消该权限失败')
      }
      // this.getRolesList()
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      // 获取到的权限数据保存到data中
      this.rightslist = res.data
      console.log(this.rightslist)
      // 递归获取三级节点id
      this.getLeafKeys(role, this.defKeys)
      // console.log(role)
      // console.log(this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式获取角色下所有三级权限的id保存到defkeys数组
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性 则为三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      // 递归
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    // 监听分配权限的关闭对话框
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        // 展开运算符放到数组中
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys)
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      // console.log({rids:idStr})
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.add-role {
  float: left;
}
.el-tag {
  margin: 10px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  //纵向居中对其
  display: flex;
  align-items: center;
}
</style>
