<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
.current-row > td {
  background: rgba(0, 158, 250, 0.219) !important;
}
.txt-red {
  color: red;
}
.txt-center {
  text-align: center;
}
.txt-right {
  text-align: right;
}
</style>
