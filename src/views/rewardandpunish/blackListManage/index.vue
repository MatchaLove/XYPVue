<template>
  <div class="app-container">
    <!-- 数据表头 -->
    <el-form :inline="true" size="small" class="query-form">
      <!-- 输入信息之后，异步向后台发送查询信息  -->
      <el-form-item>
        <el-input v-model="listQuery.identifier" placeholder="信用代码" @keyup.enter.native="handleFilter" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.companyname" placeholder="公司名称" @keyup.enter.native="handleFilter" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">增加</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="list" empty-text="暂无数据">
      <el-table-column type="index" align="center" :index="indexMethod" />
      <el-table-column label="信用代码" align="center" width="200" prop="identifier" />
      <el-table-column label="公司名称" align="center" width="200" prop="companyname" />
      <el-table-column label="加入原因" align="center" width="320" prop="reason" />
      <el-table-column label="加入时间" align="center" width="200" prop="joindate" />
      <el-table-column label="操作" align="left" width="300">
        <template v-slot="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
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

    <el-dialog title="黑名单管理" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="企业名称">
          <el-input v-model="temp.companyname" />
        </el-form-item>
        <el-form-item label="信用代码">
          <el-input v-model="temp.identifier" />
        </el-form-item>
        <el-form-item label="加入原因">
          <el-input v-model="temp.reason" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="add()">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加企业" :visible.sync="addFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="addtemp"
        label-position="right"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="企业名称">
          <el-input v-model="addtemp.companyname" />
        </el-form-item>
        <el-form-item label="信用代码">
          <el-input v-model="addtemp.identifier" />
        </el-form-item>
        <el-form-item label="加入原因">
          <el-input v-model="addtemp.reason" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="update()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import Pagination from '@/components/Pagination'
import { fetchList, addBlackList, deleteBlackList } from '@/api/blacklist'
import { valdateFn } from '@/utils/validate'

export default {
  name: 'Blacklist',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        identifier: '',
        companyname: ''
      },
      productTypeOptions: [],
      showReviewer: false,
      temp: {},
      addtemp: {},
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

    // 将记录进行处理

    async getList() {
      this.listLoading = true
      try {
        const { data } = await fetchList(this.listQuery)
        this.total = data.total
        // this.list = this.recordsFormatter(data.items)
        this.list = data.items
        for (let i = 0; i < this.list.length; i++) {
          const myDate = new Date(this.list[i].joindate)
          console.log(this.list[i].joindate)
          this.list[i].joindate = myDate.toLocaleString()
        }

        this.modelOptions = data.modelOptions
        this.status = data.status
        this.productTypeOptions = data.productTypeOptions
      } catch (error) {
        console.error(error)
      }
      this.listLoading = false
    },
    update() {
      addBlackList(this.addtemp).then(({ code }) => {
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
    add() {
      addBlackList(this.temp).then(({ code }) => {
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
      this.temp.joindate = new Date()
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // TODO 删除
    handleDelete(row) {
      this.temp = row
      this.temp.joindate = new Date()
      deleteBlackList(this.temp).then(({ code }) => {
        // console.log(data)
        if (code === 200) {
          this.$message({
            message: '删除完成',
            type: 'success'
          })
        } else {
          this.$message.error('失败，请重试')
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
