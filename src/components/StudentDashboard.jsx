import React, { Component } from "react";

import { axiosGET } from "../utils/axiosClient";
import Collapse from "rc-collapse";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import SeeAll from "./SeeAll";

import "rc-collapse/assets/index.css";

class StudentDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: new Set(),
      professors: [],
      course: [],
      filter: {
        activeKeys: ["filter-time", "filter-type", "filter-dept"]
      }
    };
  }
  componentDidMount() {
    axiosGET("/api/courses")
    .then(res => {
      let departments = new Set();
      let professorEmail = new Set();
      let professors = [];
      res.data.forEach(course => {        
        course.history.forEach(history => {
          if(!professorEmail.has(history.professor.email)) {
            departments.add(history.professor.department);
            professorEmail.add(history.professor.email);
            professors.push(history.professor);
          }
        });
      });
      professors.sort((left, right) => {
        return right.name < left.name;
      });
      this.setState({
        departments,
        professors
      })
    });
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
  changeActiveKeys(newKeys) {
    this.setState({
      filter: {
        activeKeys: newKeys
      }
    });
   }
  render() {
    return (
      <Container>
        <br />
        <Row>
          <Col lg="3">
            <Row><Col>
              <h5>Filter Courses</h5>
              <hr />
            </Col></Row>
            <Row><Col>
              <Collapse activeKey={this.state.filter.activeKeys} onChange={this.changeActiveKeys.bind(this)}>
                <Collapse.Panel header="Time" key="filter-time"><Form.Group>
                  <Form.Check type="checkbox" id="time-upcoming" label="Upcoming" />
                  <Form.Check type="checkbox" id="time-current" label="Current" />
                  <Form.Check type="checkbox" id="time-previous" label="Previous" />
                </Form.Group></Collapse.Panel>
                <Collapse.Panel header="Type" key="filter-type">
                  <Form.Group>
                    <Form.Check type="radio" name="course-type" id="type-all" label="All" />
                    <Form.Check type="radio" name="course-type" id="type-cdc" label="CDCs" />
                    <Form.Check type="radio" name="course-type" id="type-humanities" label="Humanities" />
                  </Form.Group>
                </Collapse.Panel>
                <Collapse.Panel header="Department" key="filter-dept"><Form.Group>
                  {
                    this.generateDepartmentForm()
                  }
                </Form.Group></Collapse.Panel>
                <Collapse.Panel header="Professor" key="filter-prof"><Form.Group>
                  {
                    this.generateProfessorForm()
                  }
                </Form.Group></Collapse.Panel>
              </Collapse>
            </Col></Row>
          </Col>
          <Col>2</Col>
          <Col lg="3">3</Col>
        </Row>
      </Container>
    );
  }
}

export default StudentDashboard;
