<template>
  <!-- 标签约束器表单 -->
  <el-row>
    <el-col :span="24" style="">
      选择标签：
    </el-col>
    <el-col :span="24">
      <el-form-item >
        <el-popover placement="top-end" ref="tagSelectPopover" width="750">
          <el-input slot="reference" readonly :value="tagList.tagNames | arrayToCommaDelimitedStringFilter" placeholder="选择标签"></el-input>
          <tag-select @change="handleChange" v-model="tagList" ></tag-select>
        </el-popover>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
import TagSelect from '../../components/TagSelect'

export default {
  name: 'TagDecider',
  components: { TagSelect },
  props: {
    param: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      tagList: {
        tagIds: [],
        tagNames: []
      }
    }
  },
  created () {
    if (this.param) {
      this.tagList.tagIds = this.param.concat()
    }
  },
  methods: {
    handleChange (value) {
      this.tagList.tagIds = value.tagIds
      this.tagList.tagNames = value.tagNames
      this.$emit('update:param', this.tagList.tagIds)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
