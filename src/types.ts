export interface VueAutoTyper {
  componentTag: String;
  customCursorStyling: Object;
  beginningWord: String;
  text: String | Array<String>;
  startDelay: Number;
  betweenWordDelay: Number;
  typingDelay: Number;
  deletingDelay: Number;
  waitBeforeDeleteDelay: Number;
  startByDefault: Boolean;
  repeat: Boolean;
}
