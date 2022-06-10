<template>
  <div class="knowledge-query">
    <!--左侧布局-->
    <div class="left-wrapper">
      <!--搜索框-->
      <div class="search-wrapper">
        <div class="input-wrapper">
          <input
            v-model="keywordSearch"
            type="text"
            placeholder="请输入关键词搜索"
            @keyup.enter="searchKnowledge"
          >
          <span class="icon" @click="delKeywordSearch"><Icon type="ios-close" /></span>
          <span class="search-btn" @click="searchKnowledge(1)">搜索</span>
        </div>
        <div v-if="IsResultListShow" class="result-wrapper">
          <ul>
            <li
              v-for="(item,index) in searchListData"
              :key="index"
              class="item-list"
              @click="choiceValue(item.result)"
            >
              {{ item.result }}
            </li>
          </ul>
        </div>
      </div>
      <!--内容区-->
      <div class="content-wrapper" @click="hideResultList">
        <h1 v-show="!keywordSearch.length" class="title-hide">暂无搜索条件以下为默认搜索结果</h1>
        <h1 v-show="keywordSearch.length" class="title">大约有<span
          class="num"
        >236</span>项与&nbsp;“<span class="key">{{ keywordSearch }}</span>”&nbsp;相关的搜索结果</h1>
        <ul>
          <li
            v-for="(result,index) in resultListData"
            :key="index"
            class="result-list"
            @click="navictionUrl(1)"
          >
            <h1 class="title" v-html="result.title" />
            <div class="content">
              <div v-show="result.img.length" class="img-wrapper">
                <img :src="result.img" width="124" height="84">
              </div>
              <div class="text-wrapper">
                <h1 class="top-wrapper">{{ result.desc }}</h1>
                <div class="bottom-wrapper">
                  <span class="time">{{ result.time }}</span>
                  <span class="classify">{{ result.classify }}</span>
                  <span class="user">{{ result.reportUser }}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div class="page">
          <Page :total="100" show-total @on-change="searchKnowledge" />
        </div>
      </div>
    </div>
    <!--右侧布局-->
    <div class="right-wrapper" @click="hideResultList">
      <!--添加知识库-->
      <div class="add-wrapper">
        <div class="btn-wrapper" @click="addKnowledge">
          <span class="icon-knowledge"><Icon type="ios-cloud-upload-outline" /></span>
          <span class="btn">添加知识库</span>
        </div>
        <div class="text">已有<span class="total">3166</span>份知识库资料</div>
        <h1 class="nums">363</h1>
        <p class="new-text">今日新增知识库</p>
      </div>
      <!--树形结构-->
      <div class="tree-wrapper">
        <div class="title-wrapper">
          <span class="border" />
          <span class="tree-title">知识库分类</span>
        </div>
        <div ref="treeWrapper" class="tree">
          <BasicTree :tree-list="treeList" :func-flag="funcFlag" />
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import axios from 'axios'
import { mapState, mapMutations } from 'vuex'
import BasicTree from 'BasicTree.vue'

