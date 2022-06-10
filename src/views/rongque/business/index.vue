<template>
  <div class="creditline-container">
    <!-- 数据表头 -->
    <el-form :inline="true" size="small" class="query-form">
      <!-- 输入信息之后，异步向后台发送查询信息  -->
      <el-form-item>
        <el-input v-model="listQuery.businessname" placeholder="业务名称" @keyup.enter.native="handleFilter" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.businessid" placeholder="业务代码" @keyup.enter.native="handleFilter" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button></el-form-item>
    </el-form>
    <el-table v-loading="listLoading" stripe border :data="list" empty-text="暂无数据">
      <el-table-column type="index" align="center" :index="indexMethod" />
      <el-table-column label="业务名称" align="center" min-width="200" prop="businessname" />
      <el-table-column label="业务代码" align="center" width="200" prop="businessid" />
      <el-table-column label="信用分数" align="center" width="200" prop="mincredit" />
      <el-table-column label="所需材料" align="center" width="200" prop="status">
        <template v-slot="{row}">
          <el-button size="small" type="primary" @click="showMaterials(row)">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="办理流程" align="center" width="200" prop="status">
        <template v-slot="{row}">
          <el-button size="small" type="primary" @click="checkProgress(row.businessid)">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="办理" align="center" width="200">
        <template v-slot="{row}">
          <el-button size="small" type="primary" @click="turnToApproval">前往办理</el-button>
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

    <el-dialog title="办理流程" :visible.sync="dialogProgressVisible">

      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          placement="top"
          :icon="activity.icon"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size"
          :timestamp="activity.timestamp"
        >
          <el-card style="height: 100px">
            <p>{{ activity.content }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogProgressVisible = false">
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
        :model="materials"
        label-position="right"
        label-width="100px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item label="主要材料">
          <el-row>
            <ul>
              <li v-for="(mainfile, index) in mainFileList"> {{ mainfile.materialname }} </li>
            </ul>
          </el-row>
        </el-form-item>
        <el-form-item label="次要材料">
          <el-row>
            <ul>
              <li v-for="(secondfile, index) in secondFileList"> {{ secondfile.materialname }} </li>
            </ul>
          </el-row>

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogMaterialVisible = false">
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
  fetchBusinessList,
  getMainFile,
  getSecondFile
} from '@/api/rongque'

export default {
  name: 'Evaluationline',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        current: 1,
        size: 10,
        businessid: '',
        businessname: '',
        status: '',
        sort: '+id'
      },
      productTypeOptions: [],
      statusOptions: [{
        value: 0,
        label: '未审核'
      }, {
        value: 1,
        label: '通过'
      }, {
        value: 2,
        label: '不通过'
      }],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      temp: {},
      dialogProgressVisible: false,
      dialogMaterialVisible: false,
      dialogPvVisible: false,
      activities: [{
        content: '1.核对申请人是否符合申请条件；2.依据办事指南中材料清单逐一核对是否齐全；3.核对每个材料是否涵盖材料要求中涉及的内容和要素。',
        timestamp: '收件',
        size: 'large',
        type: 'primary',
        // icon: 'el-icon-more',
        title: '收件'
      }, {
        content: '申请材料齐全、符合法定形式，或者申请人按照本行政机关的要求提交全部补正申请材料的，应当受理申请。',
        timestamp: '受理',
        type: 'primary',
        size: 'large',
        // color: '#0bbd87',
        title: '受理'
      }, {
        content: '提出初步意见，转入决定步骤。',
        timestamp: '审查',
        // color: '#0bbd87',
        size: 'large',
        type: 'primary',
        title: '审查'
      }, {
        content: '办理结果：1、申请人的申请材料符合法定条件，标准、审核通过的，出具核准、审批文件。\n' +
          '2、申请人的申请材料不符合法定条件、标准，审核不通过的，出具不予核准、审批文件。',
        timestamp: '决定',
        // color: '#0bbd87',
        size: 'large',
        type: 'primary',
        title: '决定'
      }],
      pvData: [],
      rules: {
        // TODO 表单验证
        // creditLine: [{ required: true, message: '请输入信用分数', trigger: 'blur', validateField: this.creditlineValid }]
      },
      downloadLoading: false,
      materials: null,
      mainFileList: [],
      secondFileList: [],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    indexMethod(index) {
      return (this.listQuery.current - 1) * this.listQuery.size + index + 1
    },
    turnToApproval() {
      this.$router.push('/rongque/approvalApply')
    },
    async getList() {
      this.listLoading = true
      try {
        const { data } = await fetchBusinessList(this.listQuery)
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
    showMaterials(row) {
      getMainFile({ "businessid": row.businessid}).then(({ data }) => {
        this.mainFileList = data
      })
      getSecondFile({ "businessid": row.businessid}).then(({ data }) => {
        this.secondFileList = data
      })
      this.dialogMaterialVisible = true
    },
    checkProgress() {
      // console.log(this.temp)
      this.dialogProgressVisible = true
      // updateExaminate(this.temp).then(({ code }) => {
      //   // console.log(data)
      //   if (code === 200) {
      //     this.$message({
      //       message: '审核完成',
      //       type: 'success'
      //     })
      //   } else {
      //     this.$message.error('审核失败，请重试')
      //   }
      //   this.dialogProgressVisible = false
      // })
    },
    handleFilter: function() {
      this.listQuery.page = 1
      console.log(this.listQuery)
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
      this.dialogProgressVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = row
      this.temp.editdate = new Date()
      this.dialogStatus = 'update'
      this.dialogProgressVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    download: function(identifier, name, businessid) {
      materialDownload({ 'identifier': identifier, 'businessid': businessid }).then(
        function(response) {
          const content = response.data
          const blob = new Blob([content], { type: 'application/zip' })
          if ('download' in document.createElement('a')) {
            // 非IE下载
            const elink = document.createElement('a')
            elink.download = name
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            // 释放URL对象
            URL.revokeObjectURL(elink.href)
            document.body.removeChild(elink)
          } else {
            navigator.msSaveBlob(blob, name)
          }
          // eslint-disable-next-line handle-callback-err
        }, function(err) {

        }
      )
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogProgressVisible = false
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
