<template>
  <div
    v-if="show"
    class="print-page"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'PrintPage',
  props: {
    value: Boolean
  },
  data () {
    return {
      show: false
    }
  },
  created () {

  },
  methods: {
    print () {
      this.show = true
      this.$nextTick(() => {
        const body = [...document.body.childNodes]
        document.body.innerHTML = ''
        document.body.appendChild(this.$el)
        window.print()
        document.body.innerHTML = ''
        body.forEach(child => {
          document.body.appendChild(child)
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.print-page{
  width: 100vw;
}
</style>
