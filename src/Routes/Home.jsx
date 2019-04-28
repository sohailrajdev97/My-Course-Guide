import React, { Component } from "react";

import AdminDashboard from "../components/AdminDashboard.jsx";
import ProfDashboard from "../components/ProfDashboard.jsx";
import StudentDashboard from "../components/StudentDashboard.jsx";
import HoDDashboard from "../components/HoDDashboard.jsx";

import { getDecodedToken } from "../utils/jwt";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const role = getDecodedToken().role;
    switch (role) {
      case "admin":
        return <AdminDashboard />;
      case "student":
        return <StudentDashboard />;
      case "hod":
        return <HoDDashboard />;
      default:
        return <ProfDashboard />;
    }
  }
}

export default Home;
