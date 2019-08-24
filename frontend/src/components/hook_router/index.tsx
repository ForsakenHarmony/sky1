import clsx from "clsx";
import {
  Component,
  ComponentChildren,
  ComponentFactory,
  createContext,
  h,
  RenderableProps,
  VNode,
} from "preact";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "preact/hooks";

let eventListenersInitialized = false;
const routers: Router[] = [];

function initEventListeners() {
  if (eventListenersInitialized) { return; }

  if (typeof addEventListener === "function") {
    addEventListener("popstate", () => {
      const path = typeof location !== "undefined" ? location.pathname : "";
      routers.map(router => router.route(path));
    });
  }
  eventListenersInitialized = true;
}

const RouterContext = createContext<Router | null>(null);

export class Router extends Component<{}> {
  public routes: Function[] = [];
  public defaults: Function[] = [];
  public matches = 0;
  public path: string = "/";

  public sub(callback: Function, isDefault: boolean = false) {
    const arr = this[isDefault ? "defaults" : "routes"];
    arr.push(callback);
    Promise.resolve().then(() => this.update(this.path));
    return () => {
      arr.splice(arr.indexOf(callback), 1);
    };
  }

  public update(path: string) {
    this.path = path;
    this.matches = 0;
    this.routes.concat(this.defaults).map(fn => fn());
  }

  public route(path: string, push: boolean = false) {
    if (push) {
      // @ts-ignore
      history.pushState(null, null, path);
    }

    this.update(path);
  }

  public componentDidMount() {
    routers.push(this);
    initEventListeners();
    this.update(this.path);
  }

  public componentWillUnmount() {
    routers.splice(routers.indexOf(this), 1);
  }

  public render(props: RenderableProps<{}>) {
    return (
      <RouterContext.Provider value={this}>
        {props.children}
      </RouterContext.Provider>
    );
  }
}

function useRouter(): Router {
  const router = useContext<Router | null>(RouterContext);
  if (!router) { throw new Error("Tried to use a router without one in context"); }
  return router;
}

export interface RouteProps<Props> {
  path?: string;
  component?: ComponentFactory<Props>;
  default?: boolean;
  children?: ComponentChildren;
}

export function Route<Props>(
  props: RouteProps<Props> & Partial<Props>
): VNode<any> | null {
  const router = useRouter();
  const [match, setMatch] = useState<any | null>(null);
  const testPath = useMemo(
    () => regexParam(props.path || ""),
    props.default ? [] : [props.path]
  );
  const cb = useCallback(() => {
    if (props.default) {
      // @ts-ignore
      return setMatch(match - 1);
    }
    const nMatch = testPath(router.path);
    if (nMatch) { router.matches++; }
    setMatch(nMatch);
  }, []);
  useEffect(() => {
    return router.sub(cb, props.default);
  }, []);

  if ((props.path && match) || (props.default && router.matches === 0)) {
    if (props.component) {
      return h(props.component, match);
    }
    return <>{props.children}</>;
  }

  return null;
}

export interface LinkProps {
  class?: string;
  className?: string;
  activeClassName?: string;
  href: string;
}

export function Link({
  href,
  activeClassName,
  className,
  class: cls,
  ...props
}: RenderableProps<LinkProps>) {
  const router = useRouter();

  const handleLinkClick = useCallback(
    (e: MouseEvent) => {
      if (e.button !== 0) { return; }

      router.route(href, true);

      if (e.stopImmediatePropagation) { e.stopImmediatePropagation(); }
      if (e.stopPropagation) { e.stopPropagation(); }
      e.preventDefault();
      return false;
    },
    [router, href]
  );

  return (
    <a
      href={href}
      onClick={handleLinkClick}
      class={clsx(
        { [activeClassName || ""]: href === router.path },
        className,
        cls
      )}
      {...props}
    >
      {props.children}
    </a>
  );
}

function regexParam(str: string) {
  const keys: string[] = [];
  const arr = str.split("/");
  arr[0] || arr.shift();

  const basePattern = arr.reduce((pattern, tmp) => {
    const c = tmp[0];

    if (c === "*") {
      keys.push("wild");
      return pattern + "/(.*)";
    }

    if (c === ":") {
      const o = tmp[tmp.length - 1] === "?"; // optional?
      keys.push(tmp.substring(1, o ? tmp.length - 1 : tmp.length));
      return pattern + (o ? "(?:/([^/]+?))?" : "/([^/]+?)");
    }

    return pattern + "/" + tmp;
  }, "");

  const pattern = new RegExp(
    "^" + basePattern + (keys.length ? "(?:/)?" : "") + "/?$",
    "i"
  );

  return (path: string) => {
    let i = 0;
    const out: { [key: string]: any } = {};
    if (!pattern.test(path)) { return; }
    const matches = pattern.exec(path);
    while (i < keys.length) {
      out[keys[i]] = matches![++i] || null;
    }
    return out;
  };
}
