<script setup lang="ts">
import { AutoTyperVue } from "auto-typer-vue";
</script>

<template>
  <AutoTyperVue
    beginningWord="Hello!&nbsp;"
    componentTag="h1"
    :text="['This is a demo.', 'And this is another Demo!']"
    :startDelay="1500"
  />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
