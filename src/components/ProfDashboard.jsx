import React, { Component } from "react";
import Collapse from "rc-collapse";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Review from "./Review";

import SeeAll from "./SeeAll";
import { axiosGET } from "../utils/axiosClient";

import "rc-collapse/assets/index.css";

class ProfDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      reviews: [],
      filter: {
        activeKeys: ["filter-course"],
        selectedCourses: []
      }
    };
  }
  componentDidMount() {
    axiosGET("/api/records").then(res => {
      let courseIDs = new Set();
      let courses = [];
      let reviews = [];
      res.data.reviews.forEach(review => {
        reviews.push(review);
        if (!courseIDs.has(review.course.id)) {
          courseIDs.add(review.course.id);
          courses.push(review.course);
        }
      });
      courses.sort((left, right) => {
        return right.name < left.name;
      });
      this.setState({ courses, reviews });
    });
  }
  selectFilterItem(type, event) {
    let filterHash = {
      course: "selectedCourses"
    };

    let filter = { ...this.state.filter };

    let index = filter[filterHash[type]].indexOf(event.target.value);

    if (index >= 0) filter[filterHash[type]].splice(index, 1);
    else filter[filterHash[type]].push(event.target.value);

    this.setState({ filter });
  }
  checkFilters(review) {
    return (
      this.state.filter.selectedCourses.length === 0 ||
      this.state.filter.selectedCourses.includes(review.course.id)
    );
  }
  generateCourseForm() {
    let courses = [];
    this.state.courses.forEach(course => {
      courses.push(
        <Form.Check
          type="checkbox"
          label={`${course.id} - ${course.name}`}
          key={`course-${course.id}`}
          id={`course-${course.id}`}
          checked={
            this.state.filter.selectedCourses.includes(course.id) ? true : false
          }
          onChange={event => {
            this.selectFilterItem("course", event);
          }}
          value={course.id}
        />
      );
    });
    return <SeeAll items={courses} count={5} name="courses" />;
  }
  generateReviewsList() {
    let reviews = [];
    this.state.reviews.forEach(review => {
      if (this.checkFilters(review)) {
        reviews.push(<Review key={`${review._id}`} review={review} />);
      }
    });
    return <SeeAll items={reviews} count={10} name="reviews" />;
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
                <h5>Filter Reviews</h5>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col>
                <Collapse
                  activeKey={this.state.filter.activeKeys}
                  onChange={this.changeActiveKeys.bind(this)}
                >
                  <Collapse.Panel header="Course" key="filter-course">
                    <Form.Group>{this.generateCourseForm()}</Form.Group>
                  </Collapse.Panel>
                </Collapse>
              </Col>
            </Row>
          </Col>
          <Col>{this.generateReviewsList()}</Col>
        </Row>
      </Container>
    );
  }
}

export default ProfDashboard;
