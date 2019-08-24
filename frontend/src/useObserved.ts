import { useMemo, useState } from "preact/hooks";

export const obsSym = Symbol("observedObject");

export interface Obj {
  [obsSym]?: any,
  [key: string]: any
}

export function createObserved<T extends Obj = {}>(
  obj: T,
  cb: (obs: any) => void
): T {
  if (typeof obj !== "object" || obj == null || obj instanceof Date) { return obj; }

  return (
    obj[obsSym] ||
    (obj[obsSym] = new Proxy(obj, {
      get: (target, prop) =>
        typeof prop === "symbol"
          ? target[prop as any]
          : createObserved(
          target[prop as any],
          ob => ob === target[prop] && cb(obj)
          ),
      set: (target: Obj, prop: string, value) => {
        target[prop] = value;
        typeof prop !== "symbol" && cb(obj);
        return true;
      },
    }))
  );
}

export function useObserved<T extends Obj>(initial: T) {
  const update = useState(false);
  return useMemo(
    () => createObserved<T>(initial, () => update[1](state => !state)),
    []
  );
}
