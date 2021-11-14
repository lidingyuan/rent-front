<template>
  <div class="print-container">
    <div
      ref="slot"
      class="print-page"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrintPage',
  props: {
    value: Boolean
  },
  methods: {
    print () {
      this.$nextTick(() => {
        const body = [...document.body.childNodes]
        document.body.innerHTML = ''
        document.body.appendChild(this.$refs.slot)
        window.print()
        document.body.innerHTML = ''
        this.$el.appendChild(this.$refs.slot)
        body.forEach(child => {
          document.body.appendChild(child)
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.print-container{
  width: 100%;
}
.print-page{
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px;
}
</style>
