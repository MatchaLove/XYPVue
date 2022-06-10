<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      icon-class="el-icon-notebook-2"
      default-expand-all
    />

  </div>
</template>

<script>
export default {

  data() {
    return {
      filterText: '',
      data2: [{
        id: 1,
        label: '商业信用 60%',
        children: [{
          id: 4,
          label: '财务指标',
          children: [{
            id: 9,
            label: '资产负债率'
          }, {
            id: 10,
            label: '每股未分配利润'
          }, {
            id: 10,
            label: '净资产收益率'
          }, {
            id: 10,
            label: '营业收入净利润率'
          }, {
            id: 10,
            label: '现金流动负债比率'
          }]
        }, {
          id: 4,
          label: '商业指标',
          children: [{
            id: 9,
            label: '合同履约率'
          }, {
            id: 10,
            label: '应付账款清偿率'
          }]
        },
        {
          id: 4,
          label: '金融指标',
          children: [{
            id: 9,
            label: '是否有逾期账款'
          }, {
            id: 10,
            label: '是否有未承兑票据'
          }]
        }
        ]
      }, {
        id: 2,
        label: '社会信用 35%',
        children: [{
          id: 5,
          label: '行政监管信用记录' // 是否具有行政处罚
        }, {
          id: 6,
          label: '税务记录' // 纳税信用等级
        }, {
          id: 6,
          label: '劳保与社保缴纳情况'
        }, {
          id: 6,
          label: '法律诉讼情况'
        }, {
          id: 6,
          label: '银行信贷履约情况'
        }]
      }, {
        id: 3,
        label: '公益信用 5%',
        children: [{
          id: 7,
          label: '慈善捐款情况'
        }, {
          id: 8,
          label: '解决残疾人、退伍军人等就业情况'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>

