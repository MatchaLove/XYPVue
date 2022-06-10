<template>
  <div class="creditline-container">
    <!-- 数据表头 -->
    <el-form :inline="true" size="small" class="query-form">
      <!-- 输入信息之后，异步向后台发送查询信息  -->
      <el-form-item>
        <el-input v-model="listQuery.username" placeholder="用户名" @keyup.enter.native="handleFilter" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.nickname" placeholder="昵称" @keyup.enter.native="handleFilter" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.role" placeholder="用户类型" clearable>
          <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">增加</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="list" empty-text="暂无数据">
      <el-table-column type="index" align="center" :index="indexMethod" />
      <el-table-column label="用户名" align="center" width="200" prop="username"></el-table-column>
      <el-table-column label="密码" align="center" width="200" prop="password" />
      <el-table-column label="用户类型" align="center" width="110" prop="role">
        <template v-slot="{row}">
          <el-tag v-if="row.role === 'admin'" type="success">管理员</el-tag>
          <el-tag v-else-if="row.role === 'company'" >企业</el-tag>
          <el-tag v-else-if="row.role === 'evaluator'" >评价方</el-tag>
          <el-tag v-else-if="row.role === 'examinator'" >审核方</el-tag>
          <el-tag v-else-if="row.role === 'visitor'" >游客</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center" width="130" prop="nickname" />
      <el-table-column label="头像" align="center" width="320" >
        <template #default="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="scope.row.avatar"
            :preview-src-list="[scope.row.avatar]"
          />
        </template>
      </el-table-column>
      <!--      <el-table-column label="评价日期" align="center" width="100" :formatter="applyTimeFormatter" />-->

      <el-table-column label="操作" align="left" width="300">
        <template v-slot="{row}">
          <el-button v-if="row.ifqualification" size="mini" type="primary" @click="qualificationDownload()">
            资质证明
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">修改</el-button>
          <el-button size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />

    <el-dialog title="用户管理" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="用户名">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="temp.nickname" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="temp.role" class="filter-item" placeholder="Please select">
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model="temp.avatar" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateuser()">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加用户" :visible.sync="addFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="用户名">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="temp.nickname" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="temp.role" class="filter-item" placeholder="Please select">
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model="temp.avatar" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="addUser()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPv, createArticle, updateArticle } from '@/api/article'

import { parseTimestamp, toMoney } from '@/utils'
import Pagination from '@/components/Pagination'
import { addUser, fetchUserList, qualiDownload, updateUser } from '@/api/user'
import { valdateFn } from '@/utils/validate'
import { examinationDownload } from '@/api/rongque'


export default {
  name: 'Evaluationline',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 20,
        username: '',
        nickname: '',
        role: '',
        sort: '+id'
      },
      productTypeOptions: [],
      roleOptions: [{
        value: 'admin',
        label: '管理员'
      }, {
        value: 'company',
        label: '企业'
      }, {
        value: 'evaluator',
        label: '评价专家'
      }, {
        value: 'examinator',
        label: '审核人员'
      }, {
        value: 'visitor',
        label: '游客'
      }],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      temp: {},
      dialogFormVisible: false,
      addFormVisible: false,
      dialogPvVisible: false,
      pvData: [],
      rules: {
        // TODO 表单验证
        // creditLine: [{ required: true, message: '请输入信用分数', trigger: 'blur', validateField: this.creditlineValid }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    indexMethod(index) {
      return (this.listQuery.current - 1) * this.listQuery.size + index + 1
    },
    applyTimeFormatter(row) {
      return parseTimestamp(row.editdate)
    },
    dueTimeFormatter(row) {
      return parseTimestamp(row.dueTime)
    },
    // 将记录进行处理

    async getList() {
      this.listLoading = true
      try {
        const { data } = await fetchUserList(this.listQuery)
        this.total = data.total
        // this.list = this.recordsFormatter(data.items)
        this.list = data.items
        this.modelOptions = data.modelOptions
        this.status = data.status
        this.productTypeOptions = data.productTypeOptions
      } catch (error) {
        console.error(error)
      }
      this.listLoading = false
    },
    qualificationDownload() {
      qualiDownload({ 'username': this.$store.state.user.username }).then(
        function(response) {
          const binaryData = []
          binaryData.push(response.data)
          const pdfUrl = window.URL.createObjectURL(new Blob(binaryData, { type: 'application/pdf' }))
          window.open(pdfUrl)
          // eslint-disable-next-line handle-callback-err
        }, function(err) {
        }
      )
    },
    updateuser() {
      updateUser(this.temp).then(({ code }) => {
        // console.log(data)
        if (code === 200) {
          this.$message({
            message: '修改完成',
            type: 'success'
          })
        } else {
          this.$message.error('修改失败，请重试')
        }
        this.dialogFormVisible = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    addUser() {
      addUser(this.temp).then(({ code }) => {
        // console.log(data)
        if (code === 200) {
          this.$message({
            message: '增加完成',
            type: 'success'
          })
        } else {
          this.$message.error('增加失败，请重试')
        }
        this.addFormVisible = false
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = row
      this.temp.editdate = new Date()
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleAdd() {
      this.temp.editdate = new Date()
      this.dialogStatus = 'update'
      this.addFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    // TODO 表单验证
    creditlineValid(rule, val, callback) {
      console.log(rule)
      console.log(val)
      console.log(callback)
    }

  }
}
</script>

<style>

.creditline-container {
  margin: 10px
}
</style>
