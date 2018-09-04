import { Component } from 'preact';

interface Middleware {
  before(): Promise<any>,
  after(): Promise<any>
}

type Operation = {
  query: string,
  variables: Record<string, any>
}

type Result = {
  data?: Record<string, any>,
  errors?: Record<string, any>,
}

type ClientOptions = {
  url: string;
  middleware: Middleware[];
};

class GqlClient {
  constructor(options: ClientOptions) {

  }

  async query(op: Operation) {

  }
}

const httpTransport = ({ url }) => {};

const client = ({ transport }) => {};

export function Provider({ client }) {
  this.getChildContext = () => ({ client });
  this.render = props => props.children[0];
}

class Query extends Component {
  state = {
    data: Object.create(null),
    loading: true,
    error: null,
  };

  componentDidMount() {

  }

  render({ children }) {
    console.log('gql', children);
    return null;
  }
}
