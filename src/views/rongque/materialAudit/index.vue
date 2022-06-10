<template>
  <div class="creditline-container">
    <!-- 数据表头 -->
    <el-form :inline="true" size="small" class="query-form">
      <!-- 输入信息之后，异步向后台发送查询信息  -->
      <el-form-item>
        <el-input v-model="listQuery.companyname" placeholder="企业名称" @keyup.enter.native="handleFilter" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.identifier" placeholder="信用代码" @keyup.enter.native="handleFilter" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.status" placeholder="审核状态" clearable>
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button></el-form-item>
    </el-form>
    <el-table v-loading="listLoading" border :data="list" empty-text="暂无数据">
      <el-table-column type="index" align="center" :index="indexMethod" />
      <el-table-column label="企业名称" align="center" min-width="200" prop="companyname" />
      <el-table-column label="信用代码" align="center" width="200" prop="identifier" />
      <el-table-column label="审批状态" align="center" width="100" prop="status">
        <template v-slot="{row}">
          <el-tag v-if="row.status === 1" type="primary">已受理</el-tag>
          <el-tag v-else-if="row.status === 2" type="success">完成,已上链</el-tag>
          <el-tag v-else-if="row.status === 3" type="danger">未通过</el-tag>
          <el-tag v-else>未受理</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="申请业务名称" align="center" min-width="130" prop="businessname" />
      <el-table-column label="审批人" align="center" width="120" prop="examinator" />
      <!--      <el-table-column label="评价日期" align="center" width="100" :formatter="applyTimeFormatter" />-->
      <el-table-column label="备注" align="center" width="200" prop="remark" />

      <el-table-column label="操作" align="left" width="250">
        <template v-slot="{row}">
          <el-button size="mini" @click="showMaterialForm(row)">材料审查</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">决定</el-button>
          <el-button size="mini" type="danger" @click="showBlackForm(row)">拉黑</el-button>
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

    <el-dialog title="审批" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="公司名称">
          <el-row>{{ temp.companyname }}</el-row>
        </el-form-item>
        <el-form-item label="信用代码">
          <el-row>{{ temp.identifier }}</el-row>
        </el-form-item>
        <el-form-item label="申请业务">
          <el-row>{{ temp.businessname }}</el-row>
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="creditLine">
          <el-input v-model="temp.remark" />
        </el-form-item>
        <!--        <el-form-item label="Status">-->
        <!--          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">-->
        <!--            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateExaminate()">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="材料查看" :visible.sync="dialogMaterialVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="主要材料">
          <el-row>
            <el-button v-if="ifmain" type="primary" style="margin-left:10px;" @click="mainMaterialDownload()">
              材料查看
            </el-button>
            <span v-if="!ifmain">暂无</span>
          </el-row>
        </el-form-item>
        <el-form-item label="次要材料">
          <el-row>
            <el-button v-if="ifsecond" type="primary" style="margin-left:10px;" @click="secondMaterialDownload()">
              材料查看
            </el-button>
            <span v-if="!ifsecond">暂无</span>
          </el-row>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogMaterialVisible = false">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加黑名单" :visible.sync="addBlackVisible">
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
        <el-button @click="addBlackVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="addBlacklist()">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchPv, createArticle, updateArticle } from '@/api/article'

import Pagination from '@/components/Pagination'
import {
  fetchExaminationList,
  updateExaminate,
  materialDownload,
  examinationDownload,
  getApplicatonFileExist
} from '@/api/rongque'
import { addBlackList } from '@/api/blacklist'
import { confirmationDownload } from '@/api/credit'

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
        companyname: '',
        identifier: '',
        status: '',
        sort: '+id'
      },
      productTypeOptions: [],
      statusOptions: [{
        value: 0,
        label: '未受理'
      }, {
        value: 1,
        label: '受理'
      }, {
        value: 2,
        label: '通过'
      }, {
        value: 3,
        label: '不通过'
      }],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      temp: {},
      dialogFormVisible: false,
      dialogPvVisible: false,
      dialogMaterialVisible: false,
      addBlackVisible: false,
      addtemp: {},
      pvData: [],
      rules: {
        // TODO 表单验证
        // creditLine: [{ required: true, message: '请输入信用分数', trigger: 'blur', validateField: this.creditlineValid }]
      },
      downloadLoading: false,
      identifier: '',
      businessid: '',
      examination: { },
      materialForm: {},
      ifmain: 0,
      ifsecond: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    indexMethod(index) {
      return (this.listQuery.current - 1) * this.listQuery.size + index + 1
    },
    async getList() {
      this.listLoading = true
      try {
        const { data } = await fetchExaminationList(this.listQuery)
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
    showBlackForm(row) {
      this.addtemp.identifier = row.identifier
      this.addtemp.companyname = row.companyname
      this.addtemp.operator = this.$store.state.user.name
      this.addBlackVisible = true
      this.examination.businessid = row.businessid
      this.examination.identifier = row.identifier
      this.examination.companyname = row.companyname
      this.examination.examinator = this.$store.state.user.name
      this.examination.id = row.id
    },
    addBlacklist() {
      addBlackList(this.addtemp).then(({ code }) => {
        if (code === 200) {
          this.examination.remark = this.addtemp.reason
          this.examination.status = 3
          updateExaminate(this.examination).then(({ code }) => {
            if (code === 200) {
              this.$message({
                message: '添加黑名单成功',
                type: 'success'
              })
            } else {
              this.$message.error('失败，请重试')
            }
          })
        } else {
          this.$message.error('失败，请重试')
        }
        this.getList()
        this.addBlackVisible = false
      })
    },
    showMaterialForm(row) {
      getApplicatonFileExist({ 'identifier': row.identifier,
        'businessid': row.businessid }).then(({ data }) => {
        this.ifmain = data.ifmain
        this.ifsecond = data.ifsecond
      })
      this.materialForm.identifier = row.identifier
      this.materialForm.name = row.companyname
      this.materialForm.businessid = row.businessid
      this.materialForm.status = row.status

      this.dialogMaterialVisible = true
    },
    mainMaterialDownload() {
      examinationDownload({ 'identifier': this.materialForm.identifier,
        'businessid': this.materialForm.businessid,
        'type': 1 }).then(
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
    secondMaterialDownload() {
      examinationDownload({ 'identifier': this.materialForm.identifier,
        'businessid': this.materialForm.businessid,
        'type': 0 }).then(
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
    updateExaminate() {
      // console.log(this.temp)
      this.temp.examinator = this.$store.state.user.name
      updateExaminate(this.temp).then(({ code }) => {
        // console.log(data)
        if (code === 200) {
          this.$message({
            message: '处理完成',
            type: 'success'
          })
        } else {
          this.$message.error('失败，请重试')
        }
        this.dialogFormVisible = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
