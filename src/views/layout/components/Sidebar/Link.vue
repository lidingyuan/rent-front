
<template>
  <!-- eslint-disable vue/require-component-is -->
  <component :is="isExternalLink(to) ? 'a' : 'router-link'" v-bind="linkProps(to)">
    <slot/>
  </component>
</template>

<script>
import { isExternal } from '@/utils/strings.js'

export default {
  name: 'MenuLink',
  props: {
    to: {
      type: String,
      required: true
    }
  },
  methods: {
    isExternalLink (routePath) {
      return isExternal(routePath)
    },
    linkProps (url) {
      if (this.isExternalLink(url)) {
        return {
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: url
      }
    }
  }
}
</script>
