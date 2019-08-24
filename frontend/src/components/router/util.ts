import { VNode } from "preact";

const EMPTY = {};

export function assign(obj: any, props: any) {
  // eslint-disable-next-line guard-for-in
  for (const i in props) {
    obj[i] = props[i];
  }
  return obj;
}

export function exec(url: any, route: any, opts: any) {
  let reg = /(?:\?([^#]*))?(#.*)?$/,
    c = url.match(reg),
    matches: any = {},
    ret;
  if (c && c[1]) {
    const p = c[1].split("&");
    for (let i = 0; i < p.length; i++) {
      const r = p[i].split("=");
      matches[decodeURIComponent(r[0])] = decodeURIComponent(
        r.slice(1).join("=")
      );
    }
  }
  url = segmentize(url.replace(reg, ""));
  route = segmentize(route || "");
  const max = Math.max(url.length, route.length);
  for (let i = 0; i < max; i++) {
    if (route[i] && route[i].charAt(0) === ":") {
      const param = route[i].replace(/(^\:|[+*?]+$)/g, ""),
        flags = (route[i].match(/[+*?]+$/) || EMPTY)[0] || "",
        plus = ~flags.indexOf("+"),
        star = ~flags.indexOf("*"),
        val = url[i] || "";
      if (!val && !star && (flags.indexOf("?") < 0 || plus)) {
        ret = false;
        break;
      }
      matches[param] = decodeURIComponent(val);
      if (plus || star) {
        matches[param] = url
          .slice(i)
          .map(decodeURIComponent)
          .join("/");
        break;
      }
    } else if (route[i] !== url[i]) {
      ret = false;
      break;
    }
  }
  if (opts.default !== true && ret === false) { return false; }
  return matches;
}

export function pathRankSort(a: any, b: any) {
  return a.rank < b.rank ? 1 : a.rank > b.rank ? -1 : a.js - b.js;
}

// filter out VNodes without attributes (which are unrankeable), and add `index`/`rank` properties to be used in sorting.
export function prepareVNodeForRanking(vnode: any, index: number) {
  vnode.index = index;
  vnode.rank = rankChild(vnode);
  return vnode.props;
}

export function segmentize(url: string) {
  return url.replace(/(^\/+|\/+$)/g, "").split("/");
}

export function rankSegment(segment: string) {
  return segment.charAt(0) == ":"
    ? 1 + "*+?".indexOf(segment.charAt(segment.length - 1)) || 4
    : 5;
}

export function rank(path: string) {
  return segmentize(path)
    .map(rankSegment)
    .join("");
}

function rankChild(vnode: VNode<{ default: boolean; path: string }>) {
  return vnode.props.default ? "0" : rank(vnode.props.path);
}
