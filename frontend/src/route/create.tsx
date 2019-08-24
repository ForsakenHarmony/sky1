import clsx from "clsx";
import { FunctionalComponent, RenderableProps } from "preact";

import styled from "@emotion/styled";
import { useMutation } from "@pql/boost";
import { Upload } from "preact-feather";
import { useCallback, useRef, useState } from "preact/hooks";
import { buildHeaders } from "../client";
import { CardTitle } from "../components/spectre";
import { addCreation } from "../gql/index.gql";
import { useObserved } from "../useObserved";

const Field: FunctionalComponent<{ label: string; children: any }> = ({
  label,
  children,
}) => (
  <div className="form-group">
    <div className="col-3 col-sm-12">
      <label className="form-label">{label}</label>
    </div>
    <div className="col-9 col-sm-12">{children}</div>
  </div>
);

const Radio = ({ label, ...props }: { label: string }) => (
  <label className="form-radio">
    <input type="radio" {...props} />
    <i className="form-icon" />
    {label}
  </label>
);

// const Images = ({ label, onChange, ...props }: { label: string, onChange: Function }) => (
//   <Field label={label}>
//     <input
//       className="form-input"
//       type="file"
//       multiple
//       accept="image/png, image/jpeg"
//       // @ts-ignore
//       onChange={({ target: { files } }) => onChange.call({}, files)}
//       {...props}
//     />
//   </Field>
// );

interface FormStateOptions<T extends { [key: string]: any }> {
  default: T;
  onSubmit: (data: T) => void;
  validate: Partial<T>;
}

interface FormHelpers {
  input: Function;
  radio: Function;
}

function useFormState<T extends { [key: string]: any }>(
  options: FormStateOptions<T>
): [FunctionalComponent<any>, FormHelpers] {
  // @ts-ignore
  const [state, setState] = useState(options.default);

  return [
    (props: RenderableProps<any>) => <form {...props}>{props.children}</form>,
    { input: () => {}, radio: () => {} },
  ];
}

function sendXHR(
  url: string,
  {
    method,
    headers = {},
    data,
    progressCb,
  }: {
    method?: string;
    headers?: { [key: string]: any };
    data?: { [key: string]: any } | string;
    progressCb: (progress: number) => void;
  }
): Promise<string> {
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method || "GET", url);
    Object.keys(headers).forEach(name =>
      xhr.setRequestHeader(name, headers[name])
    );

    xhr.upload.addEventListener(
      "progress",
      evt => {
        let percent = 0;
        const postition = evt.loaded;
        const total = evt.total;
        if (evt.lengthComputable) { percent = postition / total; }
        progressCb(percent);
      },
      false
    );

    xhr.addEventListener(
      "error",
      e => {
        const error = new Error(xhr.statusText + ": " + xhr.responseText);
        console.error(e, error);
        rej(error);
      },
      false
    );

    xhr.addEventListener(
      "loadend",
      e => {
        progressCb(1);
        console.log("loadend", e);
        res(xhr.responseText);
      },
      false
    );

    if (!data) { return xhr.send(); }
    if (typeof data === "string") {
      xhr.send(data);
    } else {
      const formData = new FormData();
      Object.keys(data).forEach(name => formData.append(name, data[name]));
      xhr.send(formData);
    }
  });
}

interface UploadState<T> {
  error: any;
  data: T | null;
  loading: boolean;
  done: boolean;
  progress: number;
}

function useUpload<T>(
  url: string,
  options: {
    method?: string;
    headers?: { [key: string]: any };
  } = {}
): [UploadState<T>, (file: File) => void] {
  // const [state, setState] = useState({
  //   error: null,
  //   loading: false,
  //   progress: 0,
  // });
  const state = useObserved<UploadState<T>>({
    error: null,
    data: null,
    loading: false,
    done: false,
    progress: 0,
  });

  const start = useCallback(
    (file: File) => {
      state.loading = true;
      state.done = false;
      sendXHR(url, {
        method: options.method || "POST",
        headers: options.headers,
        data: { file },
        progressCb: progress => {
          state.progress = progress;
        },
      })
        .then(res => {
          state.loading = false;
          state.done = true;
          state.data = JSON.parse(res) as T;
        })
        .catch(err => {
          state.loading = false;
          state.done = true;
          state.error = err;
        });
    },
    [url, options.method]
  );

  return [state, start];
}

