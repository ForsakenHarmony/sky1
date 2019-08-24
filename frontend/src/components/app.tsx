import { Provider } from "@pql/boost";
import { Component } from "preact";
import { Route, Router } from "preact-router";

import { client } from "../client";
import AddCreation from "../route/create";
import Creation from "../route/creation";
import Home from "../route/home";
import { Header } from "./header";

function logout() {
  window.localStorage.removeItem("jwt");
  window.location.reload();
}

export class App extends Component {
  public render() {
    return (
      <Provider value={client}>
        <main class="parallax">
          <div class="parallax_group">
            <span class="parallax_layer parallax_1" />
            <span class="parallax_layer parallax_2" />
            <span class="parallax_layer parallax_3" />
          </div>
          <Header logout={logout} />
          <Router>
            <Route path="/" component={Home} />
            <Route path="/creation/:id" component={Creation} />
            <Route path="/create" component={AddCreation} />
            <div default={true} class="container">
              404
            </div>
          </Router>
        </main>
      </Provider>
    );
  }
}
