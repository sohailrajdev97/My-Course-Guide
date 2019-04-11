import React, { Component } from "react";
import { Link } from "react-router-dom";

import Collapse from "rc-collapse";
import "rc-collapse/assets/index.css";

import ButtonToolbar from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

import SeeAll from "./SeeAll";
import { axiosGET } from "../utils/axiosClient";

class StudentDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: new Set(),
      professors: [],
      courses: [],
      votes: null,
      filter: {
        activeKeys: ["filter-time", "filter-type", "filter-dept"],
        selectedDepartments: [],
        departmentSearchField: "",
        profSearchField: "",
        selectedProfs: []
      }
    };
  }
  componentDidMount() {
    axiosGET("/api/courses").then(res => {
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
      });
    });
  }
  selectFilterItem(type, event) {
    let filterHash = {
      department: "selectedDepartments",
      professor: "selectedProfs"
    };

    let filter = { ...this.state.filter };

    if (type === "department") {
      filter.selectedProfs = [];
    }

    let index = filter[filterHash[type]].indexOf(event.target.value);

    if (index >= 0) filter[filterHash[type]].splice(index, 1);
    else filter[filterHash[type]].push(event.target.value);

    this.setState({ filter });
  }
  checkFilters(course) {
    let departments = course.history.map(
      history => history.professor.department
    );
    let profs = course.history.map(history => history.professor.email);
    let deptFilter = false,
      profFilter = false;

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
  departmentSearchFieldChange(e) {
    let filter = { ...this.state.filter };
    filter.departmentSearchField = e.target.value;
    this.setState({ filter });
  }

  profSearchFieldChange(e) {
    let filter = { ...this.state.filter };
    filter.profSearchField = e.target.value;
    this.setState({ filter });
  }

  generateDepartmentForm() {
    let departments = [];
    this.state.departments.forEach(department => {
      // let id = Array.join(department.split(" "));
      if (
        department
          .toLowerCase()
          .indexOf(this.state.filter.departmentSearchField.toLowerCase()) >= 0
      ) {
        departments.push(
          <Form.Check
            type="checkbox"
            label={department}
            key={`dept-${department}`}
            id={department}
            checked={
              this.state.filter.selectedDepartments.indexOf(department) >= 0
                ? true
                : false
            }
            onChange={event => {
              this.selectFilterItem("department", event);
            }}
            value={department}
          />
        );
      }
    });
    return <SeeAll items={departments} count={5} name="departments" />;
  }

  generateProfessorForm() {
    let professors = [];
    this.state.professors.forEach(professor => {
      if (
        (this.state.filter.selectedDepartments.indexOf(professor.department) >=
          0 ||
          this.state.filter.selectedDepartments.length === 0) &&
        professor.name
          .toLowerCase()
          .indexOf(this.state.filter.profSearchField.toLowerCase()) >= 0
      ) {
        professors.push(
          <Form.Check
            type="checkbox"
            label={professor.name}
            key={`prof-${professor.email}`}
            id={`prof-${professor.email}`}
            checked={
              this.state.filter.selectedProfs.indexOf(professor.email) >= 0
                ? true
                : false
            }
            onChange={event => {
              this.selectFilterItem("professor", event);
            }}
            value={professor.email}
          />
        );
      }
    });
    return <SeeAll items={professors} count={5} name="professors" />;
  }
  generateCourseList() {
    let courses = [];
    this.state.courses.forEach(course => {
      if (this.checkFilters(course)) {
        courses.push(
          <Row key={`course-${course.id}`}>
            <Col>
              <Card>
                <Card.Header>
                  <Image
                    src={`/image-generator/courses/${course.id}`}
                    roundedCircle
                    style={{ float: "left", marginRight: "5px" }}
                  />
                  <h6>{course.id}</h6>
                  <h5>
                    <Link to={`/courses/${course.id}`}>{course.name}</Link>
                  </h5>
                  <div style={{ lineHeight: "1px", padding: "4px" }}>
                    <h6>{course.history[0].professor.name}</h6>
                    <div className="d-flex justify-content-end">
                      <div className="p-2">
                        <Link
                          to={`/courses/${course.id}/#questions`}
                          style={{ fontSize: "small" }}
                        >
                          {course.numQuestions} Questions
                        </Link>
                      </div>
                      <div className="p-2">
                        <Link
                          to={`/courses/${course.id}/#reviews`}
                          style={{ fontSize: "small" }}
                        >
                          {course.numReviews} Reviews
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card.Header>
              </Card>
            </Col>
          </Row>
        );
      }
    });
    return <SeeAll items={courses} count={10} name="courses" />;
  }
  changeActiveKeys(newKeys) {
    let filter = { ...this.state.filter };
    filter.activeKeys = newKeys;
    this.setState({ filter });
  }
  render() {
    return (
      <Container>
        <br />
        <Row>
          <Col lg="3">
            <Row>
              <Col>
                <h5>Filter Courses</h5>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col>
                <Collapse
                  activeKey={this.state.filter.activeKeys}
                  onChange={this.changeActiveKeys.bind(this)}
                >
                  {/* <Collapse.Panel header="Time" key="filter-time">
                    <Form.Group>
                      <Form.Check
                        type="checkbox"
                        id="time-upcoming"
                        label="Upcoming"
                      />
                      <Form.Check
                        type="checkbox"
                        id="time-current"
                        label="Current"
                      />
                      <Form.Check
                        type="checkbox"
                        id="time-previous"
                        label="Previous"
                      />
                    </Form.Group>
                  </Collapse.Panel>
                  <Collapse.Panel header="Type" key="filter-type">
                    <Form.Group>
                      <Form.Check
                        type="radio"
                        name="course-type"
                        id="type-all"
                        label="All"
                      />
                      <Form.Check
                        type="radio"
                        name="course-type"
                        id="type-cdc"
                        label="CDCs"
                      />
                      <Form.Check
                        type="radio"
                        name="course-type"
                        id="type-humanities"
                        label="Humanities"
                      />
                    </Form.Group>
                  </Collapse.Panel> */}
                  <Collapse.Panel header="Department" key="filter-dept">
                    <Form.Control
                      type="text"
                      style={{ marginBottom: "5px" }}
                      placeholder="Search Department"
                      onChange={this.departmentSearchFieldChange.bind(this)}
                      value={this.state.filter.departmentSearchField}
                    />
                    <Form.Group style={{ marginLeft: "10px" }}>
                      {this.generateDepartmentForm()}
                    </Form.Group>
                  </Collapse.Panel>
                  <Collapse.Panel header="Professor" key="filter-prof">
                    <Form.Control
                      type="text"
                      style={{ marginBottom: "5px" }}
                      placeholder="Search Professor"
                      onChange={this.profSearchFieldChange.bind(this)}
                      value={this.state.filter.profSearchField}
                    />
                    <Form.Group style={{ marginLeft: "10px" }}>
                      {this.generateProfessorForm()}
                    </Form.Group>
                  </Collapse.Panel>
                </Collapse>
              </Col>
            </Row>
          </Col>
          <Col>
            <Form.Label>Sort By </Form.Label>
            <ButtonToolbar style={{ marginBottom: "5px", marginLeft: "10px" }}>
              <ToggleButtonGroup
                type="radio"
                name="options"
                size="sm"
                defaultValue={1}
                onChange={value => {
                  let courses = [...this.state.courses];
                  switch (value) {
                    case 1: {
                      courses.sort(function(a, b) {
                        if (a.id === b.id) return 0;
                        return a.id > b.id ? 1 : -1;
                      });
                      break;
                    }
                    case 2: {
                      courses.sort(function(a, b) {
                        if (a.numQuestions === b.numQuestions) return 0;
                        return a.numQuestions > b.numQuestions ? -1 : 1;
                      });
                      break;
                    }
                    case 3: {
                      courses.sort(function(a, b) {
                        if (a.numReviews === b.numReviews) return 0;
                        return a.numReviews > b.numReviews ? -1 : 1;
                      });
                      break;
                    }
                    default: {
                      break;
                    }
                  }
                  this.setState({ courses: courses });
                }}
              >
                <ToggleButton variant="outline-primary" value={1}>
                  A-Z
                </ToggleButton>
                <ToggleButton variant="outline-primary" value={2}>
                  Number of Questions
                </ToggleButton>
                <ToggleButton variant="outline-primary" value={3}>
                  Number of Reviews
                </ToggleButton>
              </ToggleButtonGroup>
            </ButtonToolbar>
            <br />
            {this.generateCourseList()}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default StudentDashboard;
