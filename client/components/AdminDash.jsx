import React, { Component } from "react";
import { getDecodedToken } from "../utils/jwt";
import { server } from "../utils/config";

// Import FilePond
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="dashboard">
        Hello Admin {getDecodedToken().email}
        <FilePond name="csv" server={`${server}/api/csv`} />
      </div>
    );
  }
}

export default Dashboard;
