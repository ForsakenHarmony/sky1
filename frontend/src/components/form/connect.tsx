import linkState from "./linkstate";
import { CONTEXT_TYPES, noop, Obj } from "./utils";
import { h, Component, RenderableProps, ComponentFactory } from "preact";
import { Form } from "./form";

function isInvalid(
  form: any,
  data: Obj,
  name: string,
  validate?: (data: any, full: Obj, name: string) => boolean
) {
  if (!form) return false;
  let element = null;
  if (name in data) {
    element = form.elements[name];
    // if (element.value != data[name]) {
    //   element.value = data[name];
    // }
  }
  if (validate && element) {
    let valid = validate(data[name], data, name);
    element.setCustomValidity(valid ? "" : true);
  }

  if (element) {
    if (element.validity) return !element.validity.valid;
    if (element.length) {
      for (let i = 0; i < element.length; i++)
        if (!element[i].validity.valid) return true;
    }
  }
  return false;
}

export interface ConnectProps {
  name: string;
  validate?: (data: any, full: Obj, name: string) => boolean;
}

export interface ConnectContext {
  form: Form;
}

export interface ConnnectedProps {
  invalid: boolean;
  value: any;
  status: any;
  onChange: (e: Event) => void;
}

/**
 * Wire up a component to the `<Form>`, giving it access to form data as `status`. If the connected component
 * is passed a `name` property, then the component also gets the `value`, `invalid` and `onChange` properties.
 *
 * If the `name` property is present, a form element with the same `name` **must** be included inside the form.
 * This is required in order to use the native HTML5 validity. If you are not using an input
 * element as part of the UI, it is perfectly acceptable to create a `display: none` input that
 * simply reflects the same validity. for example:
 *
 *     <input value={value} style={{ display : 'none' }} {...props} />
 *
 *  **Note:** the input only needs to reflect the same validity, so if you are only concerned
 *  with `required` for instance, you can store a complex (non-string) value in the state, while
 *  simply storing a placeholder in the input (for example: `value={value == undefined ? '' : '__NOT_EMPTY__' }`)
 *
 * `onChange(e)` is a function which expects a `change` or `input` event from a native HTML element.
 * If you need to pass it data in a different format, you can use `mapEvent` to change the data
 * into the correct format.
 *
 * @returns {Component} ConnectedComponent
 * @param {Component} Child Component to be wrapped
 * @param {String|Function} mapEvent (Optional) maps the input to `onChange` to the value to be stored.
 * - String arguments are treated as a `.` delimited path.
 * - Functions are passed the argument to `onChange`, and the result is stored in state.
 *
 * @example
 * // view only
 * const _Debug = (props) => (
 *   <pre>{JSON.stringify(props, null, 4)}</pre>
 * );
 * const Debug = connectForm(_Debug);
 * <Form>
 *   <Debug />
 *   ....
 * </Form>
 *
 * // Wrapped input
 * const _Input = ({ status, onChange, invalid, className, ...props }) => (
 *   <input
 *     className={invalid ? 'invalid ' + className : className}
 *     onInput={onChange}
 *     {...props}
 *   />
 * );
 * const Input = connectForm(_Input);
 *
 * <Form onSubmit={(data) => console.log(data)}>
 *   <Input name="test" required />
 *   <button type="submit">Submit</button>
 * </Form>
 */
export function connect<T extends ConnectProps>(
  Child: ComponentFactory<T & ConnnectedProps>,
  mapEvent?: (event: Event, props: any) => any
): ComponentFactory<T> {
  return class ConnectForm extends Component<T> {
    static contextTypes = CONTEXT_TYPES;

    private readonly onChange: (e: Event) => void;

    constructor(props: T, context: ConnectContext) {
      super(props, context);

      const Form = context.form;
      const name = props.name;

      const update =
        typeof name === "string" ? linkState(Form, "data." + name) : noop;

      this.onChange =
        typeof mapEvent === "function"
          ? e => {
              let mappedEvent = mapEvent(e, this.props);
              update(mappedEvent);
            }
          : update;
    }

    render(
      { validate, name, ...props }: RenderableProps<ConnectProps & T>,
      _state: Readonly<any>,
      {
        form: {
          ref: { form },
          state: status,
        },
      }: ConnectContext
    ) {
      return h(Child, {
        invalid: isInvalid(form, status.data, name, validate),
        value: status.data[name] || "",
        status,
        onChange: this.onChange,
        ...(props as T),
      });
    }
  };
}
