// @vitest-environment jsdom

import { createApp, nextTick } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AutoTyperVue from "../src/components/auto-typer-vue/AutoTyperVue.vue";

function mockReducedMotion(matches = false) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const mediaQuery = {
    matches,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addEventListener: vi.fn((_type, listener) => listeners.add(listener)),
    removeEventListener: vi.fn((_type, listener) => listeners.delete(listener)),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList;

  vi.stubGlobal("matchMedia", vi.fn(() => mediaQuery));
  return {
    mediaQuery,
    setMatches(value: boolean) {
      Object.defineProperty(mediaQuery, "matches", { configurable: true, value });
      const event = { matches: value, media: mediaQuery.media } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };
}

function mountAutoTyper(props: Record<string, unknown>) {
  const emitted = {
    finished: 0,
    paused: 0,
    resumed: 0,
    stopped: 0,
  };
  const container = document.createElement("div");
  document.body.append(container);
  const app = createApp(AutoTyperVue, {
    ...props,
    onFinished: () => emitted.finished++,
    onPaused: () => emitted.paused++,
    onResumed: () => emitted.resumed++,
    onStopped: () => emitted.stopped++,
  });
  const vm = app.mount(container) as any;

  return {
    container,
    emitted,
    vm,
    unmount() {
      app.unmount();
      container.remove();
    },
  };
}

describe("AutoTyperVue accessibility", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockReducedMotion();
  });

  afterEach(async () => {
    await vi.runOnlyPendingTimersAsync();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("exposes complete text without exposing character updates", () => {
    const wrapper = mountAutoTyper({
      beginningWord: "Hello ",
      writtenBeginningWord: "there ",
      text: ["first", "second"],
      startByDefault: false,
    });

    expect(wrapper.container.querySelector('[aria-hidden="true"]')?.textContent?.trim()).toBe("Hello");
    const root = wrapper.container.querySelector(".auto-typer-vue");
    expect(root?.querySelector(".auto-typer-vue-sr-only")?.textContent).toBe("Hello there first second");
    expect(root?.hasAttribute("aria-description")).toBe(false);
    wrapper.unmount();
  });

  it("provides pause, resume, and stop methods without changing the root element", async () => {
    const wrapper = mountAutoTyper({
      text: "Accessible animation",
      startDelay: 1000,
    });
    await nextTick();

    expect(wrapper.container.children).toHaveLength(1);
    wrapper.vm.pause();
    await nextTick();
    expect(wrapper.emitted.paused).toBe(1);

    wrapper.vm.resume();
    await nextTick();
    expect(wrapper.emitted.resumed).toBe(1);

    wrapper.vm.stop();
    await nextTick();
    expect(wrapper.emitted.stopped).toBe(1);
    wrapper.unmount();
  });

  it("pauses while focused and resumes when focus leaves", async () => {
    const wrapper = mountAutoTyper({ text: "Focus can pause this", startDelay: 1000 });
    await nextTick();
    const root = wrapper.container.querySelector<HTMLElement>(".auto-typer-vue")!;

    expect(root.tabIndex).toBe(0);
    expect(root.getAttribute("aria-description")).toBe("Animation pauses while this text is focused.");
    root.dispatchEvent(new FocusEvent("focus"));
    await nextTick();
    expect(wrapper.emitted.paused).toBe(1);
    expect(root.classList).not.toContain("blink");

    root.dispatchEvent(new FocusEvent("blur"));
    await nextTick();
    expect(wrapper.emitted.resumed).toBe(1);
    wrapper.vm.stop();
    await nextTick();
    expect(root.tabIndex).toBe(-1);
    expect(root.hasAttribute("aria-description")).toBe(false);
    wrapper.unmount();
  });

  it("halts character updates while paused", async () => {
    const wrapper = mountAutoTyper({
      text: "abc",
      repeat: false,
      startDelay: 0,
      typingDelay: 100,
      waitBeforeDeleteDelay: 0,
    });

    await nextTick();
    await vi.advanceTimersByTimeAsync(0);
    const visualText = () => wrapper.container.querySelector('[aria-hidden="true"]')?.textContent;
    expect(visualText()).toBe("a");

    wrapper.vm.pause();
    await vi.advanceTimersByTimeAsync(500);
    expect(visualText()).toBe("a");
    expect(wrapper.container.querySelector(".auto-typer-vue")?.classList).not.toContain("blink");

    wrapper.vm.resume();
    await vi.advanceTimersByTimeAsync(350);
    expect(visualText()).toBe("abc");
    expect(wrapper.emitted.finished).toBe(1);
    wrapper.unmount();
  });

  it("can pause before the first character when delays are zero", async () => {
    const wrapper = mountAutoTyper({
      text: "instant",
      repeat: false,
      startByDefault: false,
      startDelay: 0,
      typingDelay: 0,
    });

    const animation = wrapper.vm.begin();
    wrapper.vm.pause();
    await vi.advanceTimersByTimeAsync(200);
    expect(wrapper.container.querySelector('[aria-hidden="true"]')?.textContent).toBe("");

    wrapper.vm.stop();
    await vi.runOnlyPendingTimersAsync();
    await animation;
    wrapper.unmount();
  });

  it("shows static text when reduced motion is requested", async () => {
    const motion = mockReducedMotion(true);
    const wrapper = mountAutoTyper({
      writtenBeginningWord: "Hello ",
      text: ["first", "second"],
      repeat: false,
    });
    await nextTick();

    expect(wrapper.container.querySelector('[aria-hidden="true"]')?.textContent).toBe("Hello first");
    expect(wrapper.container.querySelector(".auto-typer-vue")?.classList).not.toContain("blink");
    expect(wrapper.emitted.finished).toBe(1);

    motion.setMatches(false);
    await vi.runOnlyPendingTimersAsync();
    expect(wrapper.emitted.finished).toBe(1);
    expect(wrapper.vm.isRunning).toBe(false);
    wrapper.unmount();
  });

  it("does not restart stopped content after reduced-motion changes", async () => {
    const motion = mockReducedMotion();
    const wrapper = mountAutoTyper({ text: "Do not restart", startDelay: 0, typingDelay: 100 });
    await nextTick();
    await vi.advanceTimersByTimeAsync(0);
    const visualText = () => wrapper.container.querySelector('[aria-hidden="true"]')?.textContent;
    expect(visualText()).toBe("D");

    wrapper.vm.stop();
    motion.setMatches(true);
    motion.setMatches(false);
    await nextTick();

    expect(wrapper.vm.isRunning).toBe(false);
    expect(wrapper.emitted.stopped).toBe(1);
    expect(visualText()).toBe("D");
    wrapper.unmount();
  });

  it("rejects invalid heading levels", () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const wrapper = mountAutoTyper({
      componentTag: "h7",
      text: "Invalid heading",
      startByDefault: false,
    });

    expect(warning.mock.calls[0][0]).toContain("Invalid prop: custom validator check failed");
    expect(wrapper.container.querySelector("h7")).toBeNull();
    expect(wrapper.container.querySelector("span.auto-typer-vue")).not.toBeNull();
    wrapper.unmount();
  });
});
