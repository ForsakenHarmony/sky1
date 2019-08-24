import delve from "dlv";
import { Component } from "preact";
import { Obj } from "./utils";

/** Create an Event handler function that sets a given state property.
 *	@param {Component} component	The component whose state should be updated
 *	@param {string} key				A dot-notated key path to update in the component's state
 *	@param {string} eventPath		A dot-notated key path to the value that should be retrieved from the Event or component
 *	@returns {function} linkedStateHandler
 */
export default function linkState(
  component: Component<any, any> & Obj,
  key: string,
  eventPath?: string
): (e: Obj) => void {
  const path = key.split("."),
    cache = component.__lsc || (component.__lsc = {});

  return (
    cache[key + eventPath] ||
    (cache[key + eventPath] = function(e: Obj) {
      const t = (e && e.target) || this;
      const state: { [key: string]: any } = {};
      let obj = state;
      const v =
        typeof eventPath === "string"
          ? delve(e, eventPath)
          : t.nodeName
          ? t.type.match(/^che/)
            ? t.checked
            : t.value
          : e;
      let i = 0;
      for (; i < path.length - 1; i++) {
        obj =
          obj[path[i]] ||
          (obj[path[i]] = (!i && component.state[path[i]]) || {});
      }
      obj[path[i]] = v;
      component.setState(state);
    })
  );
}
