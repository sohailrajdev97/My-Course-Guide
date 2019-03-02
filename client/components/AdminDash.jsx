import React, { Component } from "react";
import { getDecodedToken } from "../utils/jwt";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className="dashboard">Hello Admin.</div>;
  }
}

export default Dashboard;
