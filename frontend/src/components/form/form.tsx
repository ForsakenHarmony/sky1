import { filterJoin, CONTEXT_TYPES, Obj } from "./utils";
import linkState from "./linkstate";
import { Component, RenderableProps } from "preact";

const size = (obj: object) => Object.keys(obj).length;

function isNew(oldState: any, newState: any) {
  if (oldState === newState) return false;
  return !(size(oldState) === 0 && size(newState) > 0);
}

export type FormProps = {
  onChange?: (data: any, valid: boolean) => void;
  onSubmit: (data: any, form: any) => any;
  onSubmitted?: (result: any) => void;
  initialState?: object;
  name?: string;
  class?: string;
  className?: string;
};

type FormState = {
  data: Obj;
  invalid: boolean;
  submitting: boolean;
  error: any | null;
};

/* @jsx h */
/**
 * The `<Form>` component will store the data from any connected inputs. It will call `onSubmit`
 * if the form is submitted (user presses enter, or clicks on a submit button), and is valid,
 * `onSubmit` is called with two arguments: `data` and `form`.
 * @class
 * @extends Component
 * @param {Object}   props
 * @param {onChange} props.onChange
 * @param {onSubmit} props.onSubmit
 * @param {Function} props.onSubmitted
 * @param {Object}   props.initialState
 */

export class Form extends Component<FormProps, FormState> {
  static childContextTypes = CONTEXT_TYPES;
  static contextTypes = CONTEXT_TYPES;

  // @ts-ignore
  ref: { form: HTMLFormElement } = {};

  constructor(props: FormProps, context: any) {
    super(props, context);

    this.state = {
      data: this.props.initialState || {},
      invalid: false,
      submitting: false,
      error: null,
    };

    this.submit = this.submit.bind(this);
    this.finally = this.finally.bind(this);
  }
  /**
   * The function passed to `onChange` will be called whenever the form data is updated.
   *
   * @function onChange
   * @param {Object}  data  An Object containing the complete form data.
   * @param {Boolean} valid a Boolean set to true if all the form elements are valid.
   */

  /**
   * The function passed to `onSubmit` will be called when the form is submitted, and all
   * validations have been met.
   *
   * @function onSubmit
   * @param {Object}  data An Object containing the complete form data
   * @param {Element} form The underlying form element
   * @returns {Promise|Object|String|Number|Boolean|undefined}
   *
   * If `onSubmit` returns a Promise, the form is marked as `submitting` until the promise
   * either resolves or rejects.
   * - If the promise resolves, `onSubmitted` is called with the value returned from the promise.
   * - If the promise rejects, `status.error` is set to the error value returned from the promise.
   *
   * If `onSubmit` does not return a Promise, `onSubmitted` is immediately called.
   * `onSubmitted` has only one argument, which is the value returned from `onSubmit`.
   *
   * @example
   * // post data to external api as JSON
   * (data) => fetch({
   *    method : 'post',
   *    url    : '/api/update/my/thing',
   *    body   : JSON.stringify(data),
   * }).then(r => {
   *    // any 2XX status will return the JSON data to `onSubmitted`
   *    if (r.ok) return r.json();
   *
   *    // status.error will be set with the JSON value returned for this error
   *    return r.json().then(body => Promise.reject(body));
   *})
   *
   * @example (data) => promise.reject('Closed for Business')
   */

  /**
   * The function passed to `onSubmitted` will be called once the submission is considered complete.
   * That is, either after the `onSubmit` has completed synchronously, or after a promise returned
   * by `onSubmit` has resolved.
   *
   * @function onSubmitted
   * @param {Object|String|Number|Boolean|undefined}  value The value returned by onSubmit synchronously, or returned by a Promise asynchronously.
   */

  componentDidUpdate(p: FormProps, s: FormState) {
    let { initialState } = p;
    if (
      this.props.initialState &&
      isNew(initialState, this.props.initialState)
    ) {
      this.setState({ data: this.props.initialState });
    }

    let valid = this.ref.form.checkValidity();
    if (this.state.invalid && valid) {
      this.setState({ invalid: false });
    }

    if (p.onChange) p.onChange(this.state.data, valid);

    if (valid && this.state !== s && this.context.form) {
      let form = this.context.form;
      linkState(form, filterJoin(["data", this.props.name], "."))(
        this.state.data
      );
    }
  }

  submit(e: Event) {
    e.preventDefault();
    let valid = (e.target as HTMLFormElement).checkValidity();
    if (!valid) {
      ((e.target as HTMLFormElement).querySelector(
        ":invalid"
      ) as HTMLInputElement).focus();
      return this.setState({ invalid: true });
    }

    let out = this.state.data;

    this.setState({ submitting: true, invalid: false, error: null });
    if (this.props.onSubmit) {
      let result = this.props.onSubmit(out, this.ref.form);
      if (result && result.then) {
        result.then(this.finally).catch((e: any) => {
          this.setState({ submitting: false, error: e });
        });
      } else {
        this.finally(result);
      }
    }
  }

  finally(result: any) {
    this.setState({ submitting: false });
    if (this.props.onSubmitted) this.props.onSubmitted(result);
  }

  getChildContext() {
    return { form: this };
  }

  render(
    { className, children }: RenderableProps<FormProps>,
    { invalid, submitting, error }: Readonly<FormState>
  ) {
    className = className || this.props.class;

    return (
      // @ts-ignore
      <form
        ref={f => (this.ref.form = f)}
        onSubmit={this.submit}
        className={className}
        invalid={invalid ? "" : null}
        submitting={submitting ? "" : null}
        error={error != null ? "" : null}
        noValidate
        children={children}
      />
    );
  }
}
