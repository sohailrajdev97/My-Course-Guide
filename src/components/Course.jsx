import React, { Component } from "react";
import { axiosGET } from "../utils/axiosClient";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CardDeck from "react-bootstrap/CardDeck";
import Card from "react-bootstrap/Card";

class Course extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: null
    };
  }
  getCourse(id) {
    if (this.props.match.params.campus) {
      axiosGET(`/api/courses/${id}/${this.props.match.params.campus}`).then(
        res => {
          this.setState({ course: res.data });
        }
      );
    } else {
      axiosGET(`/api/courses/${id}`).then(res => {
        this.setState({ course: res.data });
      });
    }
  }
  componentDidMount() {
    this.getCourse(this.props.match.params.id);
  }
  componentWillReceiveProps(nextProps) {
    this.getCourse(nextProps.match.params.id);
  }
  generateHistory() {
    let history = [];
    this.state.course.history.forEach(item => {
      history.push(<p key={item.year * 10 + item.sem}>{item.semester}</p>);
    });
  }
  render() {
    if (!this.state.course) {
      return null;
    }
    let getCards = () => {
      return this.state.course.history.map(item => (
        <Card key={item.year * 10 + item.sem}>
          <Card.Body
            style={{
              minWidth: "7rem",
              minHeight: "10rem"
            }}
          >
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
          <p>Download Previous Year Handouts</p>
          <Row style={{ overflowX: "auto" }}>
            <CardDeck className="d-flex flex-row flex-nowrap">
              {getCards()}
            </CardDeck>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Course;
