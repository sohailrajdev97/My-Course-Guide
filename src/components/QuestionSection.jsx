import React, { Component } from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import TimeAgo from "react-timeago";
import SeeAll from "./SeeAll";
import { axiosPOST } from "../utils/axiosClient";
import { getDecodedToken } from "../utils/jwt";

class QuestionSection extends Component {
  constructor(props) {
    super(props);
    this.state = { questions: [], votes: { Record: {}, Reply: {} } };
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
          <Card key={answer._id} style={{ margin: "5px" }}>
            <Card.Body>
              {answer.content}
              <br />
              <div className="d-flex justify-content-between">
                <small className="text-muted">
                  Submitted <TimeAgo date={answer.createdAt} /> by{" "}
                  {`${answer.by.name} - ` +
                    (answer.replierType === "Student"
                      ? `${answer.by.id}`
                      : "Professor")}
                </small>
                {isStudent && (
                  <ToggleButtonGroup
                    type="checkbox"
                    onChange={value => {
                      axiosPOST("/api/votes/up", {
                        reply: answer._id
                      }).then(() => {
                        let votes = this.state.votes.Reply;
                        if (votes[answer._id]) {
                          delete votes[answer._id];
                        } else {
                          votes[answer._id] = "up";
                        }
                        this.setState({ "votes.Reply": votes });
                      });
                    }}
                    defaultValue={this.state.votes.Reply[answer._id] ? [1] : []}
                  >
                    <ToggleButton value={1} variant="outline-success" size="sm">
                      {this.state.votes.Reply[answer._id] ? "Marked" : "Mark"}{" "}
                      as helpful
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
              </div>
            </Card.Body>
          </Card>
        )
      );

      return <SeeAll items={answers} count={1} name="answers" />;
    };

    let genQuestions = questions => {
      let items = [];
      questions.forEach(ques => {
        items.push(
          <Card key={ques._id}>
            <Card.Body>
              {ques.content}
              <br />
              <div className="d-flex justify-content-between">
                <small className="text-muted">
                  Submitted <TimeAgo date={ques.createdAt} /> by{" "}
                  {ques.isAnonymous
                    ? "Anonymous"
                    : `${ques.student.name} - ${ques.student.id}`}
                </small>
                {isStudent && (
                  <ToggleButtonGroup
                    type="checkbox"
                    onChange={value => {
                      axiosPOST("/api/votes/up", {
                        record: ques._id
                      }).then(() => {
                        let votes = this.state.votes.Record;
                        if (votes[ques._id]) {
                          delete votes[ques._id];
                        } else {
                          votes[ques._id] = "up";
                        }
                        this.setState({ "votes.Record": votes });
                      });
                    }}
                    defaultValue={this.state.votes.Record[ques._id] ? [1] : []}
                  >
                    <ToggleButton
                      value={1}
                      variant="outline-secondary"
                      size="sm"
                      style={{ marginRight: "5px" }}
                    >
                      I also had this question
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
              </div>
              {genAnswers(ques)}
            </Card.Body>
          </Card>
        );
      });
      return <SeeAll items={items} name="questions" count={3} />;
    };
    return <Container>{genQuestions(this.state.questions)}</Container>;
  }
}

export default QuestionSection;