export default {
  name: 'KnowledgeQuery',
  data() {
    return {
      IsResultListShow: false, // 搜索列表显示隐藏的开关
      searchListData: [
        { result: '打印机卡纸在什么位置' },
        { result: '打印机卡纸的解决办法' },
        { result: '打印机卡纸了怎么把它拿出来' },
        { result: '电脑没法联网' },
        { result: '怎么清理电脑c盘' },
        { result: '笔记本电脑屏保损坏' }
      ], // 存放搜索列表的数组
      resultListData: [
        {
          title: '<font color="#f14f4f">打印机卡纸</font>',
          img: 'https://gd4.alicdn.com/imgextra/i4/3275704363/TB2E2okfOFTMKJjSZFAXXckJpXa_!!3275704363.jpg',
          desc: '打印机不能打印大都是因为进出纸部件损坏，就是滚纸那个轴；纸路传感器故障，驱动部件失灵，还有可能是同时进了多张纸甚至纸张的质量差也会导致卡纸等等',
          time: '2018年12月16号',
          classify: '打印机卡纸',
          reportUser: '张云飞'
        },
        {
          title: '针式<font color="#f14f4f">打印机卡纸</font>',
          img: 'https://gd3.alicdn.com/imgextra/i3/246349854/TB2jqJVcXmWBuNjSspdXXbugXXa_!!246349854.jpg',
          desc: '打印机不能打印大都是因为进出纸部件损坏，就是滚纸那个轴；纸路传感器故障，驱动部件失灵，还有可能是同时进了多张纸甚至纸张的质量差也会导致卡纸等等',
          time: '2018年12月16号',
          classify: '打印机卡纸',
          reportUser: '张云飞'
        },
        {
          title: '<font color="#f14f4f">打印机卡纸</font>进纸器损坏',
          img: 'https://gd3.alicdn.com/imgextra/i3/246349854/TB2H9D4dkfb_uJkSmLyXXcxoXXa_!!246349854.jpg',
          desc: '打印机不能打印大都是因为进出纸部件损坏，就是滚纸那个轴；纸路传感器故障，驱动部件失灵，还有可能是同时进了多张纸甚至纸张的质量差也会导致卡纸等等',
          time: '2018年12月16号',
          classify: '打印机卡纸',
          reportUser: '张云飞'
        },
        {
          title: '喷墨<font color="#f14f4f">打印机卡纸</font>',
          img: 'https://gd1.alicdn.com/imgextra/i1/246349854/TB2xl4ZlDnI8KJjy0FfXXcdoVXa_!!246349854.png',
          desc: '打印机不能打印大都是因为进出纸部件损坏，就是滚纸那个轴；纸路传感器故障，驱动部件失灵，还有可能是同时进了多张纸甚至纸张的质量差也会导致卡纸等等',
          time: '2018年12月16号',
          classify: '打印机卡纸',
          reportUser: '张云飞'
        },
        {
          title: '激光<font color="#f14f4f">打印机卡纸</font>',
          img: 'https://gd1.alicdn.com/imgextra/i1/246349854/TB2dAnTgZnI8KJjSsziXXb8QpXa_!!246349854.jpg',
          desc: '打印机不能打印大都是因为进出纸部件损坏，就是滚纸那个轴；纸路传感器故障，驱动部件失灵，还有可能是同时进了多张纸甚至纸张的质量差也会导致卡纸等等',
          time: '2018年12月16号',
          classify: '打印机卡纸',
          reportUser: '张云飞'
        },
        {
          title: '<font color="#f14f4f">打印机卡纸</font>如何修理',
          img: 'https://gd2.alicdn.com/imgextra/i3/0/O1CN01uMwFND1W6xhSOpi3t_!!0-item_pic.jpg',
          desc: '打印机不能打印大都是因为进出纸部件损坏，就是滚纸那个轴；纸路传感器故障，驱动部件失灵，还有可能是同时进了多张纸甚至纸张的质量差也会导致卡纸等等',
          time: '2018年12月16号',
          classify: '打印机卡纸',
          reportUser: '张云飞'
        }
      ], // 存放搜索结果列表的数组展示内容
      funcFlag: true // 是否开启tree组件的节点增加删除功能
    }
  },
  computed: {
    ...mapState([
      'treeList' // treeList tree组件的数据源
    ]),
    // 搜索关键词的计算属性的get和set方法
    keywordSearch: {
      get: function() {
        return this.$store.state.treeNodeVal
      },
      set: function(newValue) {
        this.setTreeValue(newValue)
      }
    }
  },
  methods: {
    ...mapMutations([
      'setTreeList', // 请求接口设置tree组件的数据源
      'setTreeValue', // 设置store中搜索关键词treeNodeVal的值
      'delTreeValue' // 删除同上
    ]),
    /**
     * 将中文转为unicode编码
     * @param s 中文字符串参数
     */
    toUnicode(s) {
      return s.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, function(newStr) {
        return '\\u' + newStr.charCodeAt(0).toString(16)
      })
    },
    showResultList() {
      this.IsResultListShow = true
    },
    hideResultList() {
      this.IsResultListShow = false
    },
    delKeywordSearch() {
      this.delTreeValue()
    },
    /**
     * 调用获取搜索关键词列表接口
     */
    haveSearchList() {
      console.log('调用获取搜索关键词列表接口得到searchListData的值')
    },
    /**
     * 调用搜索结果列表接口
     * @param num 页码
     */
    searchKnowledge(num) {
      if (this.keywordSearch) {
        num = !num ? 1 : num
        console.log('调用搜索结果列表接口', num)
      }
    },
    choiceValue(result) {
      this.setTreeValue(result)
    },
    addKnowledge() {
      console.log('跳转到增加知识库界面')
    },
    /**
     * 打开新页面窗口
     * @param num 传递的参数id
     */
    navictionUrl(num) {
      const routeUrl = this.$router.resolve({
        path: '/test',
        query: { id: num }
      })
      window.open(routeUrl.href, '_blank')
    }
  },
  watch: {
    'keywordSearch'() {
      if (this.keywordSearch) {
        this.haveSearchList()
        // 模拟搜索列表的出现效果，关键点中文正则匹配
        const unicodeVal = this.toUnicode(this.keywordSearch)
        const searchArrays = []
        this.searchListData.forEach((val) => {
          if (new RegExp(`(${unicodeVal})`).test(val.result)) {
            searchArrays.push(val)
          }
        })
        console.log(searchArrays)
        if (searchArrays.length > 1) {
          this.showResultList()
        } else {
          this.hideResultList()
        }
        this.searchKnowledge()
      }
    }
  },
  created() {
    const vm = this
    axios.get('/api/treelist').then(res => {
      if (res.data.errno === 1) {
        vm.setTreeList(res.data.data)
      }
    })
  },
  components: {
    BasicTree
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~common/stylus/variable.styl";

.knowledge-query
  display: flex
  margin: 16px 24px
  .left-wrapper
    flex: 1
    margin-right: 16px
    .search-wrapper
      position: relative
      margin-bottom: 16px
      .input-wrapper
        display: flex
        position: relative
        font-size: $font-size-medium-x
        color: $color-text-input
        input
          flex: 1
          height: 56px
          line-height: 56px
          padding-left: 24px
          border-top: 1.5px solid $color-blue
          border-left: 1.5px solid $color-blue
          border-bottom: 1.5px solid $color-blue
        .icon
          position: absolute
          top: 12px
          right: 22% // 设置百分比能够保证图标始终与右侧保持同等距离不会随着分辨率变化而出现错位
          font-size: 30px
        .search-btn
          display: inline-block
          flex: 0 0 20%
          width: 20%
          height: 57px
          line-height: 57px
          text-align: center
          color: $color-text-white
          background-color: $color-blue
      .result-wrapper
        position: absolute
        top: 58px
        left: 0
        width: 80%
        z-index: 100
        font-size: $font-size-medium
        background-color: $color-text-white
        box-shadow: 2px 2px 2px 0 rgba(100, 100, 100, 0.1)
        .item-list
          height: 36px
          line-height: 36px
          padding-left: 24px
          &:hover
            background-color: #f0f0f0
    .content-wrapper
      position: relative
      padding: 32px 24px 16px
      border-radius: 8px
      background: $color-text-white
      .title, .title-hide
        margin-bottom: 18px
        line-height: 14px
        font-size: $font-size-small
        color: $color-text-input
        .num
          color: $color-blue
        .key
          color: $color-red
      .result-list
        padding: 16px 0
        border-bottom: 1px dashed $color-background-t
        &:first-child
          padding-top: 0
        &:last-child
          padding-bottom: 30px
          border: none
        .title
          display: inline-block
          margin-bottom: 12px
          padding-bottom: 2px
          line-height: 18px
          font-size: $font-size-medium-x
          color: $color-text-title
          border-bottom: 1px solid $color-text-title
        .content
          display: flex
          font-size: 0
          .img-wrapper
            flex: 0 0 124px
            width: 124px
            height: 84px
            margin-right: 16px
          .text-wrapper
            flex: 1
            font-size: $font-size-small-x
            .top-wrapper
              margin: 2px 0 10px
              line-height: 20px
              color: $color-text-content
            .bottom-wrapper
              color: $color-text-input
              .classify
                display: inline-block
                margin: 0 18px
      .page
        font-size: $font-size-medium
  .right-wrapper
    flex: 0 0 360px
    .add-wrapper
      padding: 24px 26px
      text-align: center
      font-size: $font-size-medium
      border-radius: 8px
      background-color: $color-text-white
      .btn-wrapper
        margin: 0 10px 16px
        height: 56px
        line-height: 56px
        font-size: 0
        color: $color-text-white
        background: $color-orange
        .icon-knowledge
          display: inline-block
          width: 20px
          height: 20px
          margin-right: 6px
          font-size: $font-size-large
        .btn
          line-height: 18px
          font-size: $font-size-medium-x
      .text
        padding-bottom: 16px
        line-height: 18px
        color: $color-text-input
        border-bottom: 1px solid $color-background-t
        .total
          font-size: $font-size-large
          color: $color-orange
      .nums
        margin: 18px 0 12px
        font-size: 36px
        color: $color-purple
      .new-text
        color: $color-text-input
    .tree-wrapper
      margin-top: 16px
      border-radius: 8px
      background: $color-text-white
      .title-wrapper
        height: 58px
        line-height: 58px
        font-size: 0
        border-bottom: 1px solid $color-background-t
        .border
          display: inline-block
          position: relative
          top: 6px
          width: 4px
          height: 22px
          background: $color-blue
        .tree-title
          display: inline-block
          padding-left: 24px
          font-size: $font-size-medium
          color: $color-text-title
      .tree
        width: 360px
        height: 772px
        overflow: auto
        padding-left: 10px
        padding-bottom: 10px
        box-sizing: border-box
        &::-webkit-scrollbar
          width: 2px
          height: 2px
        &::-webkit-scrollbar-thumb
          border-radius: 5px
          -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2)
          background: $color-background-t
        &::-webkit-scrollbar-track
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2)
          border-radius: 0
          background: $color-text-white
</style>
