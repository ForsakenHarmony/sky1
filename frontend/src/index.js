import './style/index.css';

import decode from 'jwt-decode';

import { route, Router } from 'preact-router';
import createStore from 'unistore';
import { Provider } from 'unistore/preact';
import { Component } from 'preact';
import { ApolloProvider } from 'react-apollo';

import Header from './components/header';
import Home from './routes/home';
import Create from './routes/create';
import Creation from './routes/creation';
import login from './gql/login.graphql';

import { client } from './apollo';

const store = createStore({
  loggedIn: false,
  loading: true,
  user: null,
});

function getValidPayloadFromToken(token) {
  if (token) {
    try {
      const payload = decode(token);
      return payloadIsValid(payload) ? payload : undefined;
    } catch (error) {
      return undefined;
    }
  }
  return undefined;
}

function payloadIsValid(payload) {
  return payload && payload.exp * 1000 > new Date().getTime();
}

class App extends Component {
  async componentDidMount() {
    try {
      const discordToken =
        window.location.search.substring(1).split('code=')[1] ||
        ''.split('&')[0];

      if (discordToken) {
        const { data, error } = await client.mutate({
          mutation: login,
          variables: {
            token: discordToken,
          },
        });

        if (!error) {
          const {
            login: { token, user },
          } = data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }

        route(location.pathname, true);
      }

      const token = localStorage.getItem('token');

      if (getValidPayloadFromToken(token) && localStorage['user']) {
        store.setState({
          loggedIn: true,
          user: JSON.parse(localStorage.getItem('user')),
        });
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (e) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      store.setState({ loading: false });
    }
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <div id="app">
            <Header />
            <Router>
              <Home path="/" />
              <Creation path="/creation/:id" />
              <Create path="/create" />
              <div default className="container">
                404
              </div>
            </Router>
          </div>
        </Provider>
      </ApolloProvider>
    );
  }
}

export default App;
