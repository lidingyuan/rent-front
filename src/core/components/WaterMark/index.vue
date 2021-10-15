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
    text: {
      type: String,
      default: '州力'
    },
    fontSize: {
      type: Number,
      default: 32
    },
    color: {
      type: String,
      default: '#cec'
    },
    deg: {
      type: Number,
      default: -45
    },
    // 密度
    minLength: {
      type: Number,
      default: 1
    },
    opacity: {
      type: Number,
      default: 0.15
    }
  },
  data () {
    return {
      observer: null,
      style: ''
    }
  },
  computed: {
    background () {
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(this.text.length, this.minLength) * this.fontSize + this.fontSize
      canvas.height = Math.max(this.text.length, this.minLength) * this.fontSize * Math.abs(Math.sin(this.deg * Math.PI / 180)) + this.fontSize
      const ctx = canvas.getContext('2d')
      const sin = Math.sin(this.deg * Math.PI / 180)
      const cos = Math.cos(this.deg * Math.PI / 180)
      ctx.translate(cos < 0 ? canvas.width - (this.fontSize / 4) : this.fontSize / 2, sin < 0 ? canvas.height - (this.fontSize / 4) : this.fontSize / 2)
      ctx.rotate(this.deg * Math.PI / 180)
      ctx.fillStyle = this.color
      const fontargs = ctx.font.split(' ')
      ctx.font = this.fontSize + 'px ' + fontargs[fontargs.length - 1]
      ctx.fillText(this.text, 0, 0)
      return canvas.toDataURL()
    }
  },
  watch: {
    background: {
      handler (url) {
        this.style = `width: 100%; height: 100%; top: 0px; left: 0px; position: absolute; z-index: 99999; pointer-events: none; opacity: ${this.opacity}; background: url("${url}");`
      },
      immediate: true
    }
  },
  mounted () {
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
