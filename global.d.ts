import '@vue/runtime-core';
import {
  AutoTyperVue
} from 'auto-typer-vue';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    AutoTyperVue: typeof AutoTyperVue;
  }
}

export {};
