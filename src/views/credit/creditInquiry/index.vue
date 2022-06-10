<template>
  <div class="inquiry-container">
    <el-row type="flex" justify="space-around">
      <el-progress
        :width="250"
        type="dashboard"
        :percentage="credit"
        :color="color"
        :format="setText(credit)"
      />
    </el-row>
    <el-row type="flex" justify="space-around">
      <el-col :span="4">
        <div />
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="card-btn" @click.native="toConfirmation">
          <div>
            <img src="@/assets/credit_images/creditevaluate.png" class="image">
          </div>
          <div style="margin-top:20px">
            <router-link to="/credit/confirmationSubmit">申请评价</router-link>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4" />
      <el-col :span="6">
        <el-card shadow="hover" class="card-btn" @click.native="toRepair">
          <div>
            <img src="@/assets/credit_images/creditrepair.png" class="image" alt="">
          </div>
          <div style="margin-top:20px">
            <router-link to="/credit/creditRepair">评价标准</router-link>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4" />
    </el-row>
  </div>
</template>

<script>
import { fetchCredit } from '@/api/credit'
// import { getToken } from '@/utils/auth'
export default {
  name: 'App',
  data() {
    return {
      credit: 0,
      color: '',
      currentDate: new Date()
    }
  },
  computed: {
    getUsername() {
      return this.$store.state.user.username
    }
  },
  created() {
    this.getCredit()
  },
  methods: {
    getCredit() {
      console.log(this.$store.state.user.username)
      fetchCredit({ username: this.$store.state.user.username }).then(({ data }) => {
        console.log(data)
        if(data.credit==null){
          this.credit = 0
        }else{
          this.credit = data.credit
        }
        
      })
    },
    toConfirmation() {
      this.$router.push('/credit/confirmationSubmit')
      // this.$router.push('/rongque/progressInquiry')
    },
    toRepair() {
      this.$router.push('/credit/evaluateCriteria')
    },
    setText(score) {
      if (score > 100) {
        score = 100
      } else if (score < 0) {
        score = 0
        this.color = '#f56c6c'
      } else if (score >= 80) {
        this.color = '#5cb87a'
      } else if (score >= 60) {
        this.color = '#1989fa'
      } else {
        this.color = '#f56c6c'
      }
      return () => {
        return score + '分'
      }
    }
  }
}
</script>

<style scoped>
.inquiry-container {
  width: 100%;
  margin-top: 10px
}

.card-btn {
  text-align: center
}
</style>
