import React, { Component } from "react";
import { Link } from "react-router-dom";

import Badge from "react-bootstrap/Badge";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

import TimeAgo from "react-timeago";

import { axiosPOST } from "../utils/axiosClient";
import { getDecodedToken } from "../utils/jwt";

class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      review: null,
      vote: null
    };
  }

  componentDidMount() {
    this.setState({ review: this.props.review, vote: this.props.vote });
  }

  render() {
    let isStudent = getDecodedToken().role === "student";
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
        {!this.props.hideCourse ? (
          <h5>
            <Link to={`/courses/${this.state.review.course.id}`}>{`${
              this.state.review.course.id
            } - ${this.state.review.course.name}`}</Link>
          </h5>
        ) : (
          ""
        )}
        <Table bordered responsive="lg" width="100%">
          <tbody>
            <tr>
              <td className="scores" width="30%">
                <Table responsive="md" width="30%">
                  <tbody>
                    <Row>
                      <Col width="15%">
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: badgeColor(
                              this.state.review.rating.difficulty
                            )
                          }}
                        >
                          {this.state.review.rating.difficulty}
                        </Badge>{" "}
                        Difficulty
                      </Col>
                      <Col width="15%">
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: badgeColor(
                              this.state.review.rating.attendance
                            )
                          }}
                        >
                          {this.state.review.rating.attendance}
                        </Badge>{" "}
                        Attendance
                      </Col>
                    </Row>
                    <Row>
                      <Col width="15%">
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: badgeColor(
                              this.state.review.rating.grading
                            )
                          }}
                        >
                          {this.state.review.rating.grading}
                        </Badge>{" "}
                        Grading
                      </Col>
                      <Col width="15%">
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: badgeColor(
                              this.state.review.rating.textbook
                            )
                          }}
                        >
                          {this.state.review.rating.textbook}
                        </Badge>{" "}
                        Textbook
                      </Col>
                    </Row>
                  </tbody>
                </Table>
                <center>
                  <Badge
                    variant="secondary"
                    style={{
                      backgroundColor: badgeColor(
                        this.state.review.rating.overall
                      )
                    }}
                  >
                    {this.state.review.rating.overall}
                  </Badge>{" "}
                  Overall
                </center>
              </td>
              <td className="comment" width="70%">
                {this.state.review.content}
                <br />
                <div className="d-flex justify-content-between">
                  <small className="text-muted">
                    Submitted <TimeAgo date={this.state.review.createdAt} /> by{" "}
                    {this.state.review.isAnonymous
                      ? "Anonymous"
                      : `${this.state.review.student.name} - ${
                          this.state.review.student.id
                        }`}
                  </small>
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
                </div>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

export default Review;
