interface Obj {
  [key: string]: any;
}

const rgx1 = /(radio|checkbox)/i;
const rgx2 = /(reset|submit|button)/i;

export function serialize(form: HTMLFormElement) {
  const out: Obj = {};

  // @ts-ignore
  for (const tmp in form.elements) {
    const input: HTMLInputElement = form.elements[tmp] as any;

    // Ignore unnamed, disabled, or (...rgx2) inputs
    if (!input.name || input.disabled || rgx2.test(input.type)) { continue; }

    const key = input.name;

    // Grab all values from multi-select
    if (input.type === "select-multiple") {
      out[key] = Array.from<HTMLOptionElement>(input.selectedOptions).map(
        opt => opt.value
      );
    } else if (rgx1.test(input.type)) {
      if (input.checked) {
        const val = out[key];
        const value = input.value === "on" || input.value;
        out[key] =
          val == null && val !== 0 ? value : ([] as any[]).concat(val, value);
      }
    } else if (input.value) {
      const val = out[key];
      out[key] =
        val == null && val !== 0
          ? input.value
          : ([] as any[]).concat(val, input.value);
    }
  }

  return out;
}

export interface ValidationRules {
  [key: string]: RegExp | ((val: string, data: object) => boolean | string);
}

export function validate(
  form: HTMLFormElement,
  rules: ValidationRules = {},
  toCheck?: string
) {
  let nxt,
    arr,
    isOkay = true,
    out = {};
  let k,
    msg,
    len,
    data = serialize(form);

  if (toCheck && toCheck.trim) {
    rules = {
      [toCheck]: rules[toCheck],
    };
  }

  for (const name in rules) {
    const rule = rules[name];
    const valid = (rule instanceof RegExp ? rule.test : rule).call(
      rules[k],
      data[k],
      data
    );

    const elems = form.elements[name];
    const arr = elems.length ? elems : [elems];
  }

  for (k in rules) {
    // Accomodate Function or RegExp
    msg = (rules[k].test || rules[k]).call(rules[k], data[k], data);
    // Accomodate radio|checkbox groups
    nxt = form.elements[k];
    arr = nxt.length ? nxt : [nxt];
    for (len = arr.length; len--; ) {
      arr[len].isValid = msg === true || ((out[k] = msg), (isOkay = false));
    }
  }

  form.isValid = isOkay;

  return out;
}

export interface BindOptions {
  onSubmit?: (event: Event) => boolean;
  onError?: (event: Event) => boolean;
  rules?: ValidationRules;
}

export function bind(
  form: HTMLFormElement,
  opts: BindOptions = {}
): HTMLFormElement {
  form.serialize = serialize.bind(null, form);
  form.validate = validate.bind(null, form, opts.rules);

  form.onsubmit = (ev: Event & { errors: any[] }) => {
    ev.preventDefault();
    ev.errors = form.errors = form.validate();
    return form.isValid ? opts.onSubmit(ev) : opts.onError(ev);
  };

  return form;
}
