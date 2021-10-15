<template>
  <div
    class="water-mark"
    :style="style"
  />
</template>

<script>
import * as VisibilityListener from '@/core/utils/VisibilityListener'
export default {
  name: 'WaterMark',
  props: {
    numberList: {
      type: Array,
      default: () => '2403021147'.split('')
    }
  },
  data () {
    return {
      observer: null,
      style: '',
      background: ''
    }
  },
  watch: {
    background: {
      handler (url) {
        this.style = `width: 100%; height: 100%; top: 0px; left: 0px; position: absolute; z-index: 99999; pointer-events: none; opacity: 0.01; background: url("${url}");`
      },
      immediate: true
    }
  },
  mounted () {
    this.draw()
    VisibilityListener.addVisibilityListener(this.visibilityListener)
    // 创建一个观察器实例并传入回调函数
    this.observer = new MutationObserver(this.visibilityListener)
    const config = {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true
    }
    this.observer.observe(this.$parent.$el, config)
  },
  beforeDestroy () {
    this.observer.disconnect()
    VisibilityListener.removeVisibilityListener(this.visibilityListener)
  },
  methods: {
    draw () {
      const canvas = document.createElement('canvas')
      canvas.width = 100
      canvas.height = 100
      const codes = [0, ...this.numberList, 9]
      codes.forEach((n, i) => {
        this.drawLine(canvas, n, i)
      })
      this.background = canvas.toDataURL()
    },
    drawLine (canvas, n, i) {
      const ctx = canvas.getContext('2d')
      ctx.lineWidth = 1
      ctx.fillStyle = '#000'
      ctx.fillRect(i * 2, n * 2, 1, 1)
    },
    visibilityListener () {
      const markList = [...this.$parent.$el.getElementsByClassName('water-mark')]
      const mark = markList.find(mark => {
        return mark === this.$el
      })
      if (this.style !== mark.getAttribute('style')) {
        const style = this.style
        this.style = ''
        this.$nextTick(() => {
          this.style = style
        })
      }
      if (!mark) {
        const emptymark = document.createElement('div')
        emptymark.innerHTML = '文档结构被破坏，重新加载'
        emptymark.style = 'position:fixed;top:0;bottom:0;left:0;right:0;z-index:999999;background:#fff;'
        document.body.appendChild(emptymark)
        location.reload()
      }
    }
  }
}
</script>
