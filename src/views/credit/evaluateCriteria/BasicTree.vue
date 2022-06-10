<template>
  <div class="basic-tree">
    <ul style="padding-left: 16px;">
      <template v-for="item in treeList">
        <li v-if="item.childs==null &&item.treeNode" :key="item.treeNode.id">
          <div
            :class="{'current': currentIndex === item.treeNode.id}"
            @click="handleValue(item.treeNode.name,item.treeNode.id)"
          >
            <!--<Checkbox v-model="item.treeNode.name"></Checkbox>-->
            <span class="parent-icon"><Icon :type="item.treeNode.icon" /></span>
            <span>{{ item.treeNode.name }}</span>
            <div v-show="funcFlag" class="funcs">
              <span @click.stop.prevent="addTreeNode(item.treeNode.id)">
                <Icon type="ios-add" />
              </span>
              <span @click.stop.prevent="substructTreeNode(item.treeNode.id,$event)">
                <Icon type="ios-close" />
              </span>
            </div>
          </div>
        </li>
        <li v-if="item.childs&&item.treeNode" :id="&quot;tree&quot;+item.treeNode.id" :key="item.id">
          <div class="parentli" @click="toggleTreeNodeList(item.treeNode.id)">
            <!--<Checkbox v-model="item.treeNode.name"></Checkbox>-->
            <span class="parent-icon"><Icon :type="item.treeNode.icon" /></span>
            <span>{{ item.treeNode.name }}</span>
            <div v-show="funcFlag" class="funcs">
              <span @click.stop.prevent="addTreeNode(item.treeNode.id)">
                <Icon type="ios-add" />
              </span>
            </div>
          </div>
          <BasicTree :tree-list="item.childs" :func-flag="funcFlag" />
        </li>
      </template>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'BasicTree',
  props: {
    /**
     * 接收tree组件数据源
     */
    treeList: {
      type: Array,
      default() {
        return []
      }
    },
    /**
     * 是否开启节点新增删除功能
     */
    funcFlag: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState([
      'currentIndex', // 当前选中的属性节点索引
      'treeFlag', // 控制tree中的节点展开和收起
      'treeNodeValue' // tree新增的节点值
    ])
  },
  methods: {
    ...mapMutations([
      'setTreeValue', // 设置store中搜索关键词treeNodeVal的值
      'setCurrentIndex', // 设置选中的属性节点索引值
      'setTreeFlag', // 设置tree中的节点开关标识值
      'addStoreTreeNode', // 增加新节点
      'delStoreTreeNode', // 删除节点
      'setTreeNodeValue' // 设置新增节点的值
    ]),
    /**
     * 设置搜索关键词的值和当前选中的索引
     * @param val 关键词的值
     * @param id  索引
     */
    handleValue(val, id) {
      this.setTreeValue(val)
      this.setCurrentIndex(id)
    },
    /**
     * 展开/收起节点
     * @param num 节点id值
     */
    toggleTreeNodeList(num) {
      const dom = document.getElementById('tree' + num)
      const subDom = dom.childNodes
      if (this.treeFlag) {
        subDom[2].style.display = 'none'
        this.setTreeFlag()
      } else {
        subDom[2].style.display = ''
        this.setTreeFlag()
      }
    },
    /**
     * 新增节点
     * @param num 节点id值
     */
    addTreeNode(num) {
      const vm = this
      this.$Modal.confirm({
        render: (h) => {
          return h('Input', {
            props: {
              value: this.treeNodeValue,
              autofocus: true,
              placeholder: '请输入节点名称'
            },
            on: {
              input: (val) => {
                vm.setTreeNodeValue(val)
              }
            }
          })
        },
        onOk() {
          if (vm.treeNodeValue === '' || vm.treeNodeValue === null) {
            vm.$Message.error('节点值不能为空')
          } else {
            const obj = []
            obj.push({ id: num, name: vm.treeNodeValue })
            vm.addStoreTreeNode(obj)
          }
        }
      })
    },
    /**
     * 删除节点
     * @param num 节点id值
     * @param event 当前点击事件对象
     */
    substructTreeNode(num, event) {
      const currentParentNode = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
      let currentParentId = currentParentNode.getAttribute('id')
      if (new RegExp(`(tree)`).test(currentParentId)) {
        currentParentId = currentParentId.replace(RegExp.$1, '')
      }
      const finalParentId = parseInt(currentParentId)
      const numObj = {}
      numObj.num = num
      numObj.finalParentId = finalParentId
      this.delStoreTreeNode(numObj)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~common/stylus/variable.styl";

.basic-tree
  width: 100%
  position: relative
  font-size: $font-size-small
  .parent-icon
    display: inline-block
    margin-left: 4px
    font-size: $font-size-large
    color: $color-blue
  .parentli
    height: 30px
    line-height: 30px
    font-size: $font-size-small-x
    background: $color-background-s
    .funcs
      display: inline-block
      margin-left: 10px
      font-size: 0
      span
        display: inline-block
        width: 10px
        height: 10px
        z-index: 100
        font-size: 20px
        &:nth-child(1)
          color: $color-blue
        &:nth-child(2)
          color: $color-red
  ul
    & > li
      padding-top: 6px
      position: relative
      left: 0
      cursor: pointer
      li
        &::before
          border-left: 1px dashed $color-text-input
        &::after
          border-top: 1px dashed $color-text-input
  li
    div
      .funcs
        display: inline-block
        margin-left: 10px
        font-size: 0
        span
          display: inline-block
          width: 10px
          height: 10px
          margin-right: 10px
          z-index: 100
          font-size: 20px
          &:nth-child(1)
            color: $color-blue
          &:nth-child(2)
            color: $color-red
      &.current
        color: $color-text-white
        background: $color-blue
        .parent-icon
          color: $color-text-white
        .funcs
          span
            color: $color-text-white
    &::before, &::after
      position: absolute
      left: -14px
      right: auto
      content: ''
    &::before
      top: 0
      bottom: 50px
      width: 1px
      height: 100%
    &::after
      width: 14px
      top: 25px
    &:last-child
      &::before
        height: 25px
    ul > li
      padding-top: 10px
      position: relative
      left: 10px

</style>
