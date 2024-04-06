<template>
  <router-link :to="{ name: 'home' }">
    <img
      src="@/assets/images/logo/MIFP.png"
      alt=""
      v-if="!this.$store.state.isDark"
    />

    <img
      src="@/assets/images/logo/MIFP-white.png"
      alt=""
      v-if="this.$store.state.isDark"
    />
  </router-link>
</template>
<script></script>
