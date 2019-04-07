import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Slider from "rc-slider";
import Form from "react-bootstrap/Form";
import { axiosPOST } from "../utils/axiosClient";
import "rc-slider/assets/index.css";

class Composer extends Component {
  constructor(props) {
    super(props);
    this.fields = [
      "difficulty",
      "textbook",
      "grading",
      "attendance",
      "overall"
    ];
    this.submitForm = this.submitForm.bind(this);
  }
  clearState() {
    let state = { isSubmitting: false, submitted: false, rating: "" };
    this.fields.forEach(field => {
      state[field] = 0;
    });
    this.setState(state);
  }
  async submitForm(e) {
    this.setState({ isSubmitting: true });
    e.preventDefault();
    const review = e.target[0].value;
    const payload = {
      course: this.props.course._id,
      type: "Review",
      content: review,
      rating: {}
    };
    this.fields.forEach(field => (payload.rating[field] = this.state[field]));
    try {
      await axiosPOST("/api/records", payload);
      this.setState({ submitted: true });
    } catch (e) {
      console.log(e);
    }
    this.clearState();
    this.props.onHide();
  }
  componentDidMount() {
    this.clearState();
  }
  render() {
    const isSubmitting = this.state && this.state.isSubmitting;
    const desc = [
      "Level of Difficulty",
      "Textbook usage",
      "Grading",
      "Skippable classes",
      "Overall"
    ];
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Add your review for this course</Modal.Title>
        </Modal.Header>
        <Form onSubmit={this.submitForm}>
          <Modal.Body>
            {desc.map((label, index) => (
              <Form.Group key={this.fields[index]}>
                <Form.Label>{label}</Form.Label>
                <Slider
                  min={0}
                  max={5}
                  dots
                  onAfterChange={value => {
                    this.setState({
                      [this.fields[index]]: value
                    });
                  }}
                />
                <br />
              </Form.Group>
            ))}
            <br />
            <Form.Group controlId="reviewArea">
              <Form.Label>Please elaborate:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Your review here"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                this.clearState();
                this.props.onHide();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export default Composer;
