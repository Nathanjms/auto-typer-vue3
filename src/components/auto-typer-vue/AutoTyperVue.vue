<script lang="ts">
import { defineComponent, markRaw } from "vue";
import type { PropType } from "vue";
import type { AutoTyperComponentTag } from "../../types";

/**
 * Delay by the given amount of milliseconds
 * @param {number} ms
 * @returns {Promise<void>}
 */
async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default defineComponent({
  name: "AutoTyperVue",
  inheritAttrs: false,
  emits: ["finished", "paused", "resumed", "stopped"],
  props: {
    componentTag: {
      type: String as PropType<AutoTyperComponentTag>,
      default: "span",
      validator(value: string) {
        return /^(span|h[1-6]|p|a)$/.test(value);
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
      type: [String, Array] as PropType<string | string[]>,
      required: true,
      validator(value: string | string[]) {
        if (typeof value === "string") {
          return value.length > 0;
        }
        return value.length > 0 && value.every((item) => typeof item === "string" && item.length > 0);
      },
    },
    startDelay: {
      type: Number,
      default: 500,
      validator(value: number) {
        return value >= 0;
      },
    },
    betweenWordDelay: {
      type: Number,
      default: 500,
      validator(value: number) {
        return value >= 0;
      },
    },
    typingDelay: {
      type: Number,
      default: 150,
      validator(value: number) {
        return value >= 0;
      },
    },
    deletingDelay: {
      type: Number,
      default: 100,
      validator(value: number) {
        return value >= 0;
      },
    },
    waitBeforeDeleteDelay: {
      type: Number,
      default: 500,
      validator(value: number) {
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
    pauseOnInteraction: {
      type: Boolean,
      default: true,
    },
    respectReducedMotion: {
      type: Boolean,
      default: true,
    },
    ariaLabel: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      currentText: "",
      typedBeginningWord: "",
      textFeed: [] as string[],
      isPaused: false,
      isRunning: false,
      prefersReducedMotion: false,
      reducedMotionQuery: null as MediaQueryList | null,
      isHovered: false,
      isFocused: false,
      pausedByInteraction: false,
      runId: 0,
    };
  },
  computed: {
    renderedTag() {
      return /^(span|h[1-6]|p|a)$/.test(this.componentTag) ? this.componentTag : "span";
    },
    interactionTabindex() {
      if (Object.prototype.hasOwnProperty.call(this.$attrs, "tabindex")) {
        return this.$attrs.tabindex;
      }
      return this.pauseOnInteraction && this.isRunning ? 0 : undefined;
    },
    accessibleText() {
      if (this.ariaLabel) {
        return this.ariaLabel;
      }

      const text = typeof this.text === "string" ? this.text : this.text.join(" ");
      return `${this.beginningWord}${this.writtenBeginningWord}${text}`;
    },
  },
  watch: {
    pauseOnInteraction(enabled: boolean) {
      if (enabled && this.isRunning && !this.isPaused && (this.isHovered || this.isFocused)) {
        this.pausedByInteraction = true;
        this.isPaused = true;
        this.$emit("paused");
        return;
      }

      if (!enabled && this.pausedByInteraction) {
        this.pausedByInteraction = false;
        this.isPaused = false;
        this.$emit("resumed");
      }
    },
    respectReducedMotion(enabled: boolean) {
      if (enabled) {
        this.setupReducedMotion();
        return;
      }

      this.teardownReducedMotion();
      this.prefersReducedMotion = false;
    },
  },
  mounted() {
    this.setupReducedMotion();

    if (this.startByDefault) {
      this.begin();
    }
  },
  beforeUnmount() {
    this.runId += 1;
    this.isRunning = false;
    this.teardownReducedMotion();
  },
  methods: {
    /**
     * Start the auto typing
     */
    async begin() {
      const runId = ++this.runId;

      this.currentText = "";
      this.typedBeginningWord = "";
      this.isPaused = false;
      this.pausedByInteraction = false;
      if (typeof this.text === "string") {
        this.textFeed = [this.text];
      } else {
        this.textFeed = [...this.text];
      }

      if (this.prefersReducedMotion) {
        this.showStaticText();
        this.isRunning = false;
        if (!this.repeat) {
          this.$emit("finished");
        }
        return;
      }

      this.isRunning = true;
      if (this.pauseOnInteraction && (this.isHovered || this.isFocused)) {
        this.pausedByInteraction = true;
        this.isPaused = true;
        this.$emit("paused");
      }
      if (!(await this.wait(this.startDelay, runId))) return;
      if (!(await this.writeBeginningWord(runId))) return;
      await this.autoType(runId);
    },
    pause() {
      if (!this.isRunning) return;
      if (this.isPaused) {
        this.pausedByInteraction = false;
        return;
      }
      this.pausedByInteraction = false;
      this.isPaused = true;
      this.$emit("paused");
    },
    resume() {
      if (!this.isRunning || !this.isPaused) return;
      this.pausedByInteraction = false;
      this.isPaused = false;
      this.$emit("resumed");
    },
    stop() {
      if (!this.isRunning) return;
      this.runId += 1;
      this.isPaused = false;
      this.pausedByInteraction = false;
      this.isRunning = false;
      this.$emit("stopped");
    },
    setupReducedMotion() {
      if (!this.respectReducedMotion || this.reducedMotionQuery || typeof window.matchMedia !== "function") return;

      this.reducedMotionQuery = markRaw(window.matchMedia("(prefers-reduced-motion: reduce)"));
      this.reducedMotionQuery.addEventListener("change", this.handleReducedMotionChange);
      if (this.reducedMotionQuery.matches) {
        this.handleReducedMotionChange(this.reducedMotionQuery);
      }
    },
    teardownReducedMotion() {
      this.reducedMotionQuery?.removeEventListener("change", this.handleReducedMotionChange);
      this.reducedMotionQuery = null;
    },
    showStaticText() {
      this.typedBeginningWord = this.writtenBeginningWord;
      this.currentText = this.textFeed[0] ?? "";
    },
    handleReducedMotionChange(event: MediaQueryListEvent | MediaQueryList) {
      this.prefersReducedMotion = event.matches;

      if (event.matches && this.isRunning) {
        this.runId += 1;
        this.isPaused = false;
        this.pausedByInteraction = false;
        this.isRunning = false;
        this.showStaticText();
        this.$emit("stopped");
      }
    },
    pauseForInteraction(type: "isHovered" | "isFocused") {
      this[type] = true;
      if (!this.pauseOnInteraction) return;
      if (!this.isRunning || this.isPaused) return;

      this.pausedByInteraction = true;
      this.isPaused = true;
      this.$emit("paused");
    },
    resumeAfterInteraction(type: "isHovered" | "isFocused") {
      this[type] = false;
      if (this.isHovered || this.isFocused || !this.pausedByInteraction) return;

      this.pausedByInteraction = false;
      this.isPaused = false;
      this.$emit("resumed");
    },
    async wait(ms: number, runId: number) {
      let remaining = ms;

      while (remaining > 0 || this.isPaused) {
        if (runId !== this.runId) return false;

        if (this.isPaused) {
          await delay(50);
          continue;
        }

        const interval = Math.min(remaining, 50);
        await delay(interval);

        if (!this.isPaused) {
          remaining -= interval;
        }
      }

      return runId === this.runId;
    },
    /**
     * Write the beginning word, if one is provided
     */
    async writeBeginningWord(runId: number) {
      if (!this.writtenBeginningWord.length) {
        return true;
      }
      for (let char of [...this.writtenBeginningWord]) {
        if (!(await this.wait(0, runId))) return false;
        if (runId !== this.runId) return false;
        this.typedBeginningWord += char;
        if (!(await this.wait(this.typingDelay, runId))) return false;
      }
      return true;
    },
    /**
     * Auto type the text
     */
    async autoType(runId: number) {
      do {
        for (const [index, currentWord] of this.textFeed.entries()) {
          if (!(await this.writeWord(currentWord, runId))) return;
          if (!(await this.wait(this.waitBeforeDeleteDelay, runId))) return;

          const isFinalWord = index === this.textFeed.length - 1;
          if (!this.repeat && !this.removeAfterRepeat && isFinalWord) {
            break;
          }

          if (!(await this.removeWord(currentWord, runId))) return;
          if (!(await this.wait(this.betweenWordDelay, runId))) return;
        }
      } while (this.repeat && runId === this.runId);

      if (runId === this.runId) {
        this.isRunning = false;
        this.$emit("finished");
      }
    },
    /**
     * Write a word on the screen
     * @param {string} currentWord
     */
    async writeWord(currentWord: string, runId: number) {
      for (let char of [...currentWord]) {
        if (!(await this.wait(0, runId))) return false;
        if (runId !== this.runId) return false;
        this.currentText += char;
        if (!(await this.wait(this.typingDelay, runId))) return false;
      }
      return true;
    },
    /**
     * Remove a word from the screen
     * @param {string} currentWord
     */
    async removeWord(currentWord: string, runId: number) {
      for (let i = 0; i < currentWord.length; i++) {
        if (!(await this.wait(0, runId))) return false;
        if (runId !== this.runId) return false;
        this.currentText = this.currentText.slice(0, -1);
        if (!(await this.wait(this.deletingDelay, runId))) return false;
      }
      return true;
    },
  },
});
</script>

<template>
  <component
    class="auto-typer-vue"
    :class="{ blink: isRunning && !isPaused && !prefersReducedMotion }"
    :is="renderedTag"
    v-bind="$attrs"
    :aria-description="pauseOnInteraction && isRunning ? 'Animation pauses while this text is focused.' : undefined"
    :tabindex="interactionTabindex"
    @mouseenter="pauseForInteraction('isHovered')"
    @mouseleave="resumeAfterInteraction('isHovered')"
    @focus="pauseForInteraction('isFocused')"
    @blur="resumeAfterInteraction('isFocused')"
  >
    <span aria-hidden="true">
      {{ beginningWord }}{{ typedBeginningWord }}{{ currentText }}
    </span>
    <span class="auto-typer-vue-sr-only">{{ accessibleText }}</span>
  </component>
</template>
