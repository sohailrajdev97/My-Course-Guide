import React, { Component } from "react";
import { getDecodedToken } from "../../utils/jwt";
import AdminDashboard from "../../components/AdminDashboard.jsx";
import StudentDashboard from "../../components/StudentDashboard.jsx";
import ProfDashboard from "../../components/ProfDashboard.jsx";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let role = getDecodedToken().role;
    if (role === "admin") {
      return <AdminDashboard />;
    }
    if (role === "student") {
      return <StudentDashboard />;
    }
    else {
      return <ProfDashboard />;
    }
  }
}

export default Home;
