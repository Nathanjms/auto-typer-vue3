<script setup lang="ts">
import { AutoTyperVue } from "auto-typer-vue";

let text = [
  'This is a demo.',
  'And this is another Demo!'
];
</script>

<template>
  <AutoTyperVue
    beginningWord="Hello!&nbsp;"
    componentTag="h1"
    :text="text"
    :startDelay="1500"
    :typingDelay="150"
  />
</template>