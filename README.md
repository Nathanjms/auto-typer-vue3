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

Then import the module and css file into your Vue component (see usage/example below).

## Props

| Prop                    | Type                     | Default | Description                                                                                                                                                               | Validation                                                                              |
| :---------------------- | :----------------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------- |
| `componentTag`          | `string`                 | 'span'  | The HTML tag that the element will be.                                                                                                                                    | Currently accepts any of the following: `span`, `p`, `a`, `h*` (where * is any number). |
| `beginningWord`         | `string`                 | `''`    | A string prepended to every text item. _If you would like to have a space at the end, I recommend using the `&nbsp;` character_.                                          | N/A.                                                                                    |
| `writtenBeginningWord`  | `string`                 | `''`    | A word that will be typed when the auto-typer begins, and then will stay there. _If you would like to have a space at the end, I recommend using the `&nbsp;` character_. | N/A.                                                                                    |
| `text`                  | `string \|array<string>` | `''`    | Either a string to be auto-typed, or an array of strings to be auto-typed.                                                                                                |                                                                                         |
| `startDelay`            | `number`                 | `500`   | Time (ms) before the auto-typer begins.                                                                                                                                   | Number >= 0.                                                                            |
| `betweenWordDelay`      | `number`                 | `500`   | Time (ms) before the next `text` string is typed.                                                                                                                         | Number >= 0.                                                                            |
| `typingDelay`           | `number`                 | `300`   | Time (ms) between each character is typed.                                                                                                                                | Number >= 0.                                                                            |
| `deletingDelay`         | `number`                 | `100`   | Time (ms) between each character is deleted after the text has been typed.                                                                                                | Number >= 0.                                                                            |
| `waitBeforeDeleteDelay` | `number`                 | `500`   | Time (ms) after the text has been typed before deleting it begins.                                                                                                        | Number >= 0.                                                                            |
| `startByDefault`        | `bool`                   | `true`  | Whether to start the auto-typer by default. If set to false, the `begin()` method must be called manually.                                                                | Number >= 0.                                                                            |
| `repeat`                | `bool`                   | `true`  | Whether to repeat the text once all of them have been typed.                                                                                                              | N/A.                                                                                    |  |
## Usage/Example

### Basic Example

```vue
<script setup>
import { AutoTyperVue } from "auto-typer-vue";

let text = [
  'This is a demo.',
  'And this is another Demo!'
];
</script>

<template>
  <AutoTyperVue 
    componentTag="h1" 
    :text="text"
  />
</template>

<style scoped>
@import "auto-typer-vue3/dist/style.css";
</style>
```

### Changing the cursor styling

The cursor styling by default is the following:
```scss
.auto-typer-vue::after {
  content: "";
  position: inline-block;
  border: 1px solid rgba(255, 255, 255, 0.8);
  margin-left: 1px;
  animation: cursor-blink 1.5s steps(2) infinite;
}

@keyframes cursor-blink {
  0% {
    opacity: 0;
  }
}
```

This can be completely overridden, or certain parts can be altered by adding additional styles below the import of `style.css`, targetting the element `.auto-typer-vue::after`.

#### Example: Changing the cursor colour

```vue
<style scoped>
@import "auto-typer-vue3/dist/style.css";
.auto-typer-vue::after {
  border-color: rgba(0, 0, 0, 0.8);
}
</style>
```

You could also give an ID attribute to auto typer component, and then target the attribute. This helps if there is more than one on the page, and you want each to have different styling:

```vue
<script setup>
import { AutoTyperVue } from "auto-typer-vue";

let text = [
  'This is a demo.',
  'And this is another Demo!'
];
</script>

<template>
  <AutoTyperVue 
    componentTag="h1"
    id="main-auto-typer"
    :text="text"
  />
</template>

<style scoped>
@import "auto-typer-vue3/dist/style.css";
#main-auto-typer::after {
  border-color: rgba(0, 0, 0, 0.8);
}
</style>
```

## Development

There is a folder `playground` inside this repository which can be used as a basis for development. Clone the repo and run:

1. `npm run dev:install`
2. `npm run dev:run`

To launch this folder with Vite.

The `App.vue` file can be modified to see changes in the browser, and navigating to `/src/components/auto-typer-vue/AutoTyperVue.vue` will update the changes on the browser for the Auto Typer.

To test the packaged build, run:

0. `npm install`
1. `npm build:vite`
2. `npm run dev:run-pack`

This will run a dev server with the packaged version of `auto-typer-vue3`, instead of the normal one.

## Future Plans

- ~Add custom styling options the the cursor.~
    - Can be done with the style area already (I think... let me know if this needs further testing.) 
- Add a variable to allow a certain number of repeats, instead of just a boolean.
- Handle whether to leave the final word on the screen once repeating has stopped.
- ...any other suggestions will be considered, please leave an issue if you have any feature requests!
