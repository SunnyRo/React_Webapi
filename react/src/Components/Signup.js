import React, { Component } from "react";
import axios from "axios";
export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.onChangeUserName = this.onChangeUserName.bind(this);
    this.onChangeUserPassword = this.onChangeUserPassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      username: "",
      password: "",
      message: "",
    };
  }
  onChangeUserName(e) {
    this.setState({ username: e.target.value });
  }
  onChangeUserPassword(e) {
    this.setState({ password: e.target.value });
  }
  onSubmit(e) {
    e.preventDefault();
    const userObject = {
      username: this.state.username,
      password: this.state.password,
    };
    axios
      .post("https://localhost:7093/api/Auth/register", userObject)
      .then((res) => {
        console.log(res.data);
        this.setState({ message: res.data });
      })
      .catch((error) => {
        console.log(error.response.data);
        this.setState({ message: error.response.data });
      });
    this.setState({ username: "", password: "" });
    this.props.history.push("/signin");
  }

  render() {
    return (
      <div className="wrapper">
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>User Name</label>
            <input
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.onChangeUserName}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.onChangeUserPassword}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Create User"
              className="btn btn-success btn-block"
            />
          </div>
          <p>{this.state.message}</p>
        </form>
      </div>
    );
  }
}
