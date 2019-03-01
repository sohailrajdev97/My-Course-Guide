import React, { Component } from "react";
import { getDecodedToken } from "../utils/jwt";
import "./home.css";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="home">
        <h1>Welcome {getDecodedToken().email}</h1>
      </div>
    );
  }
}

export default Home;