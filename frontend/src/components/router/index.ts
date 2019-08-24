import {
  AnyComponent,
  cloneElement,
  Component,
  ComponentChildren,
  ComponentFactory,
  FunctionalComponent,
  h,
  RenderableProps,
  toChildArray,
} from "preact";
import { assign, exec, pathRankSort, prepareVNodeForRanking } from "./util";

const ROUTERS: Router[] = [];

const subscribers: Array<(url: string) => void> = [];

const EMPTY: Partial<Location> = {};

function isPreactElement(node: Element) {
  // @ts-ignore
  return node._prevVNode != null || node.__t != null;
}

function setUrl(url: string, type = "push") {
  // @ts-ignore
  if (typeof history !== "undefined" && history[type + "State"]) {
    // @ts-ignore
    history[type + "State"](null, null, url);
  }
}

function getCurrentUrl() {
  const url = typeof location !== "undefined" ? location : EMPTY;
  return `${url.pathname || ""}${url.search || ""}`;
}

export function route(
  url: string | { url: string; replace?: boolean },
  replace?: boolean
): boolean {
  if (typeof url !== "string") {
    replace = url.replace;
    url = url.url;
  }

  // only push URL into history if we can handle it
  if (canRoute(url)) {
    setUrl(url, replace ? "replace" : "push");
  }

  return routeTo(url);
}

/** Check if the given URL can be handled by any router instances. */
function canRoute(url: string) {
  for (let i = ROUTERS.length; i--; ) {
    if (ROUTERS[i].canRoute(url)) { return true; }
  }
  return false;
}

/** Tell all router instances to handle the given URL.  */
function routeTo(url: string) {
  let didRoute = false;
  for (let i = 0; i < ROUTERS.length; i++) {
    if (ROUTERS[i].routeTo(url) === true) {
      didRoute = true;
    }
  }
  for (let i = subscribers.length; i--; ) {
    subscribers[i](url);
  }
  return didRoute;
}

function routeFromLink(node: Element) {
  // only valid elements
  if (!node || !node.getAttribute) { return; }

  const href = node.getAttribute("href"),
    target = node.getAttribute("target");

  // ignore links with targets and non-path URLs
  if (!href || !href.match(/^\//g) || (target && !target.match(/^_?self$/i))) {
    return;
  }

  // attempt to route, if no match simply cede control to browser
  return route(href);
}

function handleLinkClick(this: any, e: MouseEvent) {
  if (e.button == 0) {
    routeFromLink(e.currentTarget || e.target || this);
    return prevent(e);
  }
}

function prevent(e: Event) {
  if (e) {
    if (e.stopImmediatePropagation) { e.stopImmediatePropagation(); }
    if (e.stopPropagation) { e.stopPropagation(); }
    e.preventDefault();
  }
  return false;
}

function delegateLinkHandler(e: MouseEvent) {
  // ignore events the browser takes care of already:
  if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button !== 0) {
    return;
  }

  let t = e.target! as Element;
  do {
    if (
      String(t.nodeName).toUpperCase() === "A" &&
      t.getAttribute("href") &&
      isPreactElement(t)
    ) {
      if (t.hasAttribute("native")) { return; }
      // if link is handled by the router, prevent browser defaults
      if (routeFromLink(t)) {
        return prevent(e);
      }
    }
  } while ((t = t.parentNode as Element));
}

let eventListenersInitialized = false;

function initEventListeners() {
  if (eventListenersInitialized) { return; }

  if (typeof addEventListener === "function") {
    addEventListener("popstate", () => {
      routeTo(getCurrentUrl());
    });
    addEventListener("click", delegateLinkHandler);
  }
  eventListenersInitialized = true;
}

export interface RoutableProps {
  path?: string;
  default?: boolean;
}

export interface Location {
  pathname: string;
  search: string;
}

export interface RouterOnChangeArgs {
  router: Router;
  url: string;
  previous?: string;
  active: preact.VNode[];
  current: preact.VNode;
}

export interface RouterProps extends RoutableProps {
  static?: boolean;
  url?: string;
  onChange?: (args: RouterOnChangeArgs) => void;
}

export class Router extends Component<RouterProps> {
  public static subscribers: Array<(url: string) => void>;
  public static getCurrentUrl: () => string;
  public static route: (url: string, replace?: boolean) => boolean;
  public static Router: ComponentFactory<RouterProps>;
  public static Route: FunctionalComponent<any>;
  public static Link: FunctionalComponent<any>;
  private _didRoute?: boolean;
  private updating?: boolean;
  private unlisten?: Function;

  constructor(props: RouterProps) {
    super(props);

    this.state = {
      url: props.url || getCurrentUrl(),
    };

    initEventListeners();
  }

  public shouldComponentUpdate(props: RouterProps) {
    if (props.static !== true) { return true; }
    return (
      props.url !== this.props.url || props.onChange !== this.props.onChange
    );
  }

  /** Check if the given URL can be matched against any children */
  public canRoute(url: string) {
    return this.getMatchingChildren(this.props.children, url, false).length > 0;
  }

  /** Re-render children with a new URL to match against. */
  public routeTo(url: string) {
    this._didRoute = false;
    this.setState({ url });

    // if we're in the middle of an update, don't synchronously re-route.
    if (this.updating) { return this.canRoute(url); }

    this.forceUpdate();
    return this._didRoute;
  }

  public componentWillMount() {
    ROUTERS.push(this);
    this.updating = true;
  }

  public componentDidMount() {
    this.updating = false;
  }

  public componentWillUnmount() {
    if (typeof this.unlisten === "function") { this.unlisten(); }
    ROUTERS.splice(ROUTERS.indexOf(this), 1);
  }

  public componentWillUpdate() {
    this.updating = true;
  }

  public componentDidUpdate() {
    this.updating = false;
  }

  public getMatchingChildren(
    children: ComponentChildren,
    url: string,
    invoke: boolean
  ): preact.VNode[] {
    return toChildArray(children)
      .filter(v => v != null)
      .filter(prepareVNodeForRanking)
      .sort(pathRankSort)
      .map(vnode => {
        // @ts-ignore
        const matches = exec(url, vnode.props.path, vnode.props);
        if (matches) {
          if (invoke !== false) {
            const newProps = { url, matches };
            assign(newProps, matches);
            // @ts-ignore
            delete newProps.ref;
            // @ts-ignore
            delete newProps.key;
            // @ts-ignore
            return cloneElement(vnode, newProps);
          }
          return vnode;
        }
      })
      .filter(Boolean);
  }

  public render({ children }: RenderableProps<RouterProps>, { url }: { url: string }) {
    const active = this.getMatchingChildren(children, url, true);

    const current = active[0] || null;
    this._didRoute = !!current;

    return current;
  }
}

export function Link(props: RenderableProps<{ activeClassName?: string }>) {
  return h("a", assign({ onClick: handleLinkClick }, props));
}

export interface RouteProps extends RoutableProps {
  component: AnyComponent<any>;
}

export function Route(props: RenderableProps<RouteProps>) {
  // @ts-ignore
  return h(props.component, props);
}

Router.subscribers = subscribers;
Router.getCurrentUrl = getCurrentUrl;
Router.route = route;
Router.Router = Router;
Router.Route = Route;
Router.Link = Link;

export { subscribers, getCurrentUrl };
