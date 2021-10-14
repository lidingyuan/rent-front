<template>
  <!-- 活动二维码 -->
  <div class="qrcode">
    <img id="actQrcode" class="qrcode-img" :style="{height: `${height}px`, width: `${width}px`}" alt="活动链接加载失败">
  </div>
</template>

<script>
import QRCdoe from 'qrcode'
const ACT_URL_NORMAL = '/service/activity/act/access/redirect?actId='
export default {
  name: 'ActQrocde',
  props: {
    actId: {
      type: String
    },
    location: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 165
    },
    width: {
      type: Number,
      default: 165
    }
  },
  mounted () {
    if (!this.actId) return
    setTimeout(() => {
      this.urlToQrcode()
    }, 100)
  },
  methods: {
    urlToQrcode () {
      // 服务器名称
      let domainName = window.location.protocol + '//' + window.location.hostname
      let url = domainName + ACT_URL_NORMAL + this.id
      // 拼接获取地理位置信息字段
      if (this.location) {
        url += '&location=1'
      }
      const opts = {
        errorCorrectionLevel: 'H',
        margin: 1,
        type: 'image/jpeg'
      }
      QRCdoe.toDataURL(url, opts, (err, url) => {
        if (err) throw err
        let img = document.getElementById('actQrcode')
        img.src = url
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
