<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  sockets: {
    connect() {
      console.log('socket connected')
    },
    socketres(res) {
      this.$store.commit(`${res.commit}`, res.data)
    },
    qr_detection_res(res) {
      this.$emitter.emit('qrcode_detected', {})
    },
  }
}
</script>

<style></style>
