import React, { Component } from "react";
import { Link } from "react-router-dom";

import TimeAgo from "react-timeago";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
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
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  render() {
    let isStudent = getDecodedToken().role === "student";
    if (!this.state.review) return <div />;
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
                    <tr>
                      <td width="15%">
                        <Badge variant="secondary">
                          {this.state.review.rating.difficulty}
                        </Badge>{" "}
                        Difficulty
                      </td>
                      <td width="15%">
                        <Badge variant="secondary">
                          {this.state.review.rating.attendance}
                        </Badge>{" "}
                        Attendance
                      </td>
                    </tr>
                    <tr>
                      <td width="15%">
                        <Badge variant="secondary">
                          {this.state.review.rating.grading}
                        </Badge>{" "}
                        Grading
                      </td>
                      <td width="15%">
                        <Badge variant="secondary">
                          {this.state.review.rating.textbook}
                        </Badge>{" "}
                        Textbook
                      </td>
                    </tr>
                  </tbody>
                </Table>
                <center>
                  <Badge variant="secondary">
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
