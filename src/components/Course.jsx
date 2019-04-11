import React, { Component } from "react";
import { axiosGET } from "../utils/axiosClient";
import Form from "react-bootstrap/Form";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CardDeck from "react-bootstrap/CardDeck";
import Card from "react-bootstrap/Card";
import Review from "./Review";
import ButtonToolbar from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import SeeAll from "./SeeAll";
import QuestionSection from "./QuestionSection";
import Composer from "./Composer";
import Collapse from "rc-collapse";
import Button from "react-bootstrap/Button";
require("rc-collapse/assets/index.css");
const _ = require("lodash");

class Course extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: null,
      questions: [],
      reviews: [],
      votes: { Record: null, Reply: null },
      showComposer: false,
      type: "",
      currQuestion: null
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
        <Card
          key={item.year * 10 + item.semester}
          style={{ minWidth: "7rem", maxWidth: "12rem" }}
        >
          <Card.Body style={{ minHeight: "10rem" }}>
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
          <Collapse>
            <Collapse.Panel header="Download Previous Year Handouts">
              <Row style={{ overflowX: "auto" }}>
                <CardDeck
                  className="d-flex flex-row flex-nowrap"
                  style={{ marginLeft: "0.125rem" }}
                >
                  {getCards()}
                </CardDeck>
              </Row>
            </Collapse.Panel>
          </Collapse>
          <br />
          <h3>
            <Button
              variant="outline-primary"
              onClick={() => {
                this.setState({ showComposer: true, type: "Question" });
              }}
            >
              +
            </Button>{" "}
            Questions
          </h3>
          <QuestionSection
            giveAnswer={qid => {
              this.setState({
                showComposer: true,
                currQuestion: qid,
                type: "Answer"
              });
            }}
            questions={this.state.questions}
            votes={this.state.votes}
          />
          <br />
          <h3>
            <Button
              variant="outline-primary"
              onClick={() => {
                this.setState({ showComposer: true, type: "Review" });
              }}
            >
              +
            </Button>{" "}
            Reviews
          </h3>
          <Form.Label>Sort By: </Form.Label>
          <ButtonToolbar style={{ marginBottom: "5px", marginLeft: "10px" }}>
            <ToggleButtonGroup
              type="radio"
              name="options"
              size="sm"
              defaultValue={1}
              onChange={value => {
                let reviews = [...this.state.reviews];
                let sortFunc = param => (a, b) => {
                  if (_.get(a, param) === _.get(b, param)) return 0;
                  return _.get(a, param) > _.get(b, param) ? -1 : 1;
                };
                switch (value) {
                  case 1: {
                    reviews.sort(sortFunc("createdAt"));
                    break;
                  }
                  case 2: {
                    reviews.sort(sortFunc("upvotes"));
                    break;
                  }
                  case 3: {
                    reviews.sort(sortFunc("rating.overall"));
                    break;
                  }
                  case 4: {
                    reviews.sort(sortFunc("content.length"));
                    break;
                  }
                  default: {
                    break;
                  }
                }
                this.setState({ reviews: reviews });
              }}
            >
              <ToggleButton variant="outline-primary" value={1}>
                Most Recent
              </ToggleButton>
              <ToggleButton variant="outline-primary" value={2}>
                Most Helpful
              </ToggleButton>
              <ToggleButton variant="outline-primary" value={3}>
                Overall Rating
              </ToggleButton>
              <ToggleButton variant="outline-primary" value={4}>
                Review Length
              </ToggleButton>
            </ToggleButtonGroup>
          </ButtonToolbar>
          <Col>{this.generateReviewsList()}</Col>
        </Container>
        <Composer
          show={this.state.showComposer}
          onHide={() => {
            this.setState({ showComposer: false });
          }}
          question={this.state.currQuestion}
          course={this.state.course}
          type={this.state.type}
        />
      </div>
    );
  }
}

export default Course;
