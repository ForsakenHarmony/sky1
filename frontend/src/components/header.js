import { Component } from "preact";
import { connect } from "unistore/preact";
import objstr from "obj-str";

@connect(["loading", "loggedIn", "user"], {
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return {
      loggedIn: false,
      user: null
    }
  }
})
export default class Header extends Component {
  static login() {
    location.href = `https://discordapp.com/api/oauth2/authorize?client_id=${
      process.env.DISCORD_CLIENT_ID
    }&redirect_uri=${
      location.origin
    }/&response_type=code&scope=identify%20email`;
  }

  render({ loading, loggedIn, user, logout }) {
    return (
      <header className="navbar">
        <section className="navbar-section">
          <a href="/" className="navbar-brand mr-2">
            Sky1 Showcase
          </a>
        </section>
        <section className="navbar-section">
          {
            loggedIn ? [
              <a href="/create" className="btn btn-primary">
                <i className="icon icon-plus" />
              </a>,
              <a href={`/profile/${user.id}`} className="btn btn-primary">
                <i className="icon icon-people" />
              </a>,
              <button className="btn btn-primary" onClick={logout}>
                <i className="icon icon-shutdown" />
              </button>,
            ] : [
              <button
                className={objstr({ "btn btn-primary": true, loading: loading })}
                onClick={Header.login}
              >
                Log In
              </button>
            ]
          }
          <a href="/search" className="btn btn-primary">
            <i className="icon icon-search" />
          </a>
        </section>
      </header>
    );
  }
}
