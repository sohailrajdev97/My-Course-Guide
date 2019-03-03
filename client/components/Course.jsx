import React, { Component } from "react";
import { axiosGET } from "../utils/axiosClient";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class Course extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: null
    };
  }
  getCourse(id) {
    axiosGET(`/api/courses/${id}`).then(res => {
      this.setState({ course: res.data });
    });
  }
  componentDidMount() {
    console.log("mounted");
    this.getCourse(this.props.match.params.id);
  }
  componentWillReceiveProps(nextProps) {
    console.log("props");
    this.getCourse(nextProps.match.params.id);
  }
  generateHistory() {
    let history = [];
    this.state.course.history.forEach(item => {
      history.push(<p key={item.year * 10 + item.sem}>{item.semester}</p>);
    });
  }
  render() {
    if (!this.state.course) {
      return null;
    }
    return (
      <Container>
        <br />
        <Row>
          <Col lg={8}>
            <h6>{this.state.course.id}</h6>
            <h3>{this.state.course.name}</h3>
          </Col>
        </Row>
        <Row>
          <Col lg={8}>
            <h5>{this.state.course.history[0].professor.name}</h5>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Course;
