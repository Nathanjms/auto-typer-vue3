import { AutoTyperVue } from "./components";
import type { Plugin } from "vue";

export function InstallPlugin(): Plugin {
  return {
    install(app) {
      app.component("AutoTyperVue", AutoTyperVue);
    },
  };
}
