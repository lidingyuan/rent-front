<template>
  <div
    v-transition:active.show="active"
    class="follow-menu"
    :style="{left:position[0]+'px',top:position[1]+'px',transition:'0.1s'}"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'FollowMenu',
  props: {
    active: Boolean,
    position: Array
  },
  data () {
    return {

    }
  },
  created () {
    window.addEventListener('click', this.clear, false)
  },
  beforeDestroy () {
    window.removeEventListener('click', this.clear)
  },
  methods: {
    clear () {
      this.$emit('update:active', false)
    }
  }
}
</script>

<style lang='scss' scoped>
.follow-menu{
  width: 200px;
  height: 400px;
  position: fixed;
  background: #F0F6FF;
  z-index: 10;
  overflow: hidden;
  transform: scale(0);
  transform-origin: top left;
  &.active{
  transform: scale(1);
  }
}
</style>
