<template>
  <el-upload
    class="img-upload"
    drag
    :limit=1
    list-type="picture-card"
    :auto-upload="false"
    :on-remove="onRemove"
    :on-change="onChange"
    action="https://jsonplaceholder.typicode.com/posts/"
    multiple>
    <i class="el-icon-upload"></i>
  </el-upload>
</template>

<script>
export default {
  name: '',
  props: {
    name: {
      type: String,
      defalut: ''
    }
  },
  data () {
    return {
      //
    }
  },
  created () {
    //
  },
  methods: {
    //
    onChange (file) {
      this.$emit('onChange', file, this.name)
    },
    onRemove (file) {
      this.$emit('onRemove', file, this.name)
    }
  }
}
</script>

<style lang='scss' scoped>
.img-upload{
  ::v-deep .el-upload-dragger{
    width: 100%;
    height: 100%;
  }
}
</style>
