<script setup lang="ts">
import { AutoTyperVue } from "auto-typer-vue";

let text = ["This is a demo.", "And this is another Demo!"];
</script>

<template>
  <div class="grid place-items-center justify-center min-h-screen bg-slate-700">
    <AutoTyperVue
      writtenBeginningWord="Hello!&nbsp;"
      componentTag="h1"
      id="main-auto-typer"
      :text="text"
      :startDelay="1500"
      :typingDelay="150"
      class="text-2xl text-gray-200"
    />
  </div>
</template>

<style scoped>
  #main-auto-typer::after {
    border-color: rgba(0, 0, 0, 0.8);
  }
</style>
