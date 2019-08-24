export const CONTEXT_TYPES = {
  form: () => {},
};

export function filterJoin(values: any[], sep: string) {
  return values
    .filter(v => v !== false && v != null && v !== undefined)
    .join(sep);
}
export function c(...classes: any[]) {
  return filterJoin(classes, " ");
}

export interface Obj { [key: string]: any }

export function noop() {}
