<template>
  <div class="app-container">
    <el-input v-model="businessid" placeholder="业务编号" style="margin-bottom:30px;" />
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
        <el-card>
          <h4>{{ activity.title }}</h4>
          <p>{{ activity.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>

  </div>
</template>
<script>
import { fetchProgress } from '@/api/rongque'
// import { getToken } from '@/utils/auth'
export default {
  name: 'App',
  data() {
    return {
      activities: null,
      businessid: null,
    }
  },
  computed: {
    getUsername() {
      return this.$store.state.user.username
    }
  },
  created() {
    this.getProgress()
  },
  methods: {
    // TODO 定义获取数据函数及数据处理
    getProgress() {
      fetchProgress({ username: this.$store.state.user.username }).then(({ data }) => {
        console.log(data)
        this.activities = data
      })
    }
  }
}
</script>
<style scoped>
.block {

  margin-top: 10px
}

.card-btn {
  text-align: center
}
</style>
