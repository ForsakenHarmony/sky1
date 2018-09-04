import { Component } from "preact";
import { route } from "preact-router";
import { Mutation } from "react-apollo";
import str from "obj-str";

import { Form, connect } from "../components/form";

import create from "../gql/create_creation.graphql";

const Field = ({ label, children }) => (
  <div className="form-group">
    <div className="col-3 col-sm-12">
      <label className="form-label">{label}</label>
    </div>
    <div className="col-9 col-sm-12">{children}</div>
  </div>
);

const _Textarea = ({ label, onChange, ...props }) => (
  <Field label={label}>
    <textarea className="form-input" onInput={onChange} {...props} />
  </Field>
);
const Textarea = connect(_Textarea);
const _Input = ({ label, onChange, ...props }) => (
  <Field label={label}>
    <input className="form-input" type="text" onInput={onChange} {...props} />
  </Field>
);
const Input = connect(_Input);
const _Radio = ({
  label,
  onChange,
  options,
  name,
  value: selected,
  ...props
}) => (
  <Field label={label}>
    {options.map(({ label, value }) => (
      <label className="form-radio">
        <input
          type="radio"
          name={name}
          value={value}
          checked={value === selected}
          onChange={onChange}
          {...props}
        />
        <i className="form-icon" />
        {label}
      </label>
    ))}
  </Field>
);
const Radio = connect(_Radio);
const _Images = ({ label, onChange, ...props }) => (
  <Field label={label}>
    <input
      className="form-input"
      type="file"
      multiple
      accept="image/png, image/jpeg"
      onChange={({ target: { files } }) => onChange.call({}, files)}
      {...props}
    />
  </Field>
);
const Images = connect(_Images);

export default class Create extends Component {
  submit() {
    route("/");
  }

  error() {
    console.error(arguments);
  }

  render() {
    return (
      <Mutation
        mutation={create}
        onCompleted={this.submit}
        onError={this.error}
      >
        {(upload, { loading }) => (
          <div class="container">
            <div class="columns">
              <div class="column col-3 hide-lg" />
              <div class="column col-6 col-lg-12">
                <Form
                  onSubmit={data => {
                    upload({
                      variables: {
                        creation: {
                          ...data,
                          tags: [],
                        }
                      }
                    });
                  }}
                  onChange={console.log.bind(console)}
                >
                  <div class="card">
                    <div class="card-header">
                      <div class="card-title h5">Submit a Creation</div>
                    </div>
                    <div class="card-body">
                      <div class="form-horizontal">
                        <Input
                          label="Name"
                          placeholder="Name"
                          name="name"
                          required
                        />
                        <Textarea
                          label="Description"
                          placeholder="Description"
                          name="description"
                          rows="3"
                          required
                        />
                        <Radio
                          label="Status"
                          name="status"
                          options={[
                            { label: "WIP", value: "WIP" },
                            { label: "Complete", value: "COMPLETED" }
                          ]}
                          required
                        />
                        <Images label="Pictures" name="pictures" required />
                      </div>
                    </div>
                    <div className="card-footer">
                      <button
                        className={str({
                          "btn btn-primary": true,
                          loading: loading
                        })}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}
