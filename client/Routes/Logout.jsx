import React, { Component } from "react";
import { Redirect } from "react-router";

class Logout extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    sessionStorage.removeItem("token");
    this.props.setRouterToken(null);
    return <Redirect to="/login" />;
  }
}

export default Logout;
