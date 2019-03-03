import React, { Component } from "react";

class Course extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <div>Hii {this.props.match.params.id}</div>;
    // ${"this.props.match.params.id"}
  }
}

export default Course;
