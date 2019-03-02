import React, { Component } from "react";
import { getDecodedToken } from "../../utils/jwt";
import "./home.css";
import AdminDash from "../../components/AdminDash.jsx";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let role = getDecodedToken().role;
    return <div className="home">{role == "admin" ? <AdminDash /> : ""}</div>;
  }
}

export default Home;
