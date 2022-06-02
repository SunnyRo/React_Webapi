import React, { Component } from "react";
import AuthenticationService from "./Authentication";
export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.signOut = this.signOut.bind(this);
    this.state = {
      message: "",
    };
  }
  componentDidMount() {
    const user = AuthenticationService.getCurrentUser();
    this.setState({ message: user });
  }
  signOut() {
    AuthenticationService.signOut();
    this.setState({ message: "" });
  }

  render() {
    return (
      <>
        <h1>Welcome back</h1>
        <p>{this.state.message}</p>
        <button onClick={this.signOut}>Sign Out</button>
      </>
    );
  }
}
