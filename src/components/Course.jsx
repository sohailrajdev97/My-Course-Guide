import React, { Component } from "react";

import Collapse from "rc-collapse";
import "rc-collapse/assets/index.css";

import { get, groupBy, pick, sortBy } from "lodash";

import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ReactSpeedometer from "react-d3-speedometer";
import Row from "react-bootstrap/Row";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

import Plot from "react-plotly.js";

import Composer from "./Composer";
import QuestionSection from "./QuestionSection";
import Review from "./Review";
import SeeAll from "./SeeAll";

import { axiosGET } from "../utils/axiosClient";
import { getDecodedToken } from "../utils/jwt";
import { calcAvg } from "../utils/graphing";
const dateformat = require("dateformat");

class Course extends Component {
  constructor(props) {
    super(props);
    this.user = getDecodedToken();
    this.state = {
      course: null,
      questions: [],
      reviews: [],
      votes: { Record: {}, Reply: {} },
      showComposer: false,
      type: "",
      currQuestion: null,
      liteRating: 0,
      crossCampus: null
    };
  }
  async getCourse(id) {
    const params = this.props.match.params;
    const url =
      `/api/courses/${id}` + (params.campus ? `?campus=${params.campus}` : "");
    try {
      let res = await axiosGET(url);
      let averages = res.data.averages;
      let liteRating = Math.floor(
        (10 * averages.attendance +
          10 * averages.grading +
          10 * averages.difficulty +
          3 * averages.textbook +
          5 * averages.overall) /
          1.9
      );
      this.setState({ course: res.data, liteRating });
      this.getRecords();
      this.user.role === "admin" && this.crossCampus();
    } catch (e) {
      console.log(e);
    }
  }
  getRecords() {
    if (!this.state.course) {
      return;
    }
    const params = this.props.match.params;
    axiosGET(
      `/api/records/${this.state.course.id}` +
        (params.campus ? `?campus=${params.campus}` : "")
    ).then(res => {
      this.setState({ ...res.data });
    });
  }
  getHandout(file) {
    axiosGET(`/api/handouts/${file}`).then(res => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file);
      document.body.appendChild(link);
      link.click();
    });
  }
  componentDidMount() {
    this.getCourse(this.props.match.params.id);
    this.user.role !== "admin" &&
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
  crossCampus() {
    let reviews = [];
    axiosGET(`/api/records/${this.state.course.id}`).then(res => {
      res.data.reviews.forEach(review => {
        reviews.push(pick(review, ["course.campus", "rating", "createdAt"]));
      });
      sortBy(reviews, "createdAt");
      let campusWise = groupBy(reviews, "course.campus");
      let data = [];
      for (let [campus, reviews] of Object.entries(campusWise)) {
        let groupedByMY = groupBy(reviews, review =>
          dateformat(review.createdAt, "mmmm yyyy")
        );
        let x = [],
          y = [];
        for (let monthlyRevs of Object.values(groupedByMY)) {
          x.push(new Date(monthlyRevs[0].createdAt));
          y.push(calcAvg(monthlyRevs.map(rev => rev.rating)).overall);
        }
        data.push({
          x,
          y,
          name: campus
        });
      }
      let layout = {
        title: "Overall rating across campuses",
        xaxis: {
          rangeslider: { visible: true },
          type: "date"
        },
        yaxis: {
          range: [1, 5]
        }
      };
      this.setState({ crossCampus: <Plot data={data} layout={layout} /> });
    });
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
            <br />
            {item.handout ? (
              <Button
                variant="outline-primary"
                onClick={() => {
                  this.getHandout(item.handout);
                }}
              >
                Download Handout
              </Button>
            ) : null}
          </Card.Body>
        </Card>
      ));
    };
    return (
      <div className="container-fluid">
        <Container>
          <Row>
            <Col lg={8} className="pt-5">
              <h6>{this.state.course.id}</h6>
              <h3>{this.state.course.name}</h3>
              <h5>{this.state.course.history[0].professor.name}</h5>
              <p>{this.props.match.params.campus}</p>
            </Col>
            <Col lg={4} className="pt-5">
              <ReactSpeedometer
                value={this.state.liteRating}
                fluidWidth
                minValue={0}
                maxValue={100}
                startColor="#CC0000"
                endColor="#009900"
                maxSegmentLabels={5}
                segments={50}
              />
              <center>Litemeter Rating</center>
            </Col>
          </Row>
          <Row>
            <Col>
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
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <center>{this.state.crossCampus}</center>
            </Col>
          </Row>
          <Row>
            <Col>
              <h3 id="questions">Questions</h3>
            </Col>
            <Col className="text-right">
              {this.user.role === "student" ? (
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    this.setState({ showComposer: true, type: "Question" });
                  }}
                >
                  Ask a question
                </Button>
              ) : null}
            </Col>
          </Row>
          <Row>
            <Col>
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
                hideCourse
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <h3 id="reviews">Reviews</h3>
            </Col>
            <Col className="text-right">
              {this.user.role === "student" &&
              this.user.courses.indexOf(this.state.course._id) >= 0 ? (
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    this.setState({ showComposer: true, type: "Review" });
                  }}
                >
                  Add your review
                </Button>
              ) : null}
            </Col>
          </Row>
          {this.state.reviews.length > 0 ? (
            <ButtonToolbar style={{ marginBottom: "5px", marginLeft: "10px" }}>
              <ToggleButtonGroup
                type="radio"
                name="options"
                size="sm"
                defaultValue={1}
                onChange={value => {
                  let reviews = [...this.state.reviews];
                  let sortFunc = param => (a, b) => {
                    if (get(a, param) === get(b, param)) return 0;
                    return get(a, param) > get(b, param) ? -1 : 1;
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
          ) : null}
          <Col>{this.generateReviewsList()}</Col>
        </Container>
        <Composer
          show={this.state.showComposer}
          onHide={() => {
            this.setState({ showComposer: false });
          }}
          refreshRecords={this.getRecords.bind(this)}
          question={this.state.currQuestion}
          course={this.state.course}
          type={this.state.type}
        />
      </div>
    );
  }
}

export default Course;
