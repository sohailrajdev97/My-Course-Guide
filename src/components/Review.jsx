import React, { Component } from "react";
import { Link } from "react-router-dom";

import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import Collapse from "react-bootstrap/Collapse";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";

import TimeAgo from "react-timeago";

import { axiosPOST } from "../utils/axiosClient";
import { getDecodedToken } from "../utils/jwt";
<<<<<<< HEAD
import Button from "react-bootstrap/Button";
=======
import { labels } from "../assets/labels";
>>>>>>> ui: Add labels to review component

class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      review: null,
      vote: null,
      showAll: false
    };
  }

  componentDidMount() {
    this.setState({ review: this.props.review, vote: this.props.vote });
  }

  getContent() {
    let words = this.state.review.content.split(" ");
    if (words.length < 50) {
      return this.state.review.content;
    }
    return (
      <div>
        {words.slice(0, 50).join(" ")}
        <Collapse in={this.state.showAll}>
          <span>{words.slice(50).join(" ")}</span>
        </Collapse>
        <Button
          variant="link"
          size="sm"
          onClick={() => this.setState({ showAll: !this.state.showAll })}
        >
          See {this.state.showAll ? "less" : "more"}
        </Button>
      </div>
    );
  }

  render() {
    let isStudent = getDecodedToken().role === "student";
    if (!this.state.review) return <div />;
    let badgeVariant = val => {
      if (!this.state) return;
      switch (val) {
        case 1:
        case 2:
          return "danger";
        case 3:
          return "warning";
        case 4:
        case 5:
          return "success";
        default:
          return "warning";
      }
    };
    return (
      <div>
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
                  <OverlayTrigger
                          key={"top"}
                          placement={"top"}
                          overlay={<Tooltip id={`tooltip-top`}>{labels[4][this.state.review.rating.overall-1]}</Tooltip>}
                        >
                          <Button variant={badgeVariant(this.state.review.rating.overall)}>
                            {this.state.review.rating.overall}
                          </Button>
                        </OverlayTrigger>
                  </h2>
                </Col>
                <Col>
                  <Row>
                    <Col>
                      <span>
                      <OverlayTrigger
                          key={"top"}
                          placement={"top"}
                          overlay={<Tooltip id={`tooltip-top`}>{labels[0][this.state.review.rating.difficulty-1]}</Tooltip>}
                        >
                          <Button variant= {badgeVariant(this.state.review.rating.difficulty)} size="sm">
                            {this.state.review.rating.difficulty}
                          </Button>
                        </OverlayTrigger>
                        &nbsp;Difficulty
                      </span>
                    </Col>
                    <Col>
                      <div>
                      <OverlayTrigger
                          key={"top"}
                          placement={"top"}
                          overlay={<Tooltip id={`tooltip-top`}>{labels[3][this.state.review.rating.attendance-1]}</Tooltip>}
                        >
                          <Button variant={badgeVariant(this.state.review.rating.attendance)} size="sm">
                            {this.state.review.rating.attendance}
                          </Button>
                        </OverlayTrigger>
                        &nbsp;Attendance
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                    <OverlayTrigger
                          key={"top"}
                          placement={"top"}
                          overlay={<Tooltip id={`tooltip-top`}>{labels[2][this.state.review.rating.grading-1]}</Tooltip>}
                        >
                          <Button variant={badgeVariant(this.state.review.rating.grading)} size="sm">
                            {this.state.review.rating.grading}
                          </Button>
                        </OverlayTrigger>
                      &nbsp;Grading
                    </Col>
                    <Col>
                    <OverlayTrigger
                          key={"top"}
                          placement={"top"}
                          overlay={<Tooltip id={`tooltip-top`}>{labels[1][this.state.review.rating.textbook-1]}</Tooltip>}
                        >
                          <Button variant={badgeVariant(this.state.review.rating.textbook)} size="sm">
                            {this.state.review.rating.textbook}
                          </Button>
                        </OverlayTrigger>
                      &nbsp;Textbook
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col lg={8}>
              <Row>
                <Col style={{ wordWrap: "break-word" }}>
                  {this.getContent()}
                </Col>
              </Row>
              <Row>
                <Col lg={7}>
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
                <Col lg={5}>
                  {this.props.vote ? (
                    <ToggleButtonGroup
                      type="checkbox"
                      onChange={value => {
                        let action = null,
                          prev = this.state.vote;
                        if (this.state.vote) {
                          if (value.indexOf(this.state.vote) >= 0)
                            action = this.state.vote === "up" ? "down" : "up";
                          else action = this.state.vote;
                        } else {
                          action = value[0];
                        }
                        let vote = action === this.state.vote ? null : action;
                        this.setState({ vote });
                        axiosPOST("/api/votes/" + action, {
                          record: this.state.review._id
                        }).then(res => {
                          let review = { ...this.state.review };
                          switch (res.data.msg) {
                            case "Upvote added": {
                              review.upvotes++;
                              if (prev === "down") review.downvotes--;
                              break;
                            }
                            case "Downvote added": {
                              review.downvotes++;
                              if (prev === "up") review.upvotes--;
                              break;
                            }
                            case "Removed upvote": {
                              review.upvotes--;
                              break;
                            }
                            case "Removed downvote": {
                              review.downvotes--;
                              break;
                            }
                            default:
                              break;
                          }
                          this.setState({ review });
                        });
                      }}
                      value={
                        isStudent && this.state.vote ? [this.state.vote] : []
                      }
                    >
                      <ToggleButton
                        disabled={!isStudent}
                        value="up"
                        variant="outline-success"
                        size="sm"
                      >
                        Helpful ({this.state.review.upvotes})
                      </ToggleButton>
                      <ToggleButton
                        disabled={!isStudent}
                        value="down"
                        variant="outline-danger"
                        size="sm"
                      >
                        Not Helpful ({this.state.review.downvotes})
                      </ToggleButton>
                    </ToggleButtonGroup>
                  ) : null}
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
        <hr />
      </div>
    );
  }
}

export default Review;
