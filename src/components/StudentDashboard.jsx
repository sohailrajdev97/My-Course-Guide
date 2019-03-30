import React, { Component } from "react";
import { Link } from "react-router-dom";

import { axiosGET } from "../utils/axiosClient";
import Collapse from "rc-collapse";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import SeeAll from "./SeeAll";

import "rc-collapse/assets/index.css";

class StudentDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: new Set(),
      professors: [],
      courses: [],
      filter: {
        activeKeys: ["filter-time", "filter-type", "filter-dept"],
        selectedDepartments: [],
        selectedProfs: []
      }
    };
  }
  componentDidMount() {
    axiosGET("/api/courses")
      .then(res => {
        let departments = new Set();
        let professorEmail = new Set();
        let professors = [];
        let courses = [];
        res.data.forEach(course => {
          courses.push(course);
          course.history.forEach(history => {
            if (!professorEmail.has(history.professor.email)) {
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
          courses,
          departments,
          professors
        })
      });
  }
  selectFilterItem(type, event) {

    let filterHash = {
      department: "selectedDepartments",
      professor: "selectedProfs"
    }

    let filter = { ...this.state.filter };

    if(type === "department") {
      filter.selectedProfs = [];
    }

    let index = filter[filterHash[type]].indexOf(event.target.value);

    if (index >= 0) filter[filterHash[type]].splice(index, 1);
    else filter[filterHash[type]].push(event.target.value);

    this.setState({ filter });
  }
  checkFilters(course) {

    let departments = course.history.map(history => history.professor.department);
    let profs = course.history.map(history => history.professor.email);
    let deptFilter = false, profFilter = false;

    if (this.state.filter.selectedDepartments.length === 0) {
      deptFilter = true;
    } else {
      this.state.filter.selectedDepartments.forEach(selectedDepartment => {
        if (departments.indexOf(selectedDepartment) >= 0) deptFilter = true;
      });
    }

    if (this.state.filter.selectedProfs.length === 0) {
      profFilter = true;
    } else {
      this.state.filter.selectedProfs.forEach(selectedProf => {
        if (profs.indexOf(selectedProf) >= 0) profFilter = true;
      });
    }

    return deptFilter && profFilter;

  }
  generateDepartmentForm() {
    let departments = [];
    this.state.departments.forEach(department => {
      let id = Array.join(department.split(" "));
      departments.push(
        <Form.Check
          type="checkbox"
          label={department}
          key={`dept-${department}`}
          id={id}
          checked={this.state.filter.selectedDepartments.indexOf(department) >= 0 ? true : false}
          onChange={(event => { this.selectFilterItem("department", event) })}
          value={department}
        />
      );
    });
    return (
      <SeeAll items={departments} count={5} />
    );
  }
  generateProfessorForm() {
    let professors = [];
    this.state.professors.forEach(professor => {
      if (this.state.filter.selectedDepartments.indexOf(professor.department) >= 0 || this.state.filter.selectedDepartments.length === 0) {
        professors.push(
          <Form.Check
            type="checkbox"
            label={professor.name}
            key={`prof-${professor.email}`}
            id={`prof-${professor.email}`}
            checked={this.state.filter.selectedProfs.indexOf(professor.email) >= 0 ? true : false}
            onChange={(event => { this.selectFilterItem("professor", event) })}
            value={professor.email}
          />
        );
      }
    });
    return (
      <SeeAll items={professors} count={5} />
    );
  }
  generateCourseList() {
    let courses = [];
    this.state.courses.forEach(course => {
      if (this.checkFilters(course)) {
        let semester = course.history[0].year * 10 + course.history[0].semester;
        let professor = course.history[0].professor.name;
        course.history.forEach(history => {
          let currentSemester = history.year * 10 + history.semester;
          if (currentSemester > semester) {
            semester = currentSemester;
            professor = history.professor.name;
          }
        });
        courses.push(
          <Row key={`course-${course.id}`}>
            <Col>
              <Card>
                <Card.Header>
                  <Image src={`/api/courses/${course.id}/icon`} roundedCircle style={{ "float": "left", "marginRight": "5px" }} />
                  <h6>{course.id}</h6>
                  <h5>
                    <Link to={`/courses/${course.id}`}>
                      {course.name}
                    </Link>
                  </h5>
                  <h6>{professor}</h6>
                </Card.Header>
              </Card>
            </Col>
          </Row>
        );
      }
    });
    return <SeeAll items={courses} count={10} />;
  }
  changeActiveKeys(newKeys) {
    let filter = { ...this.state.filter }
    filter.activeKeys = newKeys;
    this.setState({ filter });
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
          <Col>
            {this.generateCourseList()}
          </Col>
          <Col lg="3">3</Col>
        </Row>
      </Container>
    );
  }
}

export default StudentDashboard;
