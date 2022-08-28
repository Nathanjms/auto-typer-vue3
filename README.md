# Auto Typer - Vue3

A simple auto-typer, written in Vue3.

<p align="center">
  <img src="https://img.shields.io/npm/v/auto-typer-vue3" />
  <img src="https://img.shields.io/npm/dt/auto-typer-vue3" />
</p>

## Screenshot(s)
![Screen Recording 2022-08-28 at 10 40 25](https://user-images.githubusercontent.com/64075030/187067804-a4d0a055-58a9-4d71-b0bd-d100591ba83a.gif)

## Installation

Install Auto Typer Vue3 with npm

```bash
npm install auto-typer-vue3
```

## Props

| Prop                    | Type     | Default        | Description                                                                                                                      | Validation                                                                              |
| :---------------------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| `componentTag`          | `string` | 'span'         | The HTML tag that the element will be.                                                                                           | Currently accepts any of the following: `span`, `p`, `a`, `h*` (where * is any number). |
| `beginningWord`         | `string` | `''`           | A string prepended to every text item. _If you would like to have a space at the end, I recommend using the `&nbsp;` character_. | N/A.                                                                                     |
| `text`                  | `string  | array<string>` | `''`                                                                                                                             | Either a string to be auto-typed, or an array of strings to be auto-typed.              |  |
| `startDelay`            | `number` | `500`          | Time (ms) before the auto-typer begins.                                                                                          | Number >= 0.                                                                            |
| `betweenWordDelay`      | `number` | `500`          | Time (ms) before the next `text` string is typed.                                                                                | Number >= 0.                                                                            |
| `typingDelay`           | `number` | `300`          | Time (ms) between each character is typed.                                                                                       | Number >= 0.                                                                            |
| `deletingDelay`         | `number` | `100`          | Time (ms) between each character is deleted after the text has been typed.                                                       | Number >= 0.                                                                            |
| `waitBeforeDeleteDelay` | `number` | `500`          | Time (ms) after the text has been typed before deleting it begins.                                                               | Number >= 0.                                                                            |
| `startByDefault`        | `bool`   | `true`         | Whether to start the auto-typer by default. If set to false, the `begin()` method must be called manually.                       | Number >= 0.                                                                            |
| `repeat`                | `bool`   | `true`         | Whether to repeat the text once all of them have been typed.                                                                     | N/A.                                                                                     |  |

## Usage/Example

```javascript
<script setup lang="ts">
import { AutoTyperVue } from "auto-typer-vue";
</script>
```

```vue
<template>
  <AutoTyperVue componentTag="h1" :text="['This is a demo.', 'And this is another Demo!']" />
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
```

## Development

There is a folder `playground` inside this repository which can be used as a basis for development. Clone the repo and run:

1. `npm install`
2. `npm run dev`

To launch this folder with Vite.

The `App.vue` file can be modified to see changes in the browser, and navigating to `/src/components/auto-typer-vue/AutoTyperVue.vue` will update the changes on the browser for the Auto Typer.

## Future Plans

- Add custom styling options the the cursor.
- Add a variable to allow a certain number of repeats, instead of just a boolean.
- Handle whether to leave the final word on the screen once repeating has stopped.
- ...any other suggestions will be considered, please leave an issue if you have any feature requests!
