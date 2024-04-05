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
    claim_flagged_res(res) {
      this.$emitter.emit('claim_flagged', {})
      this.$store.commit(`${res.commit}`, res.data)
    },
    claim_verified_res(res) {
      this.$emitter.emit('claim_verified', {})
      this.$store.commit(`${res.commit}`, res.data)
    },
  }
}
</script>

<style></style>
