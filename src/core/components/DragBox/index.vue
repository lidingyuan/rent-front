<template>
  <div class="drag-box">
    <DragItem
      v-for="(item,index) in list"
      :key="key?item[key]:index"
    >
      <slot />
    </DragItem>
  </div>
</template>

<script>
import DragItem from './DragItem.vue'
export default {
  name: 'DragBox',
  components: { DragItem },
  props: {
    list: [Array, Object, Number],
    key: String
  },
  data () {
    return {

    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>

</style>