const Circle = styled.svg`
  transform: rotate(-90deg);
  circle {
    fill: none;
    &.value {
      stroke: #a6a6a6;
      stroke-linecap: round;
      transition: stoke-dashoffset 100ms ease-in-out;
    }
  }
`;

function ProgressCircle({ progress }: { progress: number }) {
  const RADIUS = 54;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  const dashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <Circle width="150" height="150" viewBox="0 0 120 120">
      <circle
        class="value"
        cx="60"
        cy="60"
        r="54"
        stroke-width="6"
        stroke-dasharray={CIRCUMFERENCE}
        stroke-dashoffset={dashoffset}
      />
    </Circle>
  );
}

const UploadLabel = styled.label<{ url?: any }>`
  width: 200px;
  height: 200px;
  border-radius: 3em;
  background-color: hsla(0, 5%, 25%, 0.3);
  background-image: url(${props => props.url});
  background-size: cover;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: 5px;

  input {
    display: none;
  }
`;

function Uploader({ cb }: { cb?: Function; key?: any }) {
  const [{ error, loading, progress, data, done }, upload] = useUpload<{
    ok: boolean;
    id: string;
    url: string;
  }>(`http://localhost:4000/upload`, {
    headers: buildHeaders(),
  });
  console.log(error, loading, progress, data);
  // const [over, setOver] = useState(false);
  const [url, setUrl] = useState("");
  const input = useRef<HTMLInputElement>();

  function doUpload() {
    cb && cb();
    const file = input.current!.files![0];
    upload(file);
    const reader = new FileReader();
    reader.onload = () => {
      setUrl((reader.result as string) || "");
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <UploadLabel
        onDragOver={e => e.preventDefault()}
        onDragEnter={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault();
          input.current!.files = e.dataTransfer.files;
          doUpload();
        }}
        url={url}
      >
        {!loading && !done && <Upload size={48} />}
        {loading && <ProgressCircle progress={0.1 + progress * 0.9} />}
        {/*<progress value={progress * 100} />*/}
        {error && <span>{error}</span>}
        <input
          className="form-input"
          type="file"
          accept="image/png, image/jpeg"
          disabled={loading || done}
          ref={input}
          // @ts-ignore
          onChange={doUpload}
        />
      </UploadLabel>
    </>
  );
}

function UploadWrapper() {
  const state = useObserved<{
    id: number;
    files: Array<{
      id: number;
      file: any;
    }>;
  }>({
    id: 0,
    files: [],
  });

  console.log(state);

  function add(id: number, file: any) {
    state.id += 1;
    state.files.unshift({
      id,
      file,
    });
  }

  // function remove(id) {
  //
  // }

  const tree = (
    <>
      <Uploader key={state.id} cb={add.bind(null, state.id)} />
      {state.files.map(file => (
        <Uploader key={file.id} />
      ))}
    </>
  );

  console.log(state, tree);

  return tree;
}

export default function AddCreation() {
  // @ts-ignore
  const [{ fetching }, mutate] = useMutation(addCreation);
  const [Form, { input, radio }] = useFormState({
    default: {
      name: "",
      pictures: [],
      description: "",
      status: "",
    },
    onSubmit: _data => {},
    validate: {},
  });

  return (
    <Wrapper>
      <Form>
        <CardTitle>Submit a Creation</CardTitle>
        <div class="form-horizontal">
          <Field label="Name">
            <input
              className="form-input"
              {...input("name")}
              required={true}
              placeholder="Name"
            />
          </Field>
          <Field label="Description">
            <textarea
              className="form-input"
              {...input("description")}
              rows={3}
              required={true}
              placeholder="Description"
            />
          </Field>
          <Field label="Status">
            <Radio {...radio("status", "WIP")} label="WIP" />
            <Radio {...radio("status", "COMPLETED")} label="COMPLETED" />
          </Field>
          <Field label="Files">
            <UploadWrapper />
          </Field>
          {/*<Images label="Pictures" name="pictures" required />*/}
        </div>
        <button
          className={clsx({
            "btn btn-primary": true,
            loading: fetching,
          })}
        >
          Submit
        </button>
      </Form>
    </Wrapper>
  );
}

function Wrapper(props: RenderableProps<{}>) {
  return (
    <div className="container">
      <div className="columns">
        <div className="column col-3 hide-lg" />
        <div className="column col-6 col-lg-12">{props.children}</div>
      </div>
    </div>
  );
}
