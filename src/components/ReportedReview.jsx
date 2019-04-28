import React, { Component } from "react";
import { Link } from "react-router-dom";

import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import TimeAgo from "react-timeago";
import { getDecodedToken } from "../utils/jwt";

class ReportedReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      review: null
    };
  }

  componentDidMount() {
    this.setState({
      review: this.props.review
    });
  }

  render() {
    let isAdmin = getDecodedToken().role === "admin";
    if (!isAdmin) return <div />;
    if (!this.state.review) return <div />;
    let badgeColor = val => {
      if (!this.state) return;
      switch (val) {
        case 1:
        case 2:
          return "#CC0000";
        case 3:
          return "#E1AD01";
        case 4:
        case 5:
          return "#009900";
        default:
          return "#E1AD01";
      }
    };
    return (
      <div>
        {}
        {!this.props.hideCourse ? (
          <h5>
            <Link to={`/courses/${this.state.review.course.id}`}>{`${
              this.state.review.course.id
            } - ${this.state.review.course.name}`}</Link>
          </h5>
        ) : (
          ""
        )}
        <Container>
          <Row>
            <Col lg={4} style={{ marginBottom: "auto", marginTop: "auto" }}>
              <Row>
                <Col lg={2}>
                  <h2>
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: badgeColor(
                          this.state.review.rating.overall
                        )
                      }}
                    >
                      {this.state.review.rating.overall}
                    </Badge>
                  </h2>
                </Col>
                <Col>
                  <Row>
                    <Col>
                      <span>
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: badgeColor(
                              this.state.review.rating.difficulty
                            )
                          }}
                        >
                          {this.state.review.rating.difficulty}
                        </Badge>
                        &nbsp;Difficulty
                      </span>
                    </Col>
                    <Col>
                      <div>
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: badgeColor(
                              this.state.review.rating.attendance
                            )
                          }}
                        >
                          {this.state.review.rating.attendance}
                        </Badge>
                        &nbsp;Attendance
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: badgeColor(
                            this.state.review.rating.grading
                          )
                        }}
                      >
                        {this.state.review.rating.grading}
                      </Badge>
                      &nbsp;Grading
                    </Col>
                    <Col>
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: badgeColor(
                            this.state.review.rating.textbook
                          )
                        }}
                      >
                        {this.state.review.rating.textbook}
                      </Badge>
                      &nbsp;Textbook
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col lg={8}>
              <Row>
                <Col style={{ wordWrap: "break-word" }}>
                  {this.state.review.content}
                </Col>
              </Row>
              <Row>
                <Col lg={7}>
                  <Row>
                    <Col>
                      <small className="text-muted">
                        Submitted <TimeAgo date={this.state.review.createdAt} />
                        &nbsp;by&nbsp;
                        {this.state.review.isAnonymous
                          ? "Anonymous"
                          : `${this.state.review.student.name} - ${
                              this.state.review.student.id
                            }`}
                      </small>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default ReportedReview;
