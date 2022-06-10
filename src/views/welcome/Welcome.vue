<template>
  <div class="wrapper1">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      text-color="#545c64"
      active-text-color="#0000CC"
      @select="handleSelect"
    >
      <el-menu-item><p style="color: royalblue; font-size: 25px;font-weight: bold">基于区块链的信用评价和容缺办理系统</p></el-menu-item>
      <el-menu-item index="1" style="margin-left: 300px"><a href="">首页</a></el-menu-item>
      <el-menu-item index="2" @click="handlechoose4"><a href="login">供应商</a></el-menu-item>
      <el-menu-item index="3" @click="handlechoose5"><a href="login">施工单位</a></el-menu-item>
      <el-menu-item index="4" @click="handlechoose2"><a href="login">监理单位和第三方检测</a></el-menu-item>
      <el-menu-item index="5" @click="handlechoose1"><a href="login">建设单位</a></el-menu-item>
      <el-menu-item index="6" @click="handlechoose3"><a href="login">质检部门</a></el-menu-item>
    </el-menu>
    <div class="wel">
      <p>欢迎使用</p>
      <p>公路材料质检和溯源系统</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1'
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    handlechoose1() {
      window.sessionStorage.setItem('role', '1')
    },
    handlechoose2() {
      window.sessionStorage.setItem('role', '2')
    },
    handlechoose3() {
      window.sessionStorage.setItem('role', '3')
    },
    handlechoose4() {
      window.sessionStorage.setItem('role', '4')
    },
    handlechoose5() {
      window.sessionStorage.setItem('role', '5')
    }
  }
}
</script>

<style>
    .wrapper1 {
        height: 100vh;
        background-image: url("../../assets/background.jpeg");
        background-repeat:no-repeat;
        background-size:100%;
        overflow: hidden;
    }
    .el-menu-demo {
        background-color: #ffffff;
        height: 60px;
    }
    a {
        font-size: large;
        text-decoration:none;
    }
    .wel {
        text-align: center;
        margin-top: 100px;
        font-size: 70px;
        color: white;
    }

</style>
