<template>
  <!-- 公司详情最外层容器 -->
  <div class="dashboard-editor-container">
    <!-- 公司信息详情卡片最外层容器 -->
    <el-card style="padding: 0 20px" shadow="never">

      <el-descriptions title="" direction="vertical" :column="2" border>
        <!-- 公司名插槽 -->
        <template slot="title">
          <h1 style="display: flex;margin-bottom: 0;">{{ companyDetails.companyname }}</h1>
        </template>
        <template slot="extra">
          <el-button type="primary" size="small" @click="companyInfoDialogVisible=true">修改</el-button>
        </template>
        <el-descriptions-item label="法定代表人"><i class="el-icon-user icon" />{{ companyDetails.chargeman }}
        </el-descriptions-item>
        <el-descriptions-item label="邮箱"><i class="el-icon-message icon" />{{ companyDetails.email }}
        </el-descriptions-item>
        <el-descriptions-item label="电话"><i class="el-icon-phone-outline icon" />{{ companyDetails.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="地址"><i class="el-icon-location-outline icon" />{{ companyDetails.address }}
        </el-descriptions-item>
<!--        <el-descriptions-item label="平台用户">-->
<!--          &lt;!&ndash; TODO 跳转用户页面 &ndash;&gt;-->
<!--          <router-link to="/" class="link">{{ companyDetails.realname }}</router-link>-->
<!--        </el-descriptions-item>-->
      </el-descriptions>
    </el-card>
    <!-- 修改信息 TODO 提取组件 -->
    <el-dialog title="修改信息" :visible.sync="companyInfoDialogVisible">
      <el-form ref="companyInfoForm" :model="companyDetails" label-width="150px" style="width: 95%">
        <el-form-item label="统一社会信用代码">
          <el-input v-model="companyDetails.identifier" />
        </el-form-item>
        <el-form-item label="企业名称">
          <el-input v-model="companyDetails.companyname" />
        </el-form-item>
        <el-form-item label="法定代表人">
          <el-input v-model="companyDetails.chargeman" />
        </el-form-item>
        <el-form-item label="注册地址">
          <el-input v-model="companyDetails.address" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="companyDetails.phone" />
        </el-form-item>
        <el-form-item label="公司邮箱">
          <el-input v-model="companyDetails.email" />
        </el-form-item>
        <el-form-item label="资质证明">
          <el-upload
            ref="upload"
            name="files"
            :data="companyDetails"
            class="upload-demo"
            action="http://localhost:8080/user/submit"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="files"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary" style="margin-right: 10px">选取文件</el-button>
            <!--          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>-->
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="companyInfoDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="submitUpload">提交</el-button>
      </div>
    </el-dialog>

<!--    <panel-group @handlePanelNumber="handlePanelNumber" />-->

<!--    <el-row v-else-if="panelNumber===0" style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
<!--      <line-chart :chart-data="lineChartData" />-->
<!--    </el-row>-->

    <el-card style="padding: 10px 20px;margin-top: 10px" shadow="never">
      <el-row :gutter="50">
        <el-col :xs="26" :sm="26" :lg="10">
          <div class="chart-wrapper">
            <raddar-chart />
          </div>
        </el-col>
        <el-col :xs="26" :sm="26" :lg="10">
          <div class="chart-wrapper">
            <pie-chart />
          </div>
        </el-col>
      </el-row>
    </el-card>

  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import { getCompanyDetails } from '@/api/user'
// import { addBlacklist, deleteBlacklist } from '@/api/blacklist'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'CompanyDetails',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },

  data() {
    return {
      files: [],
      companyInfoDialogVisible: false, // 添加黑名单模态框显示
      lineChartData: lineChartData.newVisitis, // 没研究
      company: '', // 搜索公司的公司名
      cid: '', // 搜索公司的id
      blacklistForm: {},
      // 公司的详细信息，由公司信息和黑名单表共同组成，也可拆分吧
      companyDetails: {},
      panelNumber: 0
    }
  },

  async created() {
    const username = this.$store.state.user.username
    const { data } = await getCompanyDetails({ 'username': username })
    this.companyDetails = data
    this.companyDetails.username = username
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit()
      this.companyInfoDialogVisible = false
      this.$message('提交成功')
    },
    handleSelectCompany(item) {
      this.uscc = item.uscc
    },
    queryCompany() {
      this.$router.push(`/company/${this.uscc}`)
    },
    handlePanelNumber(panelNumber) {
      this.panelNumber = panelNumber
    },
    handleRemove(file, files) {
      console.log(file, files)
    },
    handlePreview(file) {
      console.log(file)
    },
    async handleQueryCompany(queryString, callback) {
      if (queryString) {
        const { data } = await queryCompany({ company: queryString })
        callback(data)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 10px 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }

  .link {
    color: #409eff
  }

  .link:hover {
    color: #66b1ff
  }

  .icon {
    margin-right: 4px;
  }

  .add-blacklist {
    color: #f56c6c;
  }

  .add-blacklist:hover {
    color: #de9696;
  }

  .remove-blacklist {
    color: #4fc08d;
  }

  .remove-blacklist:hover {
    color: #72cda4
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
