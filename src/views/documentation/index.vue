<template>
  <div v-show="body_show" class="myelement">
    <p>报名页面</p>

    <el-form ref="form" :model="form" label-width="130px" :rules="rules">

      <fieldset style="width:40%;">
        <legend>个人信息</legend>
        <!-- 姓名 -->
        <el-form-item label="姓名：" prop="apply_person_name" size="small">
          <el-input v-model="form.apply_person_name" placeholder="请输入姓名" class="input_width" />
        </el-form-item>
      </fieldset>
      <br>

      <fieldset style="width:40%;">
        <legend>报名信息</legend>
        <el-form-item label="学校/公司/组织：" prop="apply_company" size="small">
          <el-input v-model="form.apply_company" placeholder="请输入公司名" class="input_width" />
        </el-form-item>

        <el-form-item label="专业/部门：" prop="apply_department" size="small">
          <el-input v-model="form.apply_department" placeholder="请输入部门" class="input_width" />
        </el-form-item>

        <el-form-item label="报名赛区：" prop="apply_area" size="small">
          <el-radio v-model="form.apply_area" label="集团内部赛区">集团内部赛区</el-radio>
          <el-radio v-model="form.apply_area" label="社会开放赛区">社会开放赛区</el-radio>
        </el-form-item>

        <el-form-item label="作品方向：" prop="competition_product_target" size="small">
          <el-radio v-model="form.competition_product_target" label="精益生产">精益生产</el-radio>
          <el-radio v-model="form.competition_product_target" label="智慧服务">智慧服务</el-radio>
          <el-radio v-model="form.competition_product_target" label="创新应用">创新应用</el-radio>
        </el-form-item>

        <el-form-item label="团队名称：" prop="team_name" size="small">
          <el-input v-model="form.team_name" placeholder="请输入团队名称" class="input_width" />
        </el-form-item>
      </fieldset>
      <br>

      <fieldset style="width:40%;">
        <legend>团队负责人</legend>
        <el-form-item label="姓名：" prop="team_leader_name" size="small">
          <el-input v-model="form.team_leader_name" placeholder="请输入队长姓名" class="input_width" />
        </el-form-item>
        <el-form-item label="岗位：" prop="team_leader_job" size="small">
          <el-input v-model="form.team_leader_job" placeholder="请输入队长岗位" class="input_width" />
        </el-form-item>
        <el-form-item label="微信号：" prop="team_leader_wechat" size="small">
          <el-input v-model="form.team_leader_wechat" placeholder="请输入队长微信号" class="input_width" />
        </el-form-item>
        <el-form-item label="手机号码：" prop="team_leader_phone" size="small">
          <el-input v-model="form.team_leader_phone" placeholder="请输入队长手机号" maxlength="11" show-word-limit class="input_width" />
        </el-form-item>
        <el-form-item label="邮箱：" prop="team_leader_email" size="small">
          <el-input v-model="form.team_leader_email" placeholder="请输入队长邮箱" class="input_width" />
        </el-form-item>
        <el-form-item label="身份证号码：" prop="team_leader_id_number" size="small">
          <el-input v-model="form.team_leader_id_number" placeholder="请输入队长身份证号码" maxlength="18" show-word-limit class="input_width" />
        </el-form-item>
      </fieldset>
      <br>

      <fieldset style="width:40%;">
        <legend>作品提交</legend>
        <el-form-item label="参赛作品名称：" prop="competition_product_name" size="small">
          <el-input v-model="form.competition_product_name" placeholder="请输入参赛作品名称" class="input_width" />
        </el-form-item>
        <el-form-item label="参赛作品简介：" prop="competition_product_introduce" size="small">
          <el-input
            v-model="form.competition_product_introduce"
            type="textarea"
            placeholder="参赛作品简介（500字内）"
            maxlength="500"
            show-word-limit
            class="input_width"
            :rows="5"
          />
        </el-form-item>
        <el-form-item ref="upload_attach_item" label="作品上传：" prop="files" size="small">
          <el-upload
            ref="upload_attach"
            class="upload-demo"
            action="/user/apply"
            multiple
            accept=".zip,.rar,.7z"
            :limit="1"
            :on-change="changFile"
            :on-exceed="handleExceed"
            :on-remove="removeFile"
            :file-list="fileList"
            :auto-upload="false"
            :http-request="uploadSectionFile"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">注:上传的文件须是压缩文件格式，且不超过50M</div>
          </el-upload>
          <el-progress v-show="show_progress" :percentage="progressPercent" />

        </el-form-item>

        <el-form-item label="附件名称：" prop="competition_product_attach_name" size="small">
          <el-input v-model="form.competition_product_attach_name" placeholder="请填写附件名称" class="input_width" />
        </el-form-item>
      </fieldset>
      <br>

      <br>
      <div style="text-align:left">
        <el-button type="primary" @click="onSubmit('form')">报名</el-button>
      </div>

    </el-form>

  </div>
</template>

<script>


