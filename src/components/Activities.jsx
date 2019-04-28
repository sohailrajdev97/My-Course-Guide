import React, { Component } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { axiosGET } from "../utils/axiosClient";

import Review from "./Review";
import QuestionSection from "./QuestionSection";
import SeeAll from "./SeeAll";

class Activities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      reviews: []
    };
  }
  componentDidMount() {
    axiosGET("/api/records").then(res => {
      this.setState({
        questions: res.data.questions,
        reviews: res.data.reviews
      });
    });
  }
  getReviews() {
    let reviews = [];
    this.state.reviews.forEach(review => {
      reviews.push(<Review key={`${review._id}`} review={review} />);
    });
    return reviews;
  }
  render() {
    return (
      <Container>
        <br />
        <Row>
          <Col>
            <h2 className="text-center">My Activities</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3 id="questions">Questions</h3>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col>
            <QuestionSection
              questions={this.state.questions}
              noVotes
              noAnswers
            />
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <h3 id="reviews">Reviews</h3>
            <hr />
            <SeeAll items={this.getReviews()} count={5} name="reviews" />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Activities;
