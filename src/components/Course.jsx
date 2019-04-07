import React, { Component } from "react";
import { axiosGET } from "../utils/axiosClient";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CardDeck from "react-bootstrap/CardDeck";
import Card from "react-bootstrap/Card";
import Review from "./Review";

import SeeAll from "./SeeAll";
import QuestionSection from "./QuestionSection";

class Course extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: null,
      questions: [],
      reviews: [],
      votes: { Record: null, Reply: null }
    };
  }
  async getCourse(id) {
    const params = this.props.match.params;
    const url =
      `/api/courses/${id}` + (params.campus ? `?campus=${params.campus}` : "");
    try {
      let res = await axiosGET(url);
      this.setState({ course: res.data });
      this.getRecords();
    } catch (e) {
      console.log(e);
    }
  }
  getRecords() {
    if (!this.state.course) {
      return;
    }
    axiosGET(`/api/records/${this.state.course.id}`).then(res => {
      this.setState({ ...res.data });
    });
  }
  componentDidMount() {
    this.getCourse(this.props.match.params.id);
    axiosGET("/api/votes").then(res => {
      this.setState({ votes: { ...res.data } });
    });
  }
  componentWillReceiveProps(nextProps) {
    this.getCourse(nextProps.match.params.id);
    this.getRecords();
  }
  generateHistory() {
    let history = [];
    this.state.course.history.forEach(item => {
      history.push(<p key={item.year * 10 + item.sem}>{item.semester}</p>);
    });
  }
  generateReviewsList() {
    let reviews = [];
    this.state.reviews.forEach(review => {
      reviews.push(
        <Review
          key={`${review._id}`}
          review={review}
          vote={this.state.votes.Record && this.state.votes.Record[review._id]}
          hideCourse
        />
      );
    });
    return <SeeAll items={reviews} count={5} name="reviews" />;
  }
  render() {
    if (!this.state.course) {
      return null;
    }
    let getCards = () => {
      return this.state.course.history.map(item => (
        <Card key={item.year * 10 + item.semester}>
          <Card.Body
            style={{
              minWidth: "7rem",
              minHeight: "10rem"
            }}
          >
            <Card.Title>
              <h5>{item.year}</h5>
              <h6>Sem {item.semester}</h6>
            </Card.Title>
            <Card.Footer>{item.professor.name}</Card.Footer>
          </Card.Body>
        </Card>
      ));
    };
    return (
      <div className="container-fluid">
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
              <p>{this.props.match.params.campus}</p>
            </Col>
          </Row>
          <br />
          <br />
          <p>Download Previous Year Handouts</p>
          <Row style={{ overflowX: "auto" }}>
            <CardDeck className="d-flex flex-row flex-nowrap">
              {getCards()}
            </CardDeck>
          </Row>
          <br />
          <h3>Questions</h3>
          <QuestionSection
            questions={this.state.questions}
            votes={this.state.votes}
          />
          <br />
          <h3>Reviews</h3>
          <Col>{this.generateReviewsList()}</Col>
        </Container>
      </div>
    );
  }
}

export default Course;
