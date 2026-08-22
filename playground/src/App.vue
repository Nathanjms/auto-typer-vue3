<script setup lang="ts">
import { ref } from "vue";
import { AutoTyperVue } from "auto-typer-vue";

let text = ["This is a demo.", "And this is another Demo!"];
const autoTyper = ref();
</script>

<template>
  <div class="grid place-items-center justify-center min-h-screen bg-slate-700">
    <AutoTyperVue
      ref="autoTyper"
      :writtenBeginningWord="'Hello! '"
      componentTag="h1"
      id="main-auto-typer"
      :text="text"
      :startDelay="1500"
      class="text-2xl text-gray-200"
    />
    <div class="flex gap-2 text-gray-200">
      <button type="button" class="rounded border px-2 py-1" @click="autoTyper?.pause()">Pause</button>
      <button type="button" class="rounded border px-2 py-1" @click="autoTyper?.resume()">Resume</button>
      <button type="button" class="rounded border px-2 py-1" @click="autoTyper?.stop()">Stop</button>
    </div>

    <AutoTyperVue
      componentTag="h1"
      text="This will remain on the screen after being typed!"
      :repeat="false"
      class="text-2xl text-gray-200"
    />
  </div>
</template>
