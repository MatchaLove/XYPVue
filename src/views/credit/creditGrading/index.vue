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
        <el-select v-model="listQuery.status" placeholder="评价状态" clearable>
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button></el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="list" empty-text="暂无数据">
      <el-table-column type="index" align="center" :index="indexMethod" />
      <el-table-column label="企业名称" align="center" width="200" prop="companyname" />
      <el-table-column label="信用代码" align="center" width="200" prop="identifier" />
      <el-table-column label="评价状态" align="center" width="120" prop="status">
        <template v-slot="{row}">
          <el-tag v-if="row.status === 1">完成,已上链</el-tag>
          <el-tag v-else type="danger">未评价</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="信用分数" align="center" width="120" prop="credit" />
      <el-table-column label="评价人" align="center" width="120" prop="evaluator" />
      <!--      <el-table-column label="评价日期" align="center" width="100" :formatter="applyTimeFormatter" />-->
      <el-table-column label="备注" align="center" width="200" prop="remark" />

      <el-table-column label="操作" align="left" width="300">
        <template v-slot="{row}">
          <el-button size="mini" @click="dataCheck(row.identifier, row.companyname)">信息查看</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">信用评价</el-button>
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

    <el-dialog title="信用评价" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="公司名称">
          <el-row>{{ temp.companyname }}</el-row>
        </el-form-item>
        <el-form-item label="信用代码">
          <el-row>{{ temp.identifier }}</el-row>
        </el-form-item>
        <el-form-item label="商业信用">
          <el-input v-model="temp.commercialcredit" />
        </el-form-item>
        <el-form-item label="社会信用">
          <el-input v-model="temp.socialscorecredit" />
        </el-form-item>
        <el-form-item label="公益指标">
          <el-input v-model="temp.publiccredit" />
        </el-form-item>
        <el-form-item label="信用分数" prop="creditLine">
          <el-input v-model="temp.credit" />
        </el-form-item>
        <el-form-item label="备注" prop="creditLine">
          <el-input v-model="temp.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateCredit()">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看信息" :visible.sync="dialogDataVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="creditData"
        label-position="right"
        label-width="140px"
        style="width: 800px; margin-left:10px;"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="资产负债率">
              {{ creditData.assetliabilityratio + '%' }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="每股未分配利润">
              {{ creditData.eps + '元' }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="净资产收益率">
              {{ creditData.roe + '%' }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="营业收入净利率">
              {{ creditData.operatingmargin + '%' }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="现金流负债比">
              {{ creditData.currentratio }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="合同履约率">
              {{ creditData.contractratio + '%' }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="应付账款清偿率">
              {{ creditData.accountsratio + '%' }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="是否有逾期应付账款">
              <el-select v-model="creditData.ifaccoutsoverdue" placeholder="">
                <el-option label="是" value="1" />
                <el-option label="否" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否有未承兑票据">
              <el-select v-model="creditData.ifticketnotaccept" placeholder="">
                <el-option label="是" value="1" />
                <el-option label="否" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="是否有行政处罚">
              <el-select v-model="creditData.ifpenalty" placeholder="">
                <el-option label="是" value="1" />
                <el-option label="否" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="纳税信用等级">
              <el-select v-model="creditData.taxcredit" placeholder="">
                <el-option label="A" value="A" />
                <el-option label="B" value="B" />
                <el-option label="C" value="C" />
                <el-option label="D" value="D" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="是否有法律纠纷">
              <el-select v-model="creditData.ifdispute" placeholder="">
                <el-option label="是" value="1" />
                <el-option label="否" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否有信贷违约记录">
              <el-select v-model="creditData.ifloan" placeholder="">
                <el-option label="是" value="1" />
                <el-option label="否" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="慈善捐赠数额">
              {{ creditData.charitablecontributions + '万' }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="解决困难就业数">
              {{ creditData.employcontributions }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-button type="primary" style="margin-left:10px;" @click="materialDownload(creditData.identifier)">
            材料查看
          </el-button>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDataVisible = false">
          关闭
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
import { fetchCreditLineList, creditGrading, confirmationDownload, getData, deleteEvaluation } from '@/api/credit'
import { addBlackList } from '@/api/blacklist'
import { getCompanyInfo } from '@/api/rongque'

export default {
  name: 'Creditline',
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
      creditData: {
        assetliabilityratio: '',
        eps: '',
        roe: '',
        operatingmargin: '',
        currentratio: '',
        contractratio: '',
        accountsratio: '',
        ifaccoutsoverdue: '',
        ifticketnotaccept: '',
        ifpenalty: '',
        ifinsurance: '',
        ifdispute: '',
        ifloan: '',
        taxcredit: '',
        charitablecontributions: '',
        employcontributions: ''
      },
      productTypeOptions: [],
      statusOptions: [{
        value: 0,
        label: '未评价'
      }, {
        value: 1,
        label: '完成并上链'
      }],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      temp: {},
      addtemp: {},
      dialogFormVisible: false,
      dialogDataVisible: false,
      addBlackVisible: false,
      dialogPvVisible: false,
      pvData: [],
      rules: {
        // TODO 表单验证
        // creditLine: [{ required: true, message: '请输入信用分数', trigger: 'blur', validateField: this.creditlineValid }]
      },
      downloadLoading: false,
      companyName: '',
      pdfUrl: ''
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
        const { data } = await fetchCreditLineList(this.listQuery)
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
    },
    addBlacklist() {
      addBlackList(this.addtemp).then(({ code }) => {
        if (code === 200) {
          deleteEvaluation({ 'identifier': this.addtemp.identifier, 'companyname': this.addtemp.companyname }).then(({ code }) => {
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
    updateCredit() {
      // console.log(this.temp)
      this.temp.status = 1
      this.temp.evaluator = this.$store.state.user.name
      creditGrading(this.temp).then(({ code }) => {
        // console.log(data)
        if (code === 200) {
          this.$message({
            message: '评价成功',
            type: 'success'
          })
        } else {
          this.$message.error('评价失败，请重试')
        }
        this.dialogFormVisible = false
      })
    },
    // function(response) {
    //   const content = response.data
    //   const blob = new Blob([content], { type: 'application/zip' })
    //   if ('download' in document.createElement('a')) {
    //     // 非IE下载
    //     const elink = document.createElement('a')
    //     elink.download = name
    //     elink.style.display = 'none'
    //     elink.href = URL.createObjectURL(blob)
    //     document.body.appendChild(elink)
    //     elink.click()
    //     // 释放URL对象
    //     URL.revokeObjectURL(elink.href)
    //     document.body.removeChild(elink)
    //   } else {
    //     navigator.msSaveBlob(blob, name)
    //   }
    //   // eslint-disable-next-line handle-callback-err
    // }, function(err) {
    //
    // }
    materialDownload(identifier) {
      confirmationDownload({ 'identifier': identifier }).then(
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
    dataCheck: function(identifier, name) {
      // 从后端拿identifier对应的数据放到creditData
      getData({ 'identifier': identifier }).then(({ data }) => {
        this.creditData = data
      })
      this.companyName = name
      this.dialogDataVisible = true
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
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
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
