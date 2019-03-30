import React, { Component } from "react";

import SeeAll from "./SeeAll";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

class StudentDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: ["Department 1", "Department 2", "Department 3"],
      professors: [
        {
          name: "Professor 1",
          email: "email1"
        },
        {
          name: "Professor 2",
          email: "email2"
        },
        {
          name: "Professor 3",
          email: "email3"
        }
      ]
    };
  }
  generateDepartmentForm() {
    let departments = [];
    this.state.departments.forEach(department => {
      let id = Array.join(department.split(" "));
      departments.push(
        <Form.Check type="checkbox" label={department} key={`dept-${department}`} id={id} />
      );
    });
    return (
      <SeeAll items={departments} count={5} />
    );
  }
  generateProfessorForm() {
    let professors = [];
    this.state.professors.forEach(professor => {
      professors.push(
        <Form.Check type="checkbox" label={professor.name} key={`prof-${professor.email}`} id={`prof-${professor.email}`} value={`prof-${professor.email}`} />
      );
    });
    return (
      <SeeAll items={professors} count={5} />
    );
  }
  render() {
    return (
      <Container>
        <br />
        <Row>
          <Col lg="2">
            <Row><Col>
              <h5>Filter Courses</h5>
              <hr />
            </Col></Row>
            <Row><Col>
              <h6>Time</h6>
              <Form.Group>
                <Form.Check type="checkbox" id="time-upcoming" label="Upcoming" />
                <Form.Check type="checkbox" id="time-current" label="Current" />
                <Form.Check type="checkbox" id="time-previous" label="Previous" />
              </Form.Group>
              <hr />
            </Col></Row>
            <Row><Col>
              <h6>Type</h6>
              <Form.Group>
                <Form.Check type="radio" name="course-type" id="type-all" label="All" />
                <Form.Check type="radio" name="course-type" id="type-cdc" label="CDCs" />
                <Form.Check type="radio" name="course-type" id="type-humanities" label="Humanities" />
              </Form.Group>
              <hr />
            </Col></Row>
            <Row><Col>
              <h6>Department</h6>
              <Form>
                <Form.Group>
                  {
                    this.generateDepartmentForm()
                  }
                </Form.Group>
              </Form>
              <hr />
            </Col></Row>
            <Row><Col>
              <h6>Professor</h6>
              <Form.Group>
                {
                  this.generateProfessorForm()
                }
              </Form.Group>
              <hr />
            </Col></Row>
          </Col>
          <Col>2</Col>
          <Col lg="2">3</Col>
        </Row>
      </Container>
    );
  }
}

export default StudentDashboard;
