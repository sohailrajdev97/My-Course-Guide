import React, { Component } from "react";
import { getDecodedToken } from "../../utils/jwt";
import AdminDashboard from "../../components/AdminDashboard.jsx";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let role = getDecodedToken().role;
    if (role == "admin") {
      return <AdminDashboard />;
    }
  }
}

export default Home;
