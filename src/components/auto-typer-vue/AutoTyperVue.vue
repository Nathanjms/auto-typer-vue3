<script>
import { defineComponent } from "vue";

/**
 * Delay by the given amount of milliseconds
 * @param {number} ms
 * @returns {Promise<void>}
 */
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default defineComponent({
  name: "AutoTyperVue",
  emits: ["finished"],
  props: {
    componentTag: {
      type: String,
      default: "span",
      validator(value) {
        let regex = /^(span)|(h\d)|(p)|(a)$/;
        return regex.test(value);
      },
    },
    beginningWord: {
      type: String,
      default: "",
    },
    writtenBeginningWord: {
      type: String,
      default: "",
    },
    text: {
      type: [String, Array],
      required: true,
      validator(value) {
        if (typeof value === "string") {
          return value.length > 0;
        }
        return value.every((item) => typeof item === "string" && item.length > 0);
      },
    },
    startDelay: {
      type: Number,
      default: 500,
      validator(value) {
        return value >= 0;
      },
    },
    betweenWordDelay: {
      type: Number,
      default: 500,
      validator(value) {
        return value >= 0;
      },
    },
    typingDelay: {
      type: Number,
      default: 150,
      validator(value) {
        return value >= 0;
      },
    },
    deletingDelay: {
      type: Number,
      default: 100,
      validator(value) {
        return value >= 0;
      },
    },
    waitBeforeDeleteDelay: {
      type: Number,
      default: 500,
      validator(value) {
        return value >= 0;
      },
    },
    startByDefault: {
      type: Boolean,
      default: true,
    },
    repeat: {
      type: Boolean,
      default: true,
    },
    removeAfterRepeat: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentText: "",
      typedBeginningWord: "",
      textFeed: [],
    };
  },
  mounted() {
    if (this.startByDefault) {
      this.begin();
    }
  },
  methods: {
    /**
     * Start the auto typing
     */
    async begin() {
      if (typeof this.text === "string") {
        this.textFeed = [this.text];
      } else {
        this.textFeed = [...this.text];
      }
      await delay(this.startDelay);
      await this.writeBeginningWord();
      this.autoType();
    },
    /**
     * Write the beginning word, if one is provided
     */
    async writeBeginningWord() {
      if (!this.writtenBeginningWord.length) {
        // No word to write, stop here!
        return;
      }
      for (let char of [...this.writtenBeginningWord]) {
        this.typedBeginningWord += char;
        await delay(this.typingDelay);
      }
    },
    /**
     * Auto type the text
     */
    async autoType() {
      for (let currentWord of this.textFeed) {
        await this.writeWord(currentWord);
        await delay(this.waitBeforeDeleteDelay);
        // If we are on the last word, we don't want to delete it if we are not repeating (unless removeAfterRepeat is true)
        if (
          !this.repeat &&
          !this.removeAfterRepeat &&
          this.textFeed.indexOf(currentWord) === this.textFeed.length - 1
        ) {
          break;
        }
        await this.removeWord(currentWord);
        await delay(this.betweenWordDelay);
      }
      if (this.repeat) {
        this.autoType();
      } else {
        this.$emit("finished");
      }
    },
    /**
     * Write a word on the screen
     * @param {string} currentWord
     */
    async writeWord(currentWord) {
      for (let char of [...currentWord]) {
        this.currentText += char;
        await delay(this.typingDelay);
      }
    },
    /**
     * Remove a word from the screen
     * @param {string} currentWord
     */
    async removeWord(currentWord) {
      for (let i = 0; i < currentWord.length; i++) {
        this.currentText = this.currentText.slice(0, -1);
        await delay(this.deletingDelay);
      }
    },
  },
});
</script>

<template>
  <component class="auto-typer-vue blink" :is="componentTag">
    {{ beginningWord }}{{ typedBeginningWord }}{{ currentText }}
  </component>
</template>
