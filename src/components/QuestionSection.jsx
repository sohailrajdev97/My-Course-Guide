import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import SeeAll from "./SeeAll";
import Card from "react-bootstrap/Card";
import TimeAgo from "react-timeago";

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
          <Card key={answer}>
            <Card.Body>
              {answer.content}
              <br />
              <small>
                Submitted <TimeAgo date={answer.createdAt} /> by{" "}
                {`${answer.by.name} - ${answer.by.id}`}
              </small>
            </Card.Body>
          </Card>
        )
      );

      return <SeeAll items={answers} count={1} name="departments" />;
    };
    return (
      <Container id="questions">
        {this.state.questions.map(ques => (
          <Card>
            <Card.Body>
              {ques.content}
              <br />
              <small>
                Submitted <TimeAgo date={ques.createdAt} /> by{" "}
                {ques.isAnonymous
                  ? "Anonymous"
                  : `${ques.student.name} - ${ques.student.id}`}
              </small>
            </Card.Body>
            {genAnswers(ques)}
          </Card>
        ))}
      </Container>
    );
  }
}

export default QuestionSection;
