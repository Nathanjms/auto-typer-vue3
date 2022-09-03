<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "AutoTyperVue",
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
    text: {
      type: [String, Array],
      required: true,
      validator(value) {
        if (typeof value === "string") {
          return value.length > 0;
        }
        return value.every(
          (item) => typeof item === "string" && item.length > 0
        );
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
      default: 300,
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
  },
  data() {
    return {
      currentText: "",
      offset: this.beginningWord.length,
      textFeed: [],
    };
  },
  mounted() {
    if (this.startByDefault) {
      this.begin();
    }
  },
  methods: {
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async begin() {
      if (typeof this.text === "string") {
        this.textFeed = [this.text];
      } else {
        this.textFeed = [...this.text];
      }
      await this.delay(this.startDelay);
      this.autoType();
    },
    async autoType() {
      for (let currentWord of [...this.textFeed]) {
        await this.writeWord(currentWord);
        await this.delay(this.waitBeforeDeleteDelay);
        await this.removeWord(currentWord);
        await this.delay(this.betweenWordDelay);
      }
      if (this.repeat) {
        this.autoType();
      }
    },
    async writeWord(currentWord) {
      for (let char of [...currentWord]) {
        this.currentText += char;
        await this.delay(this.typingDelay);
      }
    },
    async removeWord(currentWord) {
      for (let i = 0; i < currentWord.length; i++) {
        this.currentText = this.currentText.slice(0, -1);
        await this.delay(this.deletingDelay);
      }
    },
  },
});
</script>

<template>
  <component class="auto-typer-vue" :is="componentTag"
    >{{ beginningWord }}{{ currentText }}
  </component>
</template>