<template>
  <div class="app-container">

    <el-form ref="form" :model="form" label-width="150px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="资产负债率">
            <el-input v-model="form.assetliabilityratio" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="每股未分配利润">
            <el-input v-model="form.eps" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="净资产收益率">
            <el-input v-model="form.roe" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="营业收入净利率">
            <el-input v-model="form.operatingmargin" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="现金流负债比">
            <el-input v-model="form.currentratio" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同履约率">
            <el-input v-model="form.contractratio" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="应付账款清偿率">
            <el-input v-model="form.accountsratio" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否有逾期应付账款">
            <el-select v-model="form.ifaccoutsoverdue" placeholder="">
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否有未承兑票据">
            <el-select v-model="form.ifticketnotaccept" placeholder="">
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否有行政处罚">
            <el-select v-model="form.ifpenalty" placeholder="">
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="纳税信用等级">
            <el-select v-model="form.taxcredit" placeholder="">
              <el-option label="A" value="A" />
              <el-option label="B" value="B" />
              <el-option label="C" value="C" />
              <el-option label="D" value="D" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否有法律纠纷">
            <el-select v-model="form.ifdispute" placeholder="">
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否有信贷违约记录">
            <el-select v-model="form.ifloan" placeholder="">
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="慈善捐赠数额">
            <el-input v-model="form.charitablecontributions" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="解决困难就业数">
            <el-input v-model="form.employcontributions" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="其他情况说明">
        <el-input v-model="form.remark" type="textarea" :rows="6" />
      </el-form-item>
      <el-form-item label="上传文件">
        <el-upload
          ref="upload"
          name="files"
          :data="form"
          class="upload-demo"
          action="http://localhost:8080/confirmation/submit"
          :on-preview="handlePreview"
          :on-reemove="handleRemove"
          :on-success="uploadSuccess"
          :file-list="files"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary" style="margin-right: 10px">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">请将所有证明材料合成一个PDF文件后提交</div>
          <el-button size="small" type="success" @click="open">提交申请</el-button>
          <!--          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>-->
        </el-upload>
      </el-form-item>
    </el-form>
  </div>

</template>
<script>
import { fetchCredit } from '@/api/credit'

export default {
  name: 'UploadFileVue',
  data() {
    return {
      formData: {
        username: this.$store.state.user.username
      },
      files: [],
      form: {
        // identifier: '',
        username: this.$store.state.user.username,
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
      }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      fetchCredit({ username: this.$store.state.user.username }).then(({ data }) => {
        console.log(data)
        this.credit = data.credit
        if (data.credit == 0) {
          this.$alert('您已申请信用评价', '已评价', {
            confirmButtonText: '确定',
            callback: action => {
              this.$router.push('/credit/creditInquiry')
            }
          })
        }else if(data.credit != null){
          this.$alert('您已完成信用评价', '已评价', {
            confirmButtonText: '确定',
            callback: action => {
              this.$router.push('/credit/creditInquiry')
            }
        })
        }
    })
    },

    upload: function() {
      const formData = new FormData()
      for (let i = 0; i < this.files.length; i++) {
        formData.append('files', this.files[i])
      }
      formData.append('username', this.$store.state.user.username)
      this.$axios.post('/confirmation/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function(response) {
        // 请求成功
        // eslint-disable-next-line handle-callback-err
      }, function(err) {

      })
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    uploadSuccess() {
      this.$message({
        type: 'success',
        message: '提交成功!'
      })
    },
    open() {
      this.$confirm('即将申请信用评价, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$refs.upload.submit()
      }).catch(() => {
      })
    },
    handleRemove(file, files) {
      console.log(file, files)
    },
    handlePreview(file) {
      console.log(file)
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>
