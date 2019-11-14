import React, { Fragment } from "react";
import "./App.scss";
import request from "superagent";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      loadingState: false,
      users: []
    };
  }

  componentDidMount() {
    this.loadMoreItems();
    this.refs.iScroll.addEventListener("scroll", () => {
      if (
        this.refs.iScroll.scrollTop + this.refs.iScroll.clientHeight >=
        this.refs.iScroll.scrollHeight
      ) {
        this.loadMoreItems();
      }
    });
  }

  loadMoreItems() {
    this.setState({ loadingState: true }, () => {
      request
        .get("https://randomuser.me/api/?results=20")
        .then(results => {
          const nextUsers = results.body.results.map(user => ({
            username: user.login.username,
            name: user.name.first + " " + user.name.last,
            cell: user.cell
          }));

          this.setState({
            loadingState: false,
            users: [...this.state.users, ...nextUsers]
          });
        })
        .catch(err => {
          this.setState({
            error: err.message,
            loadingState: false
          });
        });
    });
  }

  render() {
    return (
      <div ref="iScroll" className="scroll-container">
        <ul>
          {this.state.users.map(user => (
            <Fragment key={user.username}>
              <li>
                <strong>{user.name}</strong>
                <br />
                <span>{user.cell}</span>
              </li>
            </Fragment>
          ))}
        </ul>

        <div className="loading">
          {this.state.loadingState ? (
            <p className="loading"> loading More Items..</p>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default App;
