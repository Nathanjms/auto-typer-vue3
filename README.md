# Auto Typer - Vue3

A simple auto-typer, written in Vue3.

<p align="center">
  <a href="https://www.npmjs.com/package/auto-typer-vue3"><img src="https://img.shields.io/npm/v/auto-typer-vue3" alt="Version Number" /></a>
  <a href="https://www.npmjs.com/package/auto-typer-vue3"><img src="https://img.shields.io/npm/dt/auto-typer-vue3" alt="Total Downloads" /></a>
</p>

## Screenshot(s)
<p align="center">
  <img src="https://raw.githubusercontent.com/Nathanjms/auto-typer-vue3/main/new-demo.gif" src="Demo of the Auto-Typer" />
</p>

## Contents

- [Auto Typer - Vue3](#auto-typer---vue3)
  - [Screenshot(s)](#screenshots)
  - [Contents](#contents)
  - [Installation](#installation)
  - [Usage/Example](#usageexample)
    - [Basic Example](#basic-example)
    - [Type out word, then stop](#type-out-word-then-stop)
  - [Props](#props)
  - [Emits](#emits)
  - [Methods](#methods)
  - [Accessibility](#accessibility)
  - [Styling Customisation: changing the cursor styling](#styling-customisation-changing-the-cursor-styling)
    - [Example: Changing the cursor colour/opacity](#example-changing-the-cursor-colouropacity)
  - [Contributing](#contributing)
  - [Publishing](#publishing)
  - [Future Plans](#future-plans)

## Installation

Install Auto Typer Vue3 with npm

```bash
npm install auto-typer-vue3
```

Then import the module and css file into your Vue component (see usage/example below).

## Usage/Example

### Basic Example

```vue
<script setup>
import { AutoTyperVue } from "auto-typer-vue3";

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

### Type out word, then stop

```vue
<script setup>
import { AutoTyperVue } from "auto-typer-vue3";
</script>

<template>
  <AutoTyperVue
    componentTag="h1"
    text="This will remain on the screen after being typed!"
    :repeat="false"
  />
</template>

<style scoped>
@import "auto-typer-vue3/dist/style.css";
</style>
```

## Props

| Prop                    | Type                     | Default | Description                                                                                                | Validation                                                                              |
| :---------------------- | :----------------------- | :------ | :--------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| `componentTag`          | `string`                 | 'span'  | The HTML tag that the element will be.                                                                     | Accepts `span`, `p`, `a`, or `h1` through `h6`.                                         |
| `beginningWord`         | `string`                 | `''`    | A string prepended to every text item.                                                                     | N/A.                                                                                    |
| `writtenBeginningWord`  | `string`                 | `''`    | A word that will be typed when the auto-typer begins, and then will stay there.                            | N/A.                                                                                    |
| `text`                  | `string \|array<string>` | Required | Either a string to be auto-typed, or an array of strings to be auto-typed.                                | Must contain at least one non-empty string.                                              |
| `startDelay`            | `number`                 | `500`   | Time (ms) before the auto-typer begins.                                                                    | Number >= 0.                                                                            |
| `betweenWordDelay`      | `number`                 | `500`   | Time (ms) before the next `text` string is typed.                                                          | Number >= 0.                                                                            |
| `typingDelay`           | `number`                 | `150`   | Time (ms) between each character is typed (lower means faster typing).                                     | Number >= 0.                                                                            |
| `deletingDelay`         | `number`                 | `100`   | Time (ms) between each character is deleted after the text has been typed.                                 | Number >= 0.                                                                            |
| `waitBeforeDeleteDelay` | `number`                 | `500`   | Time (ms) after the text has been typed before deleting it begins.                                         | Number >= 0.                                                                            |
| `startByDefault`        | `bool`                   | `true`  | Whether to start the auto-typer by default. If set to false, the `begin()` method must be called manually. | N/A.                                                                                    |
| `repeat`                | `bool`                   | `true`  | Whether to repeat the text once all of them have been typed.                                               | N/A.                                                                                    |
| `removeAfterRepeat`     | `bool`                   | `false` | If repeat is false, whether to remove the final word.                                                      | N/A.                                                                                    |
| `pauseOnInteraction`    | `bool`                   | `true`  | Pause while the animated text is hovered or receives keyboard focus.                                      | N/A.                                                                                    |
| `respectReducedMotion`  | `bool`                   | `true`  | Show the first complete text item without animation when reduced motion is requested.                      | N/A.                                                                                    |
| `ariaLabel`             | `string`                 | `''`    | Complete text exposed to assistive technology. Defaults to all configured text.                            | N/A.                                                                                    |

## Emits

- `finished` - Emitted once the auto-typer has finished typing (only applicable if `repeat` is false).
- `paused` - Emitted when the animation is paused.
- `resumed` - Emitted when a paused animation resumes.
- `stopped` - Emitted when the animation is stopped.

## Methods

- `begin()` - Start or restart the animation.
- `pause()` - Pause the active animation.
- `resume()` - Resume a paused animation.
- `stop()` - Stop the active animation, retaining the currently displayed text.

## Accessibility

The animated characters are hidden from assistive technology. Screen readers receive visually hidden complete text instead, so they do not hear every character change. Use `ariaLabel` when the default combination of all configured text is not the clearest description.

The animation pauses while its text is hovered or receives keyboard focus. The focused text has a visible outline and an accessible description explaining this behaviour. When the user requests reduced motion, animation and cursor blinking are disabled and the first text item is shown in full. Enabling reduced motion while an animation is running stops it; disabling reduced motion does not restart it unexpectedly.

For custom controls:

```vue
<script setup>
import { ref } from "vue";
import { AutoTyperVue } from "auto-typer-vue3";

const autoTyper = ref();
</script>

<template>
  <AutoTyperVue
    ref="autoTyper"
    text="This text can be controlled."
  />
  <button type="button" @click="autoTyper?.pause()">Pause animation</button>
  <button type="button" @click="autoTyper?.resume()">Resume animation</button>
  <button type="button" @click="autoTyper?.stop()">Stop animation</button>
</template>
```

## Styling Customisation: changing the cursor styling

The cursor styling can be completely overridden, or certain parts can be altered by adding additional styles below the import of `style.css`, targetting the element `.auto-typer-vue::after`.

### Example: Changing the cursor colour/opacity

Note: You may need to use `!important` to override the default styling if you use this approach.

```vue
<style scoped>
@import "auto-typer-vue3/dist/style.css";
.auto-typer-vue::after {
  border-color: rgb(0, 0, 0) !important;
  opacity: 1 !important;
}
</style>
```

You could also give an ID attribute to auto typer component, and then target the attribute. This helps if there is more than one on the page, and you want each to have different styling:

You will not need to use `!important` if you use this approach.

```vue
<script setup>
import { AutoTyperVue } from "auto-typer-vue3";
</script>

<template>
  <AutoTyperVue 
    componentTag="h1"
    id="main-auto-typer"
    :text="['This is a demo.', 'And this is another Demo!']"
  />
</template>

<style scoped>
@import "auto-typer-vue3/dist/style.css";
#main-auto-typer::after {
  border-color: rgb(0, 0, 0);
  opacity: 0.8;
}
</style>
```

## Contributing

There is a folder `playground` inside this repository which can be used as a basis for development. Clone the repo and run:

1. `npm run dev:install`
2. `npm run dev:run`

To launch this folder with Vite.

The `App.vue` file can be modified to see changes in the browser, and navigating to `/src/components/auto-typer-vue/AutoTyperVue.vue` will update the changes on the browser for the Auto Typer.

To test the packaged build, run:

0. `npm install`
1. `npm run build:vite`
2. `npm run dev:run-pack`

This will run a dev server with the packaged version of `auto-typer-vue3`, instead of the normal one.

## Publishing

1. Commit the package changes so the worktree is clean.
2. Run `npm version patch`, `npm version minor`, or `npm version major` as appropriate.
3. Push the commit and tag with `git push --follow-tags`.
4. Create a GitHub release for that tag.

The release workflow runs `npm ci` and `npm publish`; publishing runs the tests and build first. It requires an npm access token in the repository's `NPM_TOKEN` Actions secret.

## Future Plans

- [x] Add custom styling options the the cursor.
- [x] Handle whether to leave the final word on the screen once repeating has stopped.
- [ ] Add a variable to allow a certain number of repeats, instead of just a boolean.
- [ ] ...any other suggestions will be considered, please leave an issue if you have any feature requests!
