export type AutoTyperComponentTag = "span" | "p" | "a" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface VueAutoTyper {
  componentTag?: AutoTyperComponentTag;
  beginningWord?: string;
  writtenBeginningWord?: string;
  text: string | string[];
  startDelay?: number;
  betweenWordDelay?: number;
  typingDelay?: number;
  deletingDelay?: number;
  waitBeforeDeleteDelay?: number;
  startByDefault?: boolean;
  repeat?: boolean;
  removeAfterRepeat?: boolean;
  pauseOnInteraction?: boolean;
  respectReducedMotion?: boolean;
  ariaLabel?: string;
}
