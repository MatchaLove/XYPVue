<template>
  <div class="app-container" style="margin-left: 30px">
    <el-form ref="form" label-position="left" :model="form" label-width="100px">
      <el-form-item label="公司名称">
        <el-input v-model="form.companyname" />
      </el-form-item>
      <el-form-item label="信用代码">
        <el-input v-model="form.identifier" />
      </el-form-item>
      <el-form-item label="申请业务">
        <el-select v-model="form.businessid" placeholder="选择业务类型" @change="selectChanged">
          <el-option
            v-for="item in businesses"
            :key="item.businessid"
            :label="item.businessname"
            :value="item.businessid"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="备注">-->
      <!--        <el-input v-model="form.remark" type="textarea" />-->
      <!--      </el-form-item>-->
      <el-form-item label="所需材料">
        <el-upload
          ref="upload"
          name="files"
          :data="form"
          class="upload-demo"
          action="http://localhost:8080/application/submitsecond"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="files"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary" style="margin-right: 10px">选取文件</el-button>
          <el-button size="small" type="success" @click="submitUpload">提交申请</el-button>
          <small style="margin-left: 20px">请将所有材料合成一个PDF文件后提交</small>
          <!--          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>-->
        </el-upload>

      </el-form-item>
      <el-table v-loading="listLoading" border :data="filelist" empty-text="无需上传文件">
        <!--          <el-table-column type="index" align="center" :index="indexMethod" />-->
        <el-table-column label="材料清单" align="left" min-width="400" prop="materialname" />
        <el-table-column label="材料形式" align="center" width="130" prop="style">
          <template v-slot="{row}">
            <el-tag v-if="row.type === 1">原件</el-tag>
            <el-tag v-else>复印件</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="材料类型" align="center" width="130" prop="type">
          <template v-slot="{row}">
            <el-tag v-if="row.type === 1">必需</el-tag>
            <el-tag v-else>次要材料</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="来源渠道" align="center" width="130" prop="resource" />
        <el-table-column label="文件下载" align="center" width="200">
          <template v-slot="{row}">
            <el-button v-if="row.ifdemofile" type="primary" size="mini" @click="getDemoFile(row)">示例样本</el-button>
            <el-button v-if="row.ifemptyfile" type="primary" size="mini" @click="getEmptyFile(row)">空白模板</el-button>
            <span v-if="!(row.ifdemofile+row.ifemptyfile)">无</span>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import {
  getAllFile, getApplicatonExist,
  getBusinessCredit,
  getCompanyInfo,
  getMainFile,
  getMaterialFile,
  getSecondFile
} from '@/api/rongque'

export default {
  data() {
    return {
      form: {
        identifier: '',
        companyname: '',
        businessid: '',
        remark: ''
      },
      files: [],
      filelist: null,
      businesses: null,
      listLoading: false,
      credit: null,
      mincredit: 0
    }
  },
  created() {
    this.getInformation()
  },
  methods: {
    indexMethod(index) {
      return (this.listQuery.current - 1) * this.listQuery.size + index + 1
    },
    getInformation() {
      // TODO 页面初始化时获取基本信息作为表单的默认值
      getCompanyInfo({ username: this.$store.state.user.username }).then(({ data }) => {
        this.form.identifier = data.identifier
        this.form.companyname = data.companyname
        this.businesses = data.businesses
        this.credit = data.credit
        if (data.ifbusiness === 0) {
          this.$alert('您暂无在办业务需补充材料', '暂无申请', {
            confirmButtonText: '确定',
            callback: action => {
              this.$router.push('/rongque/business')
            }
          })
        }
      })
    },
    selectChanged() {
      getApplicatonExist({ businessid: this.form.businessid, identifier: this.form.identifier }).then(({ data }) => {
        if (data.ifexist === 0) {
          this.$alert('此业务您暂未申请，不需要补充材料', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              // this.$router.push('/credit/creditInquiry')
              this.form.businessid = ''
            }
          })
        } else {
          getSecondFile({ businessid: this.form.businessid }).then(({ data }) => {
            this.filelist = data
          })
        }
      })
    },
    getDemoFile(row) {
      getMaterialFile({ 'id': row.id, 'type': 1 }).then(
        function(response) {
          const content = response.data
          const blob = new Blob([content], { type: 'application/zip' })
          if ('download' in document.createElement('a')) {
            // 非IE下载
            const elink = document.createElement('a')
            elink.download = row.materialname
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
    getEmptyFile(row) {
      getMaterialFile({ 'id': row.id, 'type': 0 }).then(
        function(response) {
          const content = response.data
          const blob = new Blob([content], { type: 'application/zip' })
          if ('download' in document.createElement('a')) {
            // 非IE下载
            const elink = document.createElement('a')
            elink.download = row.materialname
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
    submitUpload() {
      this.$refs.upload.submit()
      this.$alert('您的材料已成功提交', '提交成功', {
            confirmButtonText: '确定',
            callback: action => {
              this.$router.push('/rongque/progressInquiry')
            }
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

