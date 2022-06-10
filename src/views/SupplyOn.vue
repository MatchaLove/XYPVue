<template>
  <div>
    <div style="padding: 10px 0">
      <el-input v-model="pid" style="width: 200px" placeholder="请输入材料编号" suffix-icon="el-icon-search" />
      <el-input v-model="ptype" style="width: 200px" placeholder="请输入材料类型" suffix-icon="el-icon-search" />
      <el-input v-model="pbatch" style="width: 200px" placeholder="请输入材料规格" suffix-icon="el-icon-search" class="ml-5" />
      <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
      <el-button type="warning" @click="reset">重置</el-button>
    </div>

    <div style="padding: 10px 0">
      <el-button type="primary" @click="handleAdd"><i class="el-icon-circle-plus-outline mr-5" />新增</el-button>
      <el-popconfirm
        class="ml-5"
        confirm-button-text="确定"
        cancel-button-text="我再想想"
        icon="el-icon-info"
        icon-color="red"
        title="确定批量删除吗？"
        @confirm="delBatch"
      >
        <el-button slot="reference" type="danger"><i class="el-icon-remove-outline mr-5" />批量删除</el-button>
      </el-popconfirm>
    </div>

    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="材料编号" fixed align="center" width="150px" />
      <el-table-column prop="productType" label="材料类型" align="center" width="150px" />
      <el-table-column prop="productBatch" label="材料规格" align="center" width="150px" />
      <el-table-column prop="number" label="数量" align="center" width="150px" />
      <el-table-column label="材料图片" align="center" width="150px">
        <template #default="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.photo"
            :preview-src-list="[scope.row.photo]"
          />
        </template>
      </el-table-column>
      <el-table-column label="材质文件" align="center" width="150px">
        <template slot-scope="scope">
          <el-button type="primary" @click="materialDownload(scope.row)"><i class="el-icon-search" />预览</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="entryTime" label="时间" align="center" width="150px" />
      <el-table-column prop="isChecked" label="当前状态" align="center" width="120px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isChecked === '2'" type="danger">数据异常</el-tag>
          <el-tag v-if="scope.row.isChecked === '1'" type="success">已上链</el-tag>
          <el-tag v-if="scope.row.isChecked === '0'">未上链</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="200px">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isChecked === '0'" type="success"@click="handleEdit(scope.row)"><i class="el-icon-edit mr-5" />编辑</el-button>
          <el-popconfirm
            v-if="scope.row.isChecked === '0'"
            class="ml-5"
            confirm-button-text="确定"
            cancel-button-text="我再想想"
            icon="el-icon-info"
            icon-color="red"
            title="您确定删除吗？"
            @confirm="del(scope.row.id)"
          >
            <el-button slot="reference" type="danger"><i class="el-icon-remove-outline mr-5" />删除</el-button>
          </el-popconfirm>
          <div v-else>已审核</div>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0">
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog title="材料供应信息" :visible.sync="dialogFormVisible" width="30%" align="center">
      <el-form label-width="80px" size="small">
        <el-form-item label="材料编号">
          <el-input v-model="form.id" autocomplete="off" />
        </el-form-item>
        <el-form-item label="材料类型">
          <el-input v-model="form.productType" autocomplete="off" />
        </el-form-item>
        <el-form-item label="材料规格">
          <el-input v-model="form.productBatch" autocomplete="off" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="form.number" autocomplete="off" />
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker v-model="form.entryTime" style="width:100%;" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="材料图片">
          <el-upload
            ref="upload"
            align="left"
            action="http://localhost:8081/msupply/submit"
            :on-success="photoUploadSuccess"
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="材质报告">
          <el-upload
            ref="uploads"
            align="left"
            class="upload-demo"
            action="http://localhost:8081/msupply/upload"
            :before-upload="beforeUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-success="filesUploadSuccess"
            :file-list="files"
            :limit="1"
            accept=".pdf"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">请将材质指标整合成一个PDF文件后提交</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'SupplyOn',
  data() {
    return {
      serverIp: 'localhost',
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      pid: '',
      ptype: '',
      pbatch: '',
      corporation: '1',
      form: {},
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {},
      dialogFormVisible: false,
      multipleSelection: [],
      files: []
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      this.request.get('/msupply/page', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          pid: this.pid,
          ptype: this.ptype,
          pbatch: this.pbatch,
          name: this.user.name
        }
      }).then(res => {
        console.log(res)
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    reset() {
      this.pid = ''
      this.ptype = ''
      this.pbatch = ''
      this.load()
    },
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row))
      if (this.$refs['upload']) {
        this.$refs['upload'].clearFiles() // 清除历史文件列表
      }
      if (this.$refs['uploads']) {
        this.$refs['uploads'].clearFiles() // 清除历史文件列表
      }
      this.dialogFormVisible = true
    },
    del(id) {
      this.request.post('/msupply/' + id).then(res => {
        if (res.code === '200') {
          this.$message.success('删除成功')
          this.load()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.load()
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    save() {
      this.request.post('/msupply', { material: this.form, username: this.user.username }).then(res => {
        if (res.code === '200') {
          this.$message.success('保存成功')
          this.dialogFormVisible = false
          if (this.$refs['upload']) {
            this.$refs['upload'].clearFiles() // 清除历史文件列表
          }
          if (this.$refs['uploads']) {
            this.$refs['uploads'].clearFiles() // 清除历史文件列表
          }
          this.load()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleAdd() {
      if (this.$refs['upload']) {
        this.$refs['upload'].clearFiles() // 清除历史文件列表
      }
      if (this.$refs['uploads']) {
        this.$refs['uploads'].clearFiles() // 清除历史文件列表
      }
      this.dialogFormVisible = true
      this.form = {}
    },
    delBatch() {
      const ids = this.multipleSelection.map(v => v.id) // [{}, {}, {}] => [1,2,3]
      this.request.post('/msupply/del/batch', ids).then(res => {
        if (res.code === '200') {
          this.$message.success('批量删除成功')
          this.load()
        } else {
          this.$message.error('批量删除失败')
        }
      })
    },
    handleRemove(file, files) {
      console.log(file, files)
    },
    handlePreview(file) {
      console.log(file)
    },
    beforeUpload(file) {
      var fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
      const isFile =
                    fileType === 'pdf'
      if (!isFile) {
        this.$message.error('请选择正确的文件格式')
        return false
      }
      const isLt50M = file.size / 1024 / 1024 < 100
      if (!isLt50M) {
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      return isLt50M && isFile
    },
    photoUploadSuccess(res) {
      console.log(res)
      this.form.photo = res.data
    },
    beforeRemove(file, files) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    filesUploadSuccess(res) {
      console.log(res)
      this.form.pcertificate = res.data
    },
    materialDownload(row) {
      this.request({
        url: '/msupply//file/download',
        method: 'get',
        responseType: 'blob',
        params: { id: row.id }
      }).then(res => {
        if ((row.pcertificate != null) && (row.pcertificate != '')) {
          const binaryData = []
          binaryData.push(res)
          const pdfUrl = window.URL.createObjectURL(new Blob(binaryData, { type: 'application/pdf' }))
          window.open(pdfUrl)
        } else {
          this.$message.error('未上传材质文件')
        }
      }
      )
    }
  }
}
</script>

<style>
    .headerBg {
        background-color: #eee !important;
    }
</style>
