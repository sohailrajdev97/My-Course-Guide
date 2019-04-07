import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import TimeAgo from "react-timeago";
import SeeAll from "./SeeAll";

class QuestionSection extends Component {
  constructor(props) {
    super(props);
    this.state = { questions: [] };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ questions: [...nextProps.questions] });
  }

  render() {
    let genAnswers = question => {
      let answers = [];
      question.answers.forEach(answer =>
        answers.push(
          <Card key={answer.by.id + answer.createdAt} style={{ margin: "5px" }}>
            <Card.Body>
              {answer.content}
              <br />
              <div className="d-flex justify-content-between">
                <small className="text-muted">
                  Submitted <TimeAgo date={answer.createdAt} /> by{" "}
                  {`${answer.by.name} - ${answer.by.id}`}
                </small>
                <Button variant="outline-success" size="sm">
                  Helpful
                </Button>
              </div>
            </Card.Body>
          </Card>
        )
      );

      return <SeeAll items={answers} count={1} name="answers" />;
    };
    return (
      <Container>
        {this.state.questions.map(ques => (
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
                <Button
                  variant="outline-secondary"
                  size="sm"
                  style={{ marginRight: "5px" }}
                >
                  I also had this question
                </Button>
              </div>
              {genAnswers(ques)}
            </Card.Body>
          </Card>
        ))}
      </Container>
    );
  }
}

export default QuestionSection;
