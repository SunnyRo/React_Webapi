import React, { Component } from "react";
import axios from "axios";
import AuthenticationService from "./Authentication";
export default class Login extends Component {
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
      .post("https://localhost:7093/api/Auth/login", userObject)
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("user", res.data);
        this.setState({
          message: "Logged in please go to home page to see your token",
        });
      })
      .catch((error) => {
        console.log("eerrro heheeh");
        console.log(error.response.data);
        this.setState({ message: error.response.data });
      });
    this.setState({ username: "", password: "" });
  }
  componentDidMount() {
    const user = AuthenticationService.getCurrentUser();
    if (user) {
      // this.props.history.push("/");
    }
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <h3>Log in</h3>

        <div className="form-group">
          <label>User Name</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={this.state.username}
            onChange={this.onChangeUserName}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={this.state.password}
            onChange={this.onChangeUserPassword}
          />
        </div>

        <button type="submit" className="btn btn-dark btn-lg btn-block">
          Sign in
        </button>
        <p>{this.state.message}</p>
      </form>
    );
  }
}
