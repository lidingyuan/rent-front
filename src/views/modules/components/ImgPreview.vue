<template>
  <!-- 素材数组预览 -->
  <div>
    <div v-if="imgArr">
      <img v-for="(img, index) in imgArr.slice(0, 1)" :src="img.url" class="img-small"
        :key="'materials' + index" alt="图片" title="点击查看完整图片" @click="showImg = true">
    </div>

     <el-dialog title="大图预览" :visible.sync="showImg" :close-on-click-modal="false" width="500px">
      <div class="img-priview" style="position:relative;">
        <div v-for="(img, index) in imgArr" :key="'imgview' + index">
          <img  :src="img.url" class="img-big" alt="#">
          <div class="img-info">
            图片类型：{{img.type}}<br>
            备注信息：{{img.remarks}}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'ImgPriview',
  props: {
    imgArr: {
      type: Array,
      default: () => { return [] }
    }
  },
  data () {
    return {
      // 图片预览弹窗
      showImg: false
    }
  }
}
</script>
<style lang="scss" scoped>
.img-small {
  width: 50px;
  height: 30px;
}
.img-priview {
  height: 60vh;
  overflow: auto;
  text-align: center;
}
.img-big {
  max-width: 400px;
  height: auto;
}
.img-info {
  position: absolute;
  top: 10px;
  background-color: rgba($color: #9999, $alpha: 0.7);
  color: #ffffff;
  text-align: left;
}
</style>

<style lang='scss' scoped>

</style>