export default {
  name: 'Apply',
  data() {
    // 验证密码
    var validateAttach = (rule, value, callback) => {
      console.log(this.fileList.length)
      if (this.fileList.length == 0) {
        callback(new Error('请选择附件'))
      } else {
        callback()
      }
    }

    return {
      body_show: true,
      form: {
        apply_person_name: '',
        apply_company: '',
        apply_department: '',
        apply_area: '集团内部赛区',
        competition_product_target: '精益生产',
        team_name: '',
        team_leader_name: '',
        team_leader_job: '',
        team_leader_wechat: '',
        team_leader_phone: '',
        team_leader_email: '',
        team_leader_id_number: '',
        competition_product_name: '',
        competition_product_introduce: '',
        files: null,
        competition_product_attach_name: ''
      },
      fileList: [],
      progressPercent: 0,
      show_progress: false,
      rules: {
        apply_person_name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        apply_company: [
          { required: true, message: '请输入学校/公司/组织', trigger: 'blur' }
        ],
        apply_department: [
          { required: true, message: '请输入专业/部门', trigger: 'blur' }
        ],
        apply_area: [
        ],
        competition_product_target: [
        ],
        team_name: [
          { required: true, message: '请输入团队名称', trigger: 'blur' }
        ],
        team_leader_name: [
          { required: true, message: '请输入队长姓名', trigger: 'blur' }
        ],
        team_leader_job: [
          { required: true, message: '请输入队长岗位', trigger: 'blur' }
        ],
        team_leader_wechat: [
          { required: true, message: '请输入队长微信号', trigger: 'blur' }
        ],
        team_leader_phone: [
          { required: true, message: '请输入队长手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '输入11位数字', trigger: 'blur' }
        ],
        team_leader_email: [
          { required: true, message: '请输入队长邮箱', trigger: 'blur' }
        ],
        team_leader_id_number: [
          { required: true, message: '请输入队长身份证号码', trigger: 'blur' },
          { min: 18, max: 18, message: '输入18位身份证号', trigger: 'blur' }
        ],
        competition_product_name: [
          { required: true, message: '请输入参赛作品名称', trigger: 'blur' }
        ],
        competition_product_introduce: [
          { required: true, message: '请输入参赛作品简介', trigger: 'blur' }
        ],
        files: [
          // { required: true, message: '请输入选择参赛作品', trigger: 'blur' },
          { validator: validateAttach }
        ],
        competition_product_attach_name: [
          { required: true, message: '请输入附件名称', trigger: 'blur' }
        ]

      }
    }
  },
  created() {
  },
  methods: {
    changFile(file, fileList) {
      console.log('changFile')
      console.log(fileList)
      // 选择文件后，给fileList对象赋值
      this.fileList = fileList
      this.$refs.upload_attach_item.validate()
    },
    removeFile(file, fileList) {
      this.fileList = fileList
      this.$refs.upload_attach_item.validate()
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制最多选择 1 个文件`)
    },
    onSubmit(formName) {
      // 校验合法性
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('发送post请求!');
          console.log('submit!')
          console.log(this.form)
          this.$refs.upload_attach.submit() // 触发调用uploadSectionFile，拿到param参数里面的File
        } else {
          console.log('error submit!!')
          this.$message({
            message: '请填写完整信息再后提交',
            type: 'error'
          })
          return false
        }
      })

      // this.apply();
      // this.$refs.upload_attach.submit() // 触发调用uploadSectionFile，拿到param参数里面的File
    },
    uploadSectionFile(param) {
      console.log(param)

      const data = new FormData()

      // todo 非常重要，一定要加file.raw，从浏览器中查看需要使用binary类型，后台才能正确接收
      // this.form.files = this.fileList[0].raw
      // console.log(this.fileList[0].raw)

      this.form.files = param.file // 将form中的files字段赋值File对象
      console.log(param.file)

      // 将form表单中的值都赋值给FormData传递给后台
      for (const key in this.form) {
        data.append(key, this.form[key])
      }

      const _loading = loading(`作品附件上传中，请稍后...`)

      // this.show_progress = true
      const config = {
        onUploadProgress: progressEvent => {
          // progressEvent.loaded:已上传文件大小
          // progressEvent.total:被上传文件的总大小
          this.progressPercent = Number((progressEvent.loaded / progressEvent.total * 100).toFixed(0))
          _loading.setText('作品上传中，进度：' + this.progressPercent + '%') // 更新dialog进度，优化体验
          console.log(this.progressPercent)
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      this.$axios
        .post(param.action, data, config)
        .then(resp => {
          console.log('请求本地接口OK')
          console.log(resp)
          this.fileList = []// 提交完成清空附件列表
          _loading.close() // 关闭加载框
          // this.show_progress = false
          this.progressPercent = 0

          if (resp.data.code == -1) {
            // 接口返回-1，就是报名失败，提示消息提示用户
            this.$message({
              message: resp.data.msg,
              type: 'error'
            })
          } else if (resp.data.code == 0) {
            console.log(resp.data)
            // 报名成功
            this.$message({
              message: '报名成功',
              type: 'success'
            })

            // 跳转到主页面
            // this.$router.replace('/home')
          }
        })
        .catch(function(error) { // 请求失败处理
          console.log('请求本地接口失败' + error)
        })
    }, validateAttach(rule, value, callback) {
      console.log(value)
      console.log(this.$refs.upload_attach)
    }

  }
}
</script>

<style scoped>
.myelement {
  text-align:left
}
.input_width{
  width: 50%;
  width: 300px;
}
fieldset {
  border:2px solid #DCDFE6;  text-align:left; border-radius: 8px;
}
</style>

