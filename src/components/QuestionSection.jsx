import React, { Component } from "react";
import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

import TimeAgo from "react-timeago";

import SeeAll from "./SeeAll";

import { axiosPOST } from "../utils/axiosClient";
import { getDecodedToken } from "../utils/jwt";

class QuestionSection extends Component {
  constructor(props) {
    super(props);
    this.user = getDecodedToken();
    this.state = {
      questions: [],
      votes: { Record: {}, Reply: {} }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      questions: [...nextProps.questions],
      votes: { ...nextProps.votes }
    });
  }

  render() {
    let isStudent = getDecodedToken().role === "student";
    let genAnswers = question => {
      let answers = [];
      question.answers.forEach(answer =>
        answers.push(
          <Container key={answer._id} style={{ paddingLeft: "4%" }}>
            <hr />
            <Row>
              <Col>{answer.content}</Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted">
                  Submitted <TimeAgo date={answer.createdAt} /> by{" "}
                  {`${answer.by.name} - ` +
                    (answer.replierType === "Student"
                      ? `${answer.by.id}`
                      : "Professor")}
                </small>
              </Col>
              {this.props.noVotes ? null : (
                <Col className="text-right">
                  <ToggleButtonGroup
                    type="checkbox"
                    onChange={value => {
                      axiosPOST("/api/votes/up", {
                        reply: answer._id
                      }).then(() => {
                        let votes = this.state.votes.Reply;
                        if (votes[answer._id]) {
                          delete votes[answer._id];
                          answer.upvotes--;
                        } else {
                          votes[answer._id] = "up";
                          answer.upvotes++;
                        }
                        this.setState({ "votes.Reply": votes });
                      });
                    }}
                    defaultValue={
                      isStudent && this.state.votes.Reply[answer._id] ? [1] : []
                    }
                  >
                    <ToggleButton
                      value={1}
                      variant="outline-success"
                      size="sm"
                      disabled={!isStudent}
                    >
                      {isStudent && this.state.votes.Reply[answer._id]
                        ? "Marked"
                        : "Mark"}
                      &nbsp;as helpful ({answer.upvotes})
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Col>
              )}
            </Row>
          </Container>
        )
      );

      return <SeeAll items={answers} count={1} name="answers" />;
    };

    let genQuestions = questions => {
      let items = [];
      questions.forEach(ques =>
        items.push(
          <Card key={ques._id}>
            <Card.Header>
              {!this.props.hideCourse ? (
                <h5>
                  <Link to={`/courses/${ques.course.id}`}>{`${
                    ques.course.id
                  } - ${ques.course.name}`}</Link>
                </h5>
              ) : (
                ""
              )}
            </Card.Header>
            <Card.Body>
              <Container>
                <Row>
                  <Col>{ques.content}</Col>
                </Row>
                <Row>
                  <Col>
                    {" "}
                    <small className="text-muted">
                      Submitted <TimeAgo date={ques.createdAt} /> by{" "}
                      {ques.isAnonymous
                        ? "Anonymous"
                        : `${ques.student.name} - ${ques.student.id}`}
                    </small>
                  </Col>
                  {this.props.noVotes ? null : (
                    <Col className="text-right">
                      <ToggleButtonGroup
                        type="checkbox"
                        onChange={value => {
                          axiosPOST("/api/votes/up", {
                            record: ques._id
                          }).then(() => {
                            let votes = this.state.votes.Record;
                            if (votes[ques._id]) {
                              delete votes[ques._id];
                              ques.upvotes--;
                            } else {
                              votes[ques._id] = "up";
                              ques.upvotes++;
                            }
                            this.setState({ "votes.Record": votes });
                          });
                        }}
                        defaultValue={
                          isStudent && this.state.votes.Record[ques._id]
                            ? [1]
                            : []
                        }
                      >
                        <ToggleButton
                          disabled={!isStudent}
                          value={1}
                          variant="outline-secondary"
                          size="sm"
                          style={{ marginRight: "5px" }}
                        >
                          I also had this question ({ques.upvotes})
                        </ToggleButton>
                      </ToggleButtonGroup>
                      {this.user.role !== "admin" ? (
                        <Button
                          onClick={() => {
                            this.props.giveAnswer(ques);
                          }}
                          size="sm"
                          variant="outline-primary"
                        >
                          Add Answer
                        </Button>
                      ) : null}
                    </Col>
                  )}
                </Row>
              </Container>
              {this.props.noAnswers ? null : genAnswers(ques)}
            </Card.Body>
          </Card>
        )
      );
      return <SeeAll items={items} name="questions" count={3} />;
    };
    return <div>{genQuestions(this.state.questions)}</div>;
  }
}

export default QuestionSection;
