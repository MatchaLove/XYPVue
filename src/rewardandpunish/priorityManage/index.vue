<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="信用代码">
        <template slot-scope="{row}">
          <span>{{ row.identifier }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="企业名称">
        <template slot-scope="{row}">
          <span>{{ row.companyname }}</span>
        </template>
      </el-table-column>


      
      <el-table-column width="100px" label="优先级">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column> 


      <el-table-column min-width="300px" label="备注">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.title" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancel
            </el-button>
          </template>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="{row}">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            Ok
          </el-button>
          <el-button
            v-else
            type="info"
            size="small"
            icon="el-icon-edit"
            @click="row.edit=!row.edit"
          >
            Edit
          </el-button>
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            Ok
          </el-button>
          <el-button
            v-else
            type="danger"
            size="small"
            icon="el-icon-edit"
            @click="row.edit=!row.edit"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import { fetchList } from '@/api/article'

export default {
  name: 'Blacklist',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      // const { data } = await fetchList(this.listQuery)
      const data = {
        "total": 100,
        "items": [
          {
            "id": 1,
            "identifier": "91450126MA5KEQ802E",
            "companyname": "宾阳县恒丰机动车检测有限公司",
            "reviewer": "Sharon",
            "title": "信用良好",
            "content_short": "mock data",
            "content": "<p>I am testing data, I am testing data.</p><p><img src=\"https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943\"></p>",
            "forecast": 97.47,
            "importance": 2,
            "type": "EU",
            "status": "published",
            "display_time": "1973-06-02 10:51:48",
            "comment_disabled": true,
            "pageviews": 3501,
            "image_uri": "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
            "platforms": [
              "a-platform"
            ],
            "edit": false,
            "originalTitle": "Zqkrymrjd Sdskqs Foefx Hfzr Nxlsvlnv Hahcpcaj"
          },
          {
            "id": 2,
            "identifier": "91450800MA5K9XBN1Y",
            "companyname": "Edward",
            "reviewer": "广西华奥汽车制造有限公司",
            "title": "信用良好",
            "content_short": "mock data",
            "content": "<p>I am testing data, I am testing data.</p><p><img src=\"https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943\"></p>",
            "forecast": 79.77,
            "importance": 1,
            "type": "US",
            "status": "published",
            "display_time": "1992-12-17 11:55:58",
            "comment_disabled": true,
            "pageviews": 641,
            "image_uri": "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
            "platforms": [
              "a-platform"
            ],
            "edit": false,
            "originalTitle": "Rxqtttesm Rqgkedrg Blejddqlu Tsedtgfi Buwocjtyqs Rms Rlnvxvpc Lwjxtfqj"
          },
          {
            "id": 3,
            "identifier": "91450500588647242E",
            "companyname": "北海鸿旺电子科技有限公司",
            "reviewer": "Charles",
            "title": "信用良好",
            "content_short": "mock data",
            "content": "<p>I am testing data, I am testing data.</p><p><img src=\"https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943\"></p>",
            "forecast": 11.83,
            "importance": 1,
            "type": "US",
            "status": "published",
            "display_time": "1995-03-15 00:38:45",
            "comment_disabled": true,
            "pageviews": 4169,
            "image_uri": "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
            "platforms": [
              "a-platform"
            ],
            "edit": false,
            "originalTitle": "Seumerh Jdafkwzxd Cuejjeoek Fbdhx Wbsdxnlnh Igys Xtsoyktr Yjkjayjll Gcikyzh"
          },
          {
            "id": 4,
            "identifier": "	91450722310122919P",
            "companyname": "浦北金汇源商贸有限公司",
            "reviewer": "Jose",
            "title": "信用良好",
            "content_short": "mock data",
            "content": "<p>I am testing data, I am testing data.</p><p><img src=\"https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943\"></p>",
            "forecast": 27.18,
            "importance": 2,
            "type": "US",
            "status": "draft",
            "display_time": "1977-06-02 19:37:13",
            "comment_disabled": true,
            "pageviews": 4788,
            "image_uri": "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
            "platforms": [
              "a-platform"
            ],
            "edit": false,
            "originalTitle": "Tgauwk Jmnt Gvrgphf Wjgzmfnj Zcvoqkt Tnypyon"
          },
          {
            "id": 5,
            "identifier": "91450500MA5MUUW64T",
            "companyname": "北海市联颖电子科技有限公司",
            "reviewer": "Betty",
            "title": "信用良好",
            "content_short": "mock data",
            "content": "<p>I am testing data, I am testing data.</p><p><img src=\"https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943\"></p>",
            "forecast": 27.54,
            "importance": 2,
            "type": "US",
            "status": "draft",
            "display_time": "2012-02-29 18:03:10",
            "comment_disabled": true,
            "pageviews": 946,
            "image_uri": "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
            "platforms": [
              "a-platform"
            ],
            "edit": false,
            "originalTitle": "Fbygchlb Wpmw Umz Jdod Rqhsielmm Dlqqubdxvm Ufyf Rdprlek Xgisytd Fjeifekje"
          },
          {
            "id": 6,
            "identifier": "	91450200779110923U",
            "companyname": "柳州市金百汇激光技术有限责任公司",
            "reviewer": "Jason",
            "title": "信用良好",
            "content_short": "mock data",
            "content": "<p>I am testing data, I am testing data.</p><p><img src=\"https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943\"></p>",
            "forecast": 35.52,
            "importance": 1,
            "type": "US",
            "status": "draft",
            "display_time": "1997-07-21 15:16:38",
            "comment_disabled": true,
            "pageviews": 2281,
            "image_uri": "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
            "platforms": [
              "a-platform"
            ],
            "edit": false,
            "originalTitle": "Kcrrtfaeq Brqd Tbtdrb Ofaper Rksk Mtdwcppu Wnmt Bwnfkdnqcy Nvivyq"
          },
          {
            "id": 7,
            "identifier": "914501273403273253",
            "companyname": "广西春之森茶业有限公司",
            "reviewer": "Linda",
            "title": "信用良好",
            "content_short": "mock data",
            "content": "<p>I am testing data, I am testing data.</p><p><img src=\"https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943\"></p>",
            "forecast": 38.01,
            "importance": 2,
            "type": "JP",
            "status": "published",
            "display_time": "1993-05-21 15:14:18",
            "comment_disabled": true,
            "pageviews": 4691,
            "image_uri": "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
            "platforms": [
              "a-platform"
            ],
            "edit": false,
            "originalTitle": "Jototeh Xwbcv Omeiwu Vzxcktser Vqeqcvvmwy Xfgdvv Ligyiq Llth Gpjsuxqky"
          }
        ]
      }
      const items = data.items
      this.list = items.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalTitle = v.title //  will be used when user click the cancel botton
        return v
      })
      this.listLoading = false
    },
    cancelEdit(row) {
      row.title = row.originalTitle
      row.edit = false
      this.$message({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalTitle = row.title
      this.$message({
        message: 'The title has been edited',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
