import * as preact from "preact";

export const prevent = (e: Event) => {
  e.preventDefault();
};

declare global {
  namespace JSX {
    export import SVGAttributes = preact.JSX.SVGAttributes;
    export import HTMLAttributes = preact.JSX.HTMLAttributes;
  }
}
